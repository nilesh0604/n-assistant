import { createLogger } from '@src/background/log';
import { ElementFingerprintService } from './fingerprint';
import type { ElementFingerprint } from './views';
import { DOMElementNode, DOMTextNode } from './views';
import type { BrowserState } from '../views';

const logger = createLogger('ElementLocator');

/**
 * Element location result with confidence score
 */
export interface ElementLocationResult {
  element: DOMElementNode;
  index: number;
  confidence: number;
  strategy: string;
  reason?: string;
}

/**
 * Multi-Strategy Element Locator Service
 * Provides robust element location using multiple strategies with confidence scoring
 */
export class ElementLocatorService {
  private fingerprintService: ElementFingerprintService;

  constructor() {
    this.fingerprintService = new ElementFingerprintService();
  }

  /**
   * Locate element using multiple strategies
   */
  async locateElement(
    targetIndex: number,
    browserState: BrowserState,
    targetFingerprint?: ElementFingerprint
  ): Promise<ElementLocationResult | null> {
    const strategies = [
      () => this.directIndexMatch(targetIndex, browserState),
      () => this.fingerprintMatch(targetIndex, browserState, targetFingerprint),
      () => this.textContentMatch(targetIndex, browserState),
      () => this.cssSelectorMatch(targetIndex, browserState),
      () => this.xpathMatch(targetIndex, browserState),
      () => this.semanticRoleMatch(targetIndex, browserState),
    ];

    const results: ElementLocationResult[] = [];

    // Try strategies and collect results, with early exit for high confidence
    for (const strategy of strategies) {
      try {
        const result = await strategy();
        if (result) {
          results.push(result);
          
          // Early exit if we found a very high confidence match
          if (result.confidence >= 0.95) {
            logger.info(`Element located with high confidence ${result.confidence} using ${result.strategy}`);
            return result;
          }
        }
      } catch (error) {
        logger.warning(`Strategy failed: ${error}`);
      }
    }

    if (results.length === 0) {
      return null;
    }

    // Sort by confidence score and return the best match
    results.sort((a, b) => b.confidence - a.confidence);
    const best = results[0];

    logger.info(`Element located using ${best.strategy} with confidence ${best.confidence}`);
    
    // Debug logging for problematic elements (indexes 19, 20)
    if (best.index === 19 || best.index === 20) {
      logger.info(`DEBUG: Element ${best.index} - Strategy: ${best.strategy}, Confidence: ${best.confidence}`);
      logger.info(`DEBUG: Element ${best.index} - Tag: ${best.element.tagName}, Text: ${this.extractTextContent(best.element)}`);
      logger.info(`DEBUG: Element ${best.index} - ID: ${best.element.attributes.id}, Classes: ${best.element.attributes.class}`);
      logger.info(`DEBUG: Element ${best.index} - Visible: ${best.element.isVisible}, Interactive: ${best.element.isInteractive}`);
      if (best.element.fingerprint) {
        logger.info(`DEBUG: Element ${best.index} - Fingerprint: ${JSON.stringify(best.element.fingerprint)}`);
      }
    }
    
    return best;
  }

  /**
   * Strategy 1: Direct index matching (fastest)
   */
  private async directIndexMatch(
    targetIndex: number,
    browserState: BrowserState
  ): Promise<ElementLocationResult | null> {
    const element = browserState.selectorMap.get(targetIndex);
    if (element && element.isVisible && element.isInteractive) {
      
      // Debug logging for direct index strategy (all problematic indexes)
      if (targetIndex >= 18 && targetIndex <= 22) {
        logger.info(`DEBUG DIRECT_INDEX: Element ${targetIndex} - Tag: ${element.tagName}, Text: ${this.extractTextContent(element)}`);
        logger.info(`DEBUG DIRECT_INDEX: Element ${targetIndex} - ID: ${element.attributes.id}, Classes: ${element.attributes.class}`);
        logger.info(`DEBUG DIRECT_INDEX: Element ${targetIndex} - Visible: ${element.isVisible}, Interactive: ${element.isInteractive}`);
        if (element.attributes['aria-label']) {
          logger.info(`DEBUG DIRECT_INDEX: Element ${targetIndex} - ARIA Label: ${element.attributes['aria-label']}`);
        }
      }
      
      return {
        element,
        index: targetIndex,
        confidence: 1.0,
        strategy: 'direct_index',
        reason: `Direct index match: ${targetIndex}`,
      };
    }

    return null;
  }

  /**
   * Strategy 2: Fingerprint matching (handles moved elements)
   */
  private async fingerprintMatch(
    targetIndex: number,
    browserState: BrowserState,
    targetFingerprint?: ElementFingerprint
  ): Promise<ElementLocationResult | null> {
    const targetElement = browserState.selectorMap.get(targetIndex);
    if (!targetElement?.fingerprint && !targetFingerprint) {
      return null;
    }

    const fingerprint = targetFingerprint || targetElement!.fingerprint!;
    const candidates = Array.from(browserState.selectorMap.values()).filter(el => el.isInteractive);

    const bestMatch = this.fingerprintService.findBestMatch(fingerprint, candidates, 0.7);
    if (bestMatch) {
      // Find the index of the matched element
      for (const [index, element] of browserState.selectorMap) {
        if (element === bestMatch) {
          const similarity = this.fingerprintService.calculateSimilarity(fingerprint, bestMatch.fingerprint!);
          return {
            element: bestMatch,
            index,
            confidence: similarity * 0.9, // Slightly lower confidence than direct match
            strategy: 'fingerprint',
            reason: `Fingerprint similarity: ${similarity.toFixed(3)}`,
          };
        }
      }
    }
    return null;
  }

  /**
   * Strategy 3: Text content matching
   */
  private async textContentMatch(
    targetIndex: number,
    browserState: BrowserState
  ): Promise<ElementLocationResult | null> {
    const targetElement = browserState.selectorMap.get(targetIndex);
    if (!targetElement) {
      return null;
    }

    const targetText = this.extractTextContent(targetElement);
    if (!targetText || targetText.length < 3) {
      return null;
    }

    let bestMatch: { element: DOMElementNode; index: number; similarity: number } | null = null;

    for (const [index, element] of browserState.selectorMap) {
      if (index === targetIndex || !element.isInteractive) {
        continue;
      }

      const elementText = this.extractTextContent(element);
      if (!elementText) {
        continue;
      }

      const similarity = this.fingerprintService.calculateTextSimilarity(targetText, elementText);
      if (similarity > 0.7 && (!bestMatch || similarity > bestMatch.similarity)) {
        bestMatch = { element, index, similarity };
      }
    }

    if (bestMatch) {
      return {
        element: bestMatch.element,
        index: bestMatch.index,
        confidence: bestMatch.similarity * 0.8,
        strategy: 'text_content',
        reason: `Text similarity: ${bestMatch.similarity.toFixed(3)}`,
      };
    }

    return null;
  }

  /**
   * Strategy 4: CSS selector matching
   */
  private async cssSelectorMatch(
    targetIndex: number,
    browserState: BrowserState
  ): Promise<ElementLocationResult | null> {
    const targetElement = browserState.selectorMap.get(targetIndex);
    if (!targetElement) {
      return null;
    }

    const selector = this.generateCSSSelector(targetElement);
    if (!selector) {
      return null;
    }

    // Find elements with similar CSS characteristics
    let bestMatch: { element: DOMElementNode; index: number; score: number } | null = null;

    for (const [index, element] of browserState.selectorMap) {
      if (index === targetIndex || !element.isInteractive) {
        continue;
      }

      const score = this.calculateCSSSimilarity(targetElement, element);
      if (score > 0.6 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { element, index, score };
      }
    }

    if (bestMatch) {
      return {
        element: bestMatch.element,
        index: bestMatch.index,
        confidence: bestMatch.score * 0.75,
        strategy: 'css_selector',
        reason: `CSS similarity: ${bestMatch.score.toFixed(3)}`,
      };
    }

    return null;
  }

  /**
   * Strategy 5: XPath matching
   */
  private async xpathMatch(
    targetIndex: number,
    browserState: BrowserState
  ): Promise<ElementLocationResult | null> {
    const targetElement = browserState.selectorMap.get(targetIndex);
    if (!targetElement) {
      return null;
    }

    // Generate a simplified XPath-like path
    const path = this.generateXPath(targetElement);
    if (!path) {
      return null;
    }

    let bestMatch: { element: DOMElementNode; index: number; score: number } | null = null;

    for (const [index, element] of browserState.selectorMap) {
      if (index === targetIndex || !element.isInteractive) {
        continue;
      }

      const elementPath = this.generateXPath(element);
      if (!elementPath) {
        continue;
      }

      const score = this.fingerprintService.calculatePathSimilarity(path, elementPath);
      if (score > 0.5 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { element, index, score };
      }
    }

    if (bestMatch) {
      return {
        element: bestMatch.element,
        index: bestMatch.index,
        confidence: bestMatch.score * 0.6,
        strategy: 'xpath',
        reason: `XPath similarity: ${bestMatch.score.toFixed(3)}`,
      };
    }

    return null;
  }

  /**
   * Strategy 6: Semantic role matching
   */
  private async semanticRoleMatch(
    targetIndex: number,
    browserState: BrowserState
  ): Promise<ElementLocationResult | null> {
    const targetElement = browserState.selectorMap.get(targetIndex);
    if (!targetElement) {
      return null;
    }

    const targetRole = this.getSemanticRole(targetElement);
    const targetText = this.extractTextContent(targetElement);

    let bestMatch: { element: DOMElementNode; index: number; score: number } | null = null;

    for (const [index, element] of browserState.selectorMap) {
      if (index === targetIndex || !element.isInteractive) {
        continue;
      }

      const elementRole = this.getSemanticRole(element);
      const elementText = this.extractTextContent(element);

      let score = 0;
      
      // Role matching (higher weight)
      if (targetRole && elementRole && targetRole === elementRole) {
        score += 0.5;
      }

      // Text similarity for same role
      if (score > 0 && targetText && elementText) {
        const textSim = this.fingerprintService.calculateTextSimilarity(targetText, elementText);
        score += textSim * 0.5;
      }

      if (score > 0.4 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { element, index, score };
      }
    }

    if (bestMatch) {
      return {
        element: bestMatch.element,
        index: bestMatch.index,
        confidence: bestMatch.score * 0.5,
        strategy: 'semantic_role',
        reason: `Semantic role match: ${targetRole}`,
      };
    }

    return null;
  }

  /**
   * Helper methods for various strategies
   */
  private extractTextContent(element: DOMElementNode): string {
    let text = '';
    for (const child of element.children) {
      if (child instanceof DOMTextNode) {
        text += child.text || '';
      }
    }
    return text.trim().replace(/\s+/g, ' ').substring(0, 100);
  }

  
  private generateCSSSelector(element: DOMElementNode): string {
    const tagName = element.tagName?.toLowerCase() || '';
    const id = element.attributes.id ? `#${element.attributes.id}` : '';
    
    // Prioritize meaningful classes, exclude utility classes
    const classes = element.attributes.class 
      ? element.attributes.class.split(/\s+/)
          .filter((c: string) => !c.match(/^(css-|style-|theme-|bg-|text-|flex-|grid-|hidden|show)/))
          .slice(0, 3) // Limit to 3 most relevant classes
          .map((c: string) => `.${c}`)
          .join('')
      : '';
    
    // Add key attributes for better specificity
    const attributes = [];
    if (element.attributes.type && element.tagName?.toLowerCase() === 'input') {
      attributes.push(`[type="${element.attributes.type}"]`);
    }
    if (element.attributes.role) {
      attributes.push(`[role="${element.attributes.role}"]`);
    }
    if (element.attributes['aria-label']) {
      attributes.push(`[aria-label="${element.attributes['aria-label']}"]`);
    }
    
    return `${tagName}${id}${classes}${attributes.join('')}`;
  }

  private calculateCSSSimilarity(el1: DOMElementNode, el2: DOMElementNode): number {
    let score = 0;
    
    // Tag name matching (40% weight)
    if (el1.tagName === el2.tagName) {
      score += 0.4;
    }
    
    // ID matching (30% weight) - highest specificity
    if (el1.attributes.id === el2.attributes.id && el1.attributes.id) {
      score += 0.3;
    }
    
    // Meaningful class matching (20% weight)
    if (el1.attributes.class && el2.attributes.class) {
      const classes1 = new Set(el1.attributes.class.split(/\s+/).filter((c: string) => 
        !c.match(/^(css-|style-|theme-|bg-|text-|flex-|grid-|hidden|show)/)
      ));
      const classes2 = new Set(el2.attributes.class.split(/\s+/).filter((c: string) => 
        !c.match(/^(css-|style-|theme-|bg-|text-|flex-|grid-|hidden|show)/)
      ));
      
      const intersection = new Set([...classes1].filter(x => classes2.has(x)));
      const union = new Set([...classes1, ...classes2]);
      const classSimilarity = union.size > 0 ? intersection.size / union.size : 0;
      score += classSimilarity * 0.2;
    }
    
    // Key attributes matching (10% weight)
    let attributeScore = 0;
    const keyAttributes = ['type', 'role', 'aria-label'];
    
    for (const attr of keyAttributes) {
      if (el1.attributes[attr] && el2.attributes[attr] && el1.attributes[attr] === el2.attributes[attr]) {
        attributeScore += 1 / keyAttributes.length;
      }
    }
    score += attributeScore * 0.1;
    
    return score;
  }

  private generateXPath(element: DOMElementNode): string {
    const path: string[] = [];
    let current: DOMElementNode | null = element;

    while (current && path.length < 5) { // Limit depth for performance
      const tagName = current.tagName?.toLowerCase() || '*';
      path.unshift(tagName);
      current = current.parent;
    }

    return path.join('/');
  }

  
  private getSemanticRole(element: DOMElementNode): string | null {
    // Check ARIA role first
    if (element.attributes.role) {
      return element.attributes.role;
    }

    // Check common interactive element patterns
    const tagName = element.tagName?.toLowerCase();
    const type = element.attributes.type?.toLowerCase();
    const text = this.extractTextContent(element).toLowerCase();

    if (tagName === 'button') return 'button';
    if (tagName === 'input') {
      if (type === 'submit' || type === 'button') return 'button';
      if (type === 'text' || type === 'email' || type === 'password') return 'textbox';
      if (type === 'checkbox') return 'checkbox';
      if (type === 'radio') return 'radio';
    }
    if (tagName === 'textarea') return 'textbox';
    if (tagName === 'select') return 'combobox';
    if (tagName === 'a') return 'link';

    // Check text content for common button patterns
    if (text.includes('submit') || text.includes('save') || text.includes('cancel') || text.includes('delete')) {
      return 'button';
    }

    return null;
  }
}
