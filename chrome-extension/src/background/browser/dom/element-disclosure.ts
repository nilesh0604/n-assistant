import { createLogger } from '@src/background/log';
import type { ElementSummary, DOMSummary } from './summary';
import type { ActionResult } from '@src/background/agent/types';

const logger = createLogger('ElementDisclosure');

/**
 * Task context for element relevance scoring
 */
export interface TaskContext {
  currentTask: string;
  taskPhase: 'navigation' | 'interaction' | 'form_filling' | 'verification' | 'exploration';
  targetElements?: string[]; // Expected target types (button, input, link, etc.)
  previousActions: ActionResult[];
  currentUrl: string;
  executionStep: number;
}

/**
 * Configuration for progressive element disclosure
 */
export interface ElementDisclosureConfig {
  maxEssentialElements: number;
  maxRelevantElements: number;
  relevanceThreshold: number; // 0-1 score threshold
  taskTypeWeights: {
    navigation: { text: number, interactive: number, position: number };
    interaction: { text: number, interactive: number, position: number };
    form_filling: { text: number, interactive: number, position: number };
    verification: { text: number, interactive: number, position: number };
    exploration: { text: number, interactive: number, position: number };
  };
}

/**
 * Element disclosure result with categorized elements
 */
export interface ElementDisclosure {
  essential: ElementSummary[];
  relevant: ElementSummary[];
  hidden: number;
  totalElements: number;
  disclosureRatio: number; // essential + relevant / total
  metadata: {
    taskPhase: string;
    relevanceScores: number[];
    filteredReasons: string[];
  };
}

/**
 * Element relevance score with reasoning
 */
export interface ElementRelevance {
  element: ElementSummary;
  score: number;
  reasoning: string[];
  category: 'essential' | 'relevant' | 'hidden';
}

/**
 * Progressive Element Disclosure Service
 * Filters DOM elements by relevance to reduce LLM context noise
 */
export class ElementDisclosureService {
  private config: ElementDisclosureConfig;

  constructor(config?: Partial<ElementDisclosureConfig>) {
    this.config = {
      maxEssentialElements: 20,
      maxRelevantElements: 50,
      relevanceThreshold: 0.3,
      taskTypeWeights: {
        navigation: { text: 0.4, interactive: 0.4, position: 0.2 },
        interaction: { text: 0.3, interactive: 0.5, position: 0.2 },
        form_filling: { text: 0.2, interactive: 0.6, position: 0.2 },
        verification: { text: 0.5, interactive: 0.3, position: 0.2 },
        exploration: { text: 0.3, interactive: 0.3, position: 0.4 },
      },
      ...config,
    };
  }

  /**
   * Filter elements by relevance based on task context
   */
  filterElementsByRelevance(
    elements: ElementSummary[],
    taskContext: TaskContext,
    domSummary?: DOMSummary
  ): ElementDisclosure {
    logger.debug(`Filtering ${elements.length} elements for task: ${taskContext.currentTask}`);

    // Score all elements
    const scoredElements = this.scoreElements(elements, taskContext, domSummary);
    
    // Sort by relevance score (descending)
    scoredElements.sort((a, b) => b.score - a.score);

    // Categorize elements
    const essential = scoredElements
      .filter(item => item.category === 'essential')
      .slice(0, this.config.maxEssentialElements)
      .map(item => item.element);

    const relevant = scoredElements
      .filter(item => item.category === 'relevant')
      .slice(0, this.config.maxRelevantElements)
      .map(item => item.element);

    const hidden = elements.length - essential.length - relevant.length;
    const disclosureRatio = (essential.length + relevant.length) / elements.length;

    logger.debug(
      `Disclosure result: ${essential.length} essential, ${relevant.length} relevant, ${hidden} hidden`
    );

    return {
      essential,
      relevant,
      hidden,
      totalElements: elements.length,
      disclosureRatio,
      metadata: {
        taskPhase: taskContext.taskPhase,
        relevanceScores: scoredElements.map(item => item.score),
        filteredReasons: scoredElements
          .filter(item => item.category === 'hidden')
          .flatMap(item => item.reasoning),
      },
    };
  }

  /**
   * Score elements based on relevance to task context
   */
  private scoreElements(
    elements: ElementSummary[],
    taskContext: TaskContext,
    domSummary?: DOMSummary
  ): ElementRelevance[] {
    const weights = this.config.taskTypeWeights[taskContext.taskPhase];
    const taskKeywords = this.extractTaskKeywords(taskContext.currentTask);

    return elements.map(element => {
      const score = this.calculateElementScore(element, taskContext, weights, taskKeywords);
      const reasoning = this.generateScoreReasoning(element, taskContext, score);
      const category = this.categorizeElement(score, element, taskContext);

      return {
        element,
        score,
        reasoning,
        category,
      };
    });
  }

  /**
   * Calculate relevance score for a single element
   */
  private calculateElementScore(
    element: ElementSummary,
    taskContext: TaskContext,
    weights: { text: number; interactive: number; position: number },
    taskKeywords: string[]
  ): number {
    let score = 0;

    // Text relevance (0-1)
    const textScore = this.calculateTextRelevance(element, taskKeywords);
    score += textScore * weights.text;

    // Interactive relevance (0-1)
    const interactiveScore = this.calculateInteractiveRelevance(element, taskContext);
    score += interactiveScore * weights.interactive;

    // Position relevance (0-1)
    const positionScore = this.calculatePositionRelevance(element, taskContext);
    score += positionScore * weights.position;

    // Visibility bonus
    if (element.isVisible) {
      score += 0.1;
    }

    // Target type bonus
    if (taskContext.targetElements?.includes(element.tagName.toLowerCase())) {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Calculate text relevance based on keyword matching
   */
  private calculateTextRelevance(element: ElementSummary, keywords: string[]): number {
    if (keywords.length === 0) return 0.5;

    const elementText = `${element.text} ${element.attributes['aria-label'] || ''} ${
      element.attributes['title'] || ''
    }`.toLowerCase();

    const matchedKeywords = keywords.filter(keyword => 
      elementText.includes(keyword.toLowerCase())
    );

    return matchedKeywords.length / keywords.length;
  }

  /**
   * Calculate interactive relevance based on element type and task phase
   */
  private calculateInteractiveRelevance(element: ElementSummary, taskContext: TaskContext): number {
    if (!element.isInteractive) return 0.1;

    const tagName = element.tagName.toLowerCase();
    
    switch (taskContext.taskPhase) {
      case 'navigation':
        return ['a', 'button', 'nav'].includes(tagName) ? 1.0 : 0.5;
      case 'interaction':
        return ['button', 'input', 'select', 'textarea'].includes(tagName) ? 1.0 : 0.6;
      case 'form_filling':
        return ['input', 'select', 'textarea', 'label'].includes(tagName) ? 1.0 : 0.3;
      case 'verification':
        return element.text.includes('error') || element.text.includes('success') ? 1.0 : 0.4;
      case 'exploration':
        return element.isInteractive ? 0.8 : 0.2;
      default:
        return 0.5;
    }
  }

  /**
   * Calculate position relevance based on viewport and hierarchy
   */
  private calculatePositionRelevance(element: ElementSummary, taskContext: TaskContext): number {
    // Extract position from xpath or use index as proxy
    const xpathParts = element.xpath.split('/');
    const depth = xpathParts.length;
    
    // Prefer elements that are not too deep in the DOM
    const depthScore = Math.max(0, 1 - (depth - 3) * 0.1);
    
    // Prefer elements with reasonable index (not too far down)
    const indexScore = Math.max(0, 1 - element.index * 0.01);
    
    return (depthScore + indexScore) / 2;
  }

  /**
   * Extract relevant keywords from task description
   */
  private extractTaskKeywords(task: string): string[] {
    // Simple keyword extraction - can be enhanced with NLP
    const keywords: string[] = [];
    
    // Extract action words
    const actionWords = ['click', 'type', 'select', 'fill', 'submit', 'search', 'navigate', 'login'];
    const foundActions = actionWords.filter(action => task.toLowerCase().includes(action));
    keywords.push(...foundActions);
    
    // Extract target words
    const targetWords = ['button', 'input', 'link', 'form', 'menu', 'search', 'login', 'submit'];
    const foundTargets = targetWords.filter(target => task.toLowerCase().includes(target));
    keywords.push(...foundTargets);
    
    // Extract quoted text as exact matches
    const quotedMatches = task.match(/"([^"]+)"/g);
    if (quotedMatches) {
      keywords.push(...quotedMatches.map(match => match.replace(/"/g, '')));
    }
    
    return [...new Set(keywords)]; // Remove duplicates
  }

  /**
   * Generate reasoning for element score
   */
  private generateScoreReasoning(
    element: ElementSummary,
    taskContext: TaskContext,
    score: number
  ): string[] {
    const reasons: string[] = [];
    
    if (element.isInteractive) {
      reasons.push('Interactive element');
    }
    
    if (element.isVisible) {
      reasons.push('Visible element');
    }
    
    if (element.text && element.text.length > 0) {
      reasons.push(`Has text: "${element.text.substring(0, 30)}..."`);
    }
    
    if (element.attributes['aria-label']) {
      reasons.push(`Has aria-label: "${element.attributes['aria-label']}"`);
    }
    
    if (score > 0.7) {
      reasons.push('High relevance to task');
    } else if (score < 0.3) {
      reasons.push('Low relevance to task');
    }
    
    return reasons;
  }

  /**
   * Categorize element based on score and characteristics
   */
  private categorizeElement(
    score: number,
    element: ElementSummary,
    taskContext: TaskContext
  ): 'essential' | 'relevant' | 'hidden' {
    // Essential: high score and interactive/visible
    if (score >= this.config.relevanceThreshold * 1.5 && 
        (element.isInteractive || element.text.length > 0)) {
      return 'essential';
    }
    
    // Relevant: above threshold
    if (score >= this.config.relevanceThreshold) {
      return 'relevant';
    }
    
    // Hidden: below threshold
    return 'hidden';
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ElementDisclosureConfig>): void {
    this.config = { ...this.config, ...newConfig };
    logger.debug('Updated element disclosure configuration');
  }

  /**
   * Get current configuration
   */
  getConfig(): ElementDisclosureConfig {
    return { ...this.config };
  }
}
