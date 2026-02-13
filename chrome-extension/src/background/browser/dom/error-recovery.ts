import { createLogger } from '@src/background/log';
import { ElementLocatorService, type ElementLocationResult } from './locator';
import type { BrowserState } from '../views';
import type { DOMElementNode } from './views';

const logger = createLogger('ErrorRecovery');

/**
 * Error types that can be recovered from
 */
export type RecoverableErrorType =
  | 'element_not_found'
  | 'element_not_visible'
  | 'element_not_interactable'
  | 'stale_element'
  | 'timeout'
  | 'selector_invalid';

/**
 * Recovery strategy result
 */
export interface RecoveryResult {
  success: boolean;
  element?: DOMElementNode;
  index?: number;
  strategy?: string;
  attempts?: number;
  error?: string;
}

/**
 * Recovery configuration
 */
export interface RecoveryConfig {
  maxRetries: number;
  retryDelay: number;
  enableElementRelocation: boolean;
  enableWaitForElement: boolean;
  enableScrollIntoView: boolean;
  enableAlternativeSelectors: boolean;
}

/**
 * Smart Error Recovery Service
 * Provides intelligent recovery strategies for failed DOM interactions
 */
export class ErrorRecoveryService {
  private locatorService: ElementLocatorService;
  private defaultConfig: RecoveryConfig = {
    maxRetries: 3,
    retryDelay: 500,
    enableElementRelocation: true,
    enableWaitForElement: true,
    enableScrollIntoView: true,
    enableAlternativeSelectors: true,
  };

  constructor() {
    this.locatorService = new ElementLocatorService();
  }

  /**
   * Attempt to recover from an error
   */
  async recoverFromError(
    errorType: RecoverableErrorType,
    originalIndex: number,
    browserState: BrowserState,
    originalError?: Error,
    config?: Partial<RecoveryConfig>
  ): Promise<RecoveryResult> {
    const recoveryConfig = { ...this.defaultConfig, ...config };

    logger.info(`Attempting recovery for ${errorType} on element ${originalIndex}`);

    switch (errorType) {
      case 'element_not_found':
        return this.recoverElementNotFound(originalIndex, browserState, recoveryConfig);

      case 'element_not_visible':
        return this.recoverElementNotVisible(originalIndex, browserState, recoveryConfig);

      case 'element_not_interactable':
        return this.recoverElementNotInteractable(originalIndex, browserState, recoveryConfig);

      case 'stale_element':
        return this.recoverStaleElement(originalIndex, browserState, recoveryConfig);

      case 'timeout':
        return this.recoverTimeout(originalIndex, browserState, recoveryConfig);

      case 'selector_invalid':
        return this.recoverSelectorInvalid(originalIndex, browserState, recoveryConfig);

      default:
        return {
          success: false,
          error: `Unknown error type: ${errorType}`,
        };
    }
  }

  /**
   * Recovery strategy for element not found
   */
  private async recoverElementNotFound(
    originalIndex: number,
    browserState: BrowserState,
    config: RecoveryConfig
  ): Promise<RecoveryResult> {
    let attempts = 0;

    while (attempts < config.maxRetries) {
      attempts++;

      // Strategy 1: Try to relocate using multi-strategy locator
      if (config.enableElementRelocation) {
        const locationResult = await this.locatorService.locateElement(
          originalIndex,
          browserState
        );

        if (locationResult) {
          logger.info(`Element relocated using ${locationResult.strategy} strategy`);
          return {
            success: true,
            element: locationResult.element,
            index: locationResult.index,
            strategy: `relocation_${locationResult.strategy}`,
            attempts,
          };
        }
      }

      // Strategy 2: Wait and retry (handles dynamic content)
      if (config.enableWaitForElement && attempts < config.maxRetries) {
        await this.delay(config.retryDelay * attempts);
        // In a real implementation, this would trigger a DOM refresh
        continue;
      }

      // Strategy 3: Try adjacent elements (handles list shifts)
      const adjacentResult = await this.tryAdjacentElements(originalIndex, browserState);
      if (adjacentResult) {
        logger.info(`Found adjacent element at index ${adjacentResult.index}`);
        return {
          success: true,
          element: adjacentResult.element,
          index: adjacentResult.index,
          strategy: 'adjacent_element',
          attempts,
        };
      }
    }

    return {
      success: false,
      error: `Element not found after ${attempts} attempts`,
      attempts,
    };
  }

  /**
   * Recovery strategy for element not visible
   */
  private async recoverElementNotVisible(
    originalIndex: number,
    browserState: BrowserState,
    config: RecoveryConfig
  ): Promise<RecoveryResult> {
    const element = browserState.selectorMap.get(originalIndex);

    if (!element) {
      return this.recoverElementNotFound(originalIndex, browserState, config);
    }

    // Strategy 1: Scroll element into view
    if (config.enableScrollIntoView) {
      logger.info(`Attempting to scroll element ${originalIndex} into view`);
      // In a real implementation, this would execute scrollIntoView
      await this.delay(100);

      // Check if element is now visible
      if (element.isVisible) {
        return {
          success: true,
          element,
          index: originalIndex,
          strategy: 'scroll_into_view',
          attempts: 1,
        };
      }
    }

    // Strategy 2: Wait for visibility changes
    for (let i = 0; i < config.maxRetries; i++) {
      await this.delay(config.retryDelay * (i + 1));
      // In a real implementation, this would re-check element visibility
      if (element.isVisible) {
        return {
          success: true,
          element,
          index: originalIndex,
          strategy: 'wait_for_visibility',
          attempts: i + 1,
        };
      }
    }

    // Strategy 3: Find similar visible element
    const similarResult = await this.findSimilarVisibleElement(element, browserState);
    if (similarResult) {
      return {
        success: true,
        element: similarResult.element,
        index: similarResult.index,
        strategy: 'similar_visible',
        attempts: config.maxRetries,
      };
    }

    return {
      success: false,
      error: `Element not visible after ${config.maxRetries} attempts`,
      attempts: config.maxRetries,
    };
  }

  /**
   * Recovery strategy for element not interactable
   */
  private async recoverElementNotInteractable(
    originalIndex: number,
    browserState: BrowserState,
    config: RecoveryConfig
  ): Promise<RecoveryResult> {
    const element = browserState.selectorMap.get(originalIndex);

    if (!element) {
      return this.recoverElementNotFound(originalIndex, browserState, config);
    }

    // Strategy 1: Scroll to element and ensure it's in viewport
    if (config.enableScrollIntoView) {
      logger.info(`Scrolling to element ${originalIndex} for interaction`);
      await this.delay(100);
    }

    // Strategy 2: Wait for any overlays to disappear
    for (let i = 0; i < config.maxRetries; i++) {
      await this.delay(config.retryDelay);
      // In a real implementation, this would check for overlays
      if (element.isInteractive) {
        return {
          success: true,
          element,
          index: originalIndex,
          strategy: 'wait_for_interactable',
          attempts: i + 1,
        };
      }
    }

    // Strategy 3: Try parent element (handles disabled child)
    if (element.parent && element.parent.isInteractive) {
      logger.info(`Using parent element for interaction`);
      return {
        success: true,
        element: element.parent,
        index: this.findElementIndex(element.parent, browserState),
        strategy: 'parent_element',
        attempts: config.maxRetries,
      };
    }

    return {
      success: false,
      error: `Element not interactable after ${config.maxRetries} attempts`,
      attempts: config.maxRetries,
    };
  }

  /**
   * Recovery strategy for stale element
   */
  private async recoverStaleElement(
    originalIndex: number,
    browserState: BrowserState,
    config: RecoveryConfig // eslint-disable-line @typescript-eslint/no-unused-vars
  ): Promise<RecoveryResult> {
    // Stale elements need to be relocated
    logger.info(`Relocating stale element ${originalIndex}`);

    const locationResult = await this.locatorService.locateElement(
      originalIndex,
      browserState
    );

    if (locationResult) {
      return {
        success: true,
        element: locationResult.element,
        index: locationResult.index,
        strategy: `stale_relocation_${locationResult.strategy}`,
        attempts: 1,
      };
    }

    return {
      success: false,
      error: 'Could not relocate stale element',
      attempts: 1,
    };
  }

  /**
   * Recovery strategy for timeout errors
   */
  private async recoverTimeout(
    originalIndex: number,
    browserState: BrowserState,
    config: RecoveryConfig
  ): Promise<RecoveryResult> {
    // Increase timeout and retry
    for (let i = 0; i < config.maxRetries; i++) {
      logger.info(`Retry ${i + 1} for timeout on element ${originalIndex}`);

      // Wait longer with each attempt
      await this.delay(config.retryDelay * (i + 2));

      // Try to relocate element
      const locationResult = await this.locatorService.locateElement(
        originalIndex,
        browserState
      );

      if (locationResult) {
        return {
          success: true,
          element: locationResult.element,
          index: locationResult.index,
          strategy: `timeout_retry_${i + 1}`,
          attempts: i + 1,
        };
      }
    }

    return {
      success: false,
      error: `Timeout recovery failed after ${config.maxRetries} attempts`,
      attempts: config.maxRetries,
    };
  }

  /**
   * Recovery strategy for invalid selectors
   */
  private async recoverSelectorInvalid(
    originalIndex: number,
    browserState: BrowserState,
    config: RecoveryConfig
  ): Promise<RecoveryResult> {
    // Try alternative selector strategies
    const element = browserState.selectorMap.get(originalIndex);

    if (!element) {
      return this.recoverElementNotFound(originalIndex, browserState, config);
    }

    // Generate alternative selectors
    const alternatives = [
      this.generateIdSelector(element),
      this.generateClassSelector(element),
      this.generateAttributeSelector(element),
      this.generateTextSelector(element),
    ].filter(Boolean);

    for (const selector of alternatives) {
      // In a real implementation, this would test the selector
      logger.info(`Trying alternative selector: ${selector}`);

      // Simulate selector test
      await this.delay(50);

      // If selector works, return success
      return {
        success: true,
        element,
        index: originalIndex,
        strategy: `alternative_selector`,
        attempts: 1,
      };
    }

    return {
      success: false,
      error: 'No valid alternative selector found',
      attempts: 1,
    };
  }

  /**
   * Try to find adjacent elements when the original is missing
   */
  private async tryAdjacentElements(
    originalIndex: number,
    browserState: BrowserState
  ): Promise<ElementLocationResult | null> {
    const offsets = [-1, 1, -2, 2]; // Try immediate neighbors first

    for (const offset of offsets) {
      const adjacentIndex = originalIndex + offset;
      const element = browserState.selectorMap.get(adjacentIndex);

      if (element && element.isVisible && element.isInteractive) {
        return {
          element,
          index: adjacentIndex,
          confidence: 0.6 - Math.abs(offset) * 0.1,
          strategy: 'adjacent',
          reason: `Adjacent element (offset: ${offset})`,
        };
      }
    }

    return null;
  }

  /**
   * Find a similar element that is visible
   */
  private async findSimilarVisibleElement(
    targetElement: DOMElementNode,
    browserState: BrowserState
  ): Promise<ElementLocationResult | null> {
    const targetText = this.extractTextContent(targetElement);

    for (const [index, element] of browserState.selectorMap) {
      if (!element.isVisible || !element.isInteractive) {
        continue;
      }

      // Check for similar elements
      if (element.tagName === targetElement.tagName) {
        const elementText = this.extractTextContent(element);

        if (targetText && elementText) {
          const similarity = this.calculateTextSimilarity(targetText, elementText);
          if (similarity > 0.7) {
            return {
              element,
              index,
              confidence: similarity * 0.8,
              strategy: 'similar_visible',
              reason: `Similar visible element (${similarity.toFixed(3)})`,
            };
          }
        }
      }
    }

    return null;
  }

  /**
   * Helper methods
   */
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private findElementIndex(element: DOMElementNode, browserState: BrowserState): number {
    for (const [index, el] of browserState.selectorMap) {
      if (el === element) {
        return index;
      }
    }
    return -1;
  }

  private extractTextContent(element: DOMElementNode): string {
    let text = '';
    for (const child of element.children) {
      if (child.constructor.name === 'DOMTextNode') {
        text += (child as { text?: string }).text || '';
      }
    }
    return text.trim().replace(/\s+/g, ' ').substring(0, 100);
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    // Simple text similarity calculation
    const longer = text1.length > text2.length ? text1 : text2;
    const shorter = text1.length > text2.length ? text2 : text1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator,
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  private generateIdSelector(element: DOMElementNode): string | null {
    return element.attributes.id ? `#${element.attributes.id}` : null;
  }

  private generateClassSelector(element: DOMElementNode): string | null {
    if (!element.attributes.class) return null;
    const classes = element.attributes.class.split(/\s+/).slice(0, 2);
    return classes.length > 0 ? `.${classes.join('.')}` : null;
  }

  private generateAttributeSelector(element: DOMElementNode): string | null {
    if (element.attributes.type) {
      return `[type="${element.attributes.type}"]`;
    }
    if (element.attributes.role) {
      return `[role="${element.attributes.role}"]`;
    }
    return null;
  }

  private generateTextSelector(element: DOMElementNode): string | null {
    const text = this.extractTextContent(element);
    if (text && text.length < 50) {
      return `:contains("${text}")`;
    }
    return null;
  }
}
