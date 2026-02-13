import { createLogger } from '@src/background/log';
import { DOMState, DOMElementNode } from '../browser/dom/views';

const logger = createLogger('ProgressiveElementDisclosure');

/**
 * Element relevance score for task-aware filtering
 */
export interface ElementRelevance {
  element: DOMElementNode;
  score: number;
  reasons: string[];
  category: 'navigation' | 'input' | 'content' | 'media' | 'decoration' | 'unknown';
}

/**
 * Task context for element filtering
 */
export interface TaskContext {
  taskType: 'navigation' | 'form_fill' | 'content_extraction' | 'general' | 'search' | 'purchase';
  keywords: string[];
  targetElements?: string[]; // Specific element types we're looking for
  excludeElements?: string[]; // Element types to exclude
  viewportOnly?: boolean; // Only consider viewport elements
  maxElements?: number; // Maximum number of elements to return
}

/**
 * Configuration for progressive disclosure
 */
export interface ProgressiveDisclosureConfig {
  enableTaskAwareFiltering: boolean;
  enableViewportPrioritization: boolean;
  enableSemanticGrouping: boolean;
  maxElementsPerCategory: number;
  relevanceThreshold: number;
}

/**
 * Default configuration
 */
export const DEFAULT_PROGRESSIVE_DISCLOSURE_CONFIG: ProgressiveDisclosureConfig = {
  enableTaskAwareFiltering: true,
  enableViewportPrioritization: true,
  enableSemanticGrouping: true,
  maxElementsPerCategory: 50,
  relevanceThreshold: 0.1,
};

/**
 * Progressive Element Disclosure Service
 * Filters and prioritizes elements based on task context
 */
export class ProgressiveElementDisclosureService {
  private config: ProgressiveDisclosureConfig;

  constructor(config: Partial<ProgressiveDisclosureConfig> = {}) {
    this.config = { ...DEFAULT_PROGRESSIVE_DISCLOSURE_CONFIG, ...config };
  }

  /**
   * Filter and rank elements based on task context
   */
  async filterElements(
    state: DOMState,
    taskContext: TaskContext
  ): Promise<{
    elements: ElementRelevance[];
    totalElements: number;
    filteredCount: number;
    categories: Record<string, number>;
  }> {
    const allElements = this.getAllInteractiveElements(state);
    const totalElements = allElements.length;

    // Calculate relevance scores
    const scoredElements = await this.scoreElements(allElements, taskContext);

    // Filter by relevance threshold
    const filteredElements = scoredElements.filter(
      element => element.score >= this.config.relevanceThreshold
    );

    // Sort by relevance score
    filteredElements.sort((a, b) => b.score - a.score);

    // Apply limits
    const limitedElements = this.applyLimits(filteredElements, taskContext);

    // Generate category statistics
    const categories = this.generateCategoryStats(limitedElements);

    logger.debug('Progressive element disclosure applied', {
      totalElements,
      filteredCount: filteredElements.length,
      returnedCount: limitedElements.length,
      taskType: taskContext.taskType,
    });

    return {
      elements: limitedElements,
      totalElements,
      filteredCount: filteredElements.length,
      categories,
    };
  }

  /**
   * Get all interactive elements from DOM state
   */
  private getAllInteractiveElements(state: DOMState): DOMElementNode[] {
    const elements: DOMElementNode[] = [];

    const collectElements = (node: unknown): void => {
      if (node instanceof DOMElementNode && node.isInteractive && node.highlightIndex !== null) {
        elements.push(node);
      }

      if (node && typeof node === 'object' && 'children' in node) {
        for (const child of (node as { children: unknown[] }).children) {
          collectElements(child);
        }
      }
    };

    collectElements(state.elementTree);
    return elements;
  }

  /**
   * Calculate relevance scores for elements
   */
  private async scoreElements(
    elements: DOMElementNode[],
    taskContext: TaskContext
  ): Promise<ElementRelevance[]> {
    const scoredElements: ElementRelevance[] = [];

    for (const element of elements) {
      const relevance = await this.calculateElementRelevance(element, taskContext);
      scoredElements.push(relevance);
    }

    return scoredElements;
  }

  /**
   * Calculate relevance score for a single element
   */
  private async calculateElementRelevance(
    element: DOMElementNode,
    taskContext: TaskContext
  ): Promise<ElementRelevance> {
    let score = 0;
    const reasons: string[] = [];
    const category = this.categorizeElement(element);

    // Base score by category
    const categoryScores = {
      navigation: 0.8,
      input: 0.9,
      content: 0.3,
      media: 0.2,
      decoration: 0.1,
      unknown: 0.4,
    };
    score = categoryScores[category] || 0.4;
    reasons.push(`Category: ${category}`);

    // Task type adjustments
    score += this.calculateTaskTypeScore(category, taskContext.taskType, reasons);

    // Keyword matching
    score += this.calculateKeywordScore(element, taskContext.keywords, reasons);

    // Target element matching
    if (taskContext.targetElements) {
      score += this.calculateTargetScore(element, taskContext.targetElements, reasons);
    }

    // Exclusion filtering
    if (taskContext.excludeElements) {
      score += this.calculateExclusionScore(element, taskContext.excludeElements, reasons);
    }

    // Viewport prioritization
    if (this.config.enableViewportPrioritization && taskContext.viewportOnly) {
      score += this.calculateViewportScore(element, reasons);
    }

    // Visibility and interaction factors
    score += this.calculateVisibilityScore(element, reasons);

    // Text content relevance
    score += this.calculateTextRelevanceScore(element, taskContext, reasons);

    // Normalize score to 0-1 range
    score = Math.max(0, Math.min(1, score));

    return {
      element,
      score,
      reasons,
      category,
    };
  }

  /**
   * Categorize element by type and purpose
   */
  private categorizeElement(element: DOMElementNode): ElementRelevance['category'] {
    const tagName = element.tagName?.toLowerCase() || '';
    const role = element.attributes.role || '';

    // Navigation elements
    if (['a', 'button'].includes(tagName) || role === 'link' || role === 'button') {
      return 'navigation';
    }

    // Input elements
    if (['input', 'textarea', 'select'].includes(tagName)) {
      return 'input';
    }

    // Media elements
    if (['img', 'video', 'audio', 'canvas'].includes(tagName)) {
      return 'media';
    }

    // Content elements
    if (['p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'article', 'section'].includes(tagName)) {
      return 'content';
    }

    // Decoration elements
    if (['hr', 'br', 'style', 'script'].includes(tagName)) {
      return 'decoration';
    }

    return 'unknown';
  }

  /**
   * Calculate score based on task type
   */
  private calculateTaskTypeScore(
    category: ElementRelevance['category'],
    taskType: TaskContext['taskType'],
    reasons: string[]
  ): number {
    const taskTypeScores: Record<string, Record<string, number>> = {
      navigation: { navigation: 0.3, input: 0.1, content: 0.1, media: 0.1, decoration: 0, unknown: 0.1 },
      form_fill: { input: 0.4, navigation: 0.1, content: 0, media: 0, decoration: 0, unknown: 0.1 },
      content_extraction: { content: 0.3, navigation: 0.1, input: 0, media: 0.2, decoration: 0, unknown: 0.1 },
      general: { navigation: 0.1, input: 0.1, content: 0.1, media: 0.1, decoration: 0, unknown: 0.1 },
      search: { input: 0.3, navigation: 0.2, content: 0.1, media: 0, decoration: 0, unknown: 0.1 },
      purchase: { input: 0.3, navigation: 0.2, content: 0.1, media: 0.1, decoration: 0, unknown: 0.1 },
    };

    const score = taskTypeScores[taskType]?.[category] || 0;
    if (score > 0) {
      reasons.push(`Relevant for ${taskType} task`);
    }

    return score;
  }

  /**
   * Calculate score based on keyword matching
   */
  private calculateKeywordScore(
    element: DOMElementNode,
    keywords: string[],
    reasons: string[]
  ): number {
    if (keywords.length === 0) return 0;

    let score = 0;
    const elementText = (element.getAllTextTillNextClickableElement() || '').toLowerCase();
    const attributes = Object.values(element.attributes).join(' ').toLowerCase();

    for (const keyword of keywords) {
      const lowerKeyword = keyword.toLowerCase();

      if (elementText.includes(lowerKeyword)) {
        score += 0.2;
        reasons.push(`Keyword "${keyword}" in text`);
      }

      if (attributes.includes(lowerKeyword)) {
        score += 0.1;
        reasons.push(`Keyword "${keyword}" in attributes`);
      }
    }

    return Math.min(0.5, score); // Cap at 0.5
  }

  /**
   * Calculate score for target elements
   */
  private calculateTargetScore(
    element: DOMElementNode,
    targetElements: string[],
    reasons: string[]
  ): number {
    const tagName = element.tagName?.toLowerCase() || '';

    if (targetElements.includes(tagName)) {
      reasons.push(`Target element type: ${tagName}`);
      return 0.3;
    }

    return 0;
  }

  /**
   * Calculate exclusion penalty
   */
  private calculateExclusionScore(
    element: DOMElementNode,
    excludeElements: string[],
    reasons: string[]
  ): number {
    const tagName = element.tagName?.toLowerCase() || '';

    if (excludeElements.includes(tagName)) {
      reasons.push(`Excluded element type: ${tagName}`);
      return -0.5;
    }

    return 0;
  }

  /**
   * Calculate viewport score
   */
  private calculateViewportScore(element: DOMElementNode, reasons: string[]): number {
    // This would check if element is in viewport
    // For now, assume all elements are visible
    if (element.isVisible) {
      reasons.push('Element in viewport');
      return 0.2;
    }

    return -0.1;
  }

  /**
   * Calculate visibility score
   */
  private calculateVisibilityScore(element: DOMElementNode, reasons: string[]): number {
    let score = 0;

    if (element.isVisible) {
      score += 0.2;
      reasons.push('Element visible');
    } else {
      score -= 0.3;
      reasons.push('Element not visible');
    }

    // Check for disabled state
    if (element.attributes.disabled === 'disabled' || element.attributes.disabled === 'true') {
      score -= 0.4;
      reasons.push('Element disabled');
    }

    return score;
  }

  /**
   * Calculate text relevance score
   */
  private calculateTextRelevanceScore(
    element: DOMElementNode,
    taskContext: TaskContext,
    reasons: string[]
  ): number {
    const text = element.getAllTextTillNextClickableElement() || '';

    // Prefer elements with meaningful text
    if (text.length > 0 && text.length < 100) {
      reasons.push('Meaningful text content');
      return 0.1;
    }

    // Penalize very long text (likely not interactive)
    if (text.length > 200) {
      return -0.1;
    }

    return 0;
  }

  /**
   * Apply limits to element list
   */
  private applyLimits(
    elements: ElementRelevance[],
    taskContext: TaskContext
  ): ElementRelevance[] {
    let limited = elements;

    // Apply overall limit
    if (taskContext.maxElements) {
      limited = limited.slice(0, taskContext.maxElements);
    } else if (this.config.maxElementsPerCategory) {
      // Apply per-category limit
      const categoryCounts: Record<string, number> = {};
      limited = elements.filter(element => {
        const count = categoryCounts[element.category] || 0;
        if (count < this.config.maxElementsPerCategory) {
          categoryCounts[element.category] = count + 1;
          return true;
        }
        return false;
      });
    }

    return limited;
  }

  /**
   * Generate category statistics
   */
  private generateCategoryStats(elements: ElementRelevance[]): Record<string, number> {
    const stats: Record<string, number> = {};

    for (const element of elements) {
      stats[element.category] = (stats[element.category] || 0) + 1;
    }

    return stats;
  }
}

// Global instance
export const progressiveElementDisclosure = new ProgressiveElementDisclosureService();
