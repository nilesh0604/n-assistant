import { createLogger } from '@src/background/log';
import type { DOMElementNode, DOMState } from '../../browser/dom/views';
import { ElementFingerprintService } from '../../browser/dom/fingerprint';

const logger = createLogger('ElementStabilityChecker');

/**
 * Configuration for stability checking
 */
export interface StabilityCheckConfig {
  maxAnimationDuration: number; // ms
  stabilityCheckInterval: number; // ms
  maxStabilityChecks: number;
  loadingIndicators: string[];
  animationClasses: string[];
  transitionProperties: string[];
}

/**
 * Default configuration for stability checking
 */
export const DEFAULT_STABILITY_CONFIG: StabilityCheckConfig = {
  maxAnimationDuration: 2000,
  stabilityCheckInterval: 100,
  maxStabilityChecks: 20,
  loadingIndicators: [
    'loading...',
    'please wait',
    'processing',
    'spinner',
    'loading',
    'wait',
    'fetching',
    'saving',
    'submitting',
    'sending',
  ],
  animationClasses: [
    'animate',
    'spin',
    'pulse',
    'loading',
    'fade',
    'slide',
    'bounce',
    'shake',
    'rotate',
    'flip',
  ],
  transitionProperties: [
    'opacity',
    'transform',
    'translate',
    'scale',
    'rotate',
    'skew',
  ],
};

/**
 * Result of stability check
 */
export interface StabilityResult {
  isStable: boolean;
  reason: string;
  checkDuration: number;
  recommendations: string[];
}

/**
 * Enhanced element stability checker
 */
export class ElementStabilityChecker {
  private config: StabilityCheckConfig;
  private fingerprintService: ElementFingerprintService;

  constructor(config: Partial<StabilityCheckConfig> = {}) {
    this.config = { ...DEFAULT_STABILITY_CONFIG, ...config };
    this.fingerprintService = new ElementFingerprintService();
  }

  /**
   * Check if element is stable with enhanced detection
   */
  async checkStability(element: DOMElementNode): Promise<StabilityResult> {
    const startTime = Date.now();
    const result: StabilityResult = {
      isStable: true,
      reason: 'Element appears stable',
      checkDuration: 0,
      recommendations: [],
    };

    try {
      // Check 1: Loading indicators in element and nearby text
      const loadingCheck = this.checkLoadingIndicators(element);
      if (!loadingCheck.isStable) {
        result.isStable = false;
        result.reason = loadingCheck.reason;
        result.recommendations.push(loadingCheck.recommendation);
        result.checkDuration = Date.now() - startTime;
        return result;
      }

      // Check 2: Animation and transition classes
      const animationCheck = this.checkAnimationClasses(element);
      if (!animationCheck.isStable) {
        result.isStable = false;
        result.reason = animationCheck.reason;
        result.recommendations.push(animationCheck.recommendation);
        result.checkDuration = Date.now() - startTime;
        return result;
      }

      // Check 3: Element attributes that indicate loading state
      const attributeCheck = this.checkLoadingAttributes(element);
      if (!attributeCheck.isStable) {
        result.isStable = false;
        result.reason = attributeCheck.reason;
        result.recommendations.push(attributeCheck.recommendation);
        result.checkDuration = Date.now() - startTime;
        return result;
      }

      // Check 4: Parent elements for loading states
      const parentCheck = this.checkParentLoadingState(element);
      if (!parentCheck.isStable) {
        result.isStable = false;
        result.reason = parentCheck.reason;
        result.recommendations.push(parentCheck.recommendation);
        result.checkDuration = Date.now() - startTime;
        return result;
      }

      // Check 5: Dynamic content indicators
      const dynamicCheck = this.checkDynamicContent(element);
      if (!dynamicCheck.isStable) {
        result.isStable = false;
        result.reason = dynamicCheck.reason;
        result.recommendations.push(dynamicCheck.recommendation);
        result.checkDuration = Date.now() - startTime;
        return result;
      }

      result.checkDuration = Date.now() - startTime;
      return result;

    } catch (error) {
      logger.error('Stability check failed', error);
      result.isStable = false;
      result.reason = 'Stability check encountered an error';
      result.checkDuration = Date.now() - startTime;
      return result;
    }
  }

  /**
   * Check for loading indicators in text content
   */
  private checkLoadingIndicators(element: DOMElementNode): { isStable: boolean; reason: string; recommendation: string } {
    const elementText = (element.getAllTextTillNextClickableElement() || '').toLowerCase();
    
    for (const indicator of this.config.loadingIndicators) {
      if (elementText.includes(indicator)) {
        return {
          isStable: false,
          reason: `Element contains loading indicator: "${indicator}"`,
          recommendation: 'Wait for loading to complete before interacting',
        };
      }
    }

    return { isStable: true, reason: '', recommendation: '' };
  }

  /**
   * Check for animation classes
   */
  private checkAnimationClasses(element: DOMElementNode): { isStable: boolean; reason: string; recommendation: string } {
    const elementClass = (element.attributes.class || '').toLowerCase();
    
    for (const cls of this.config.animationClasses) {
      if (elementClass.includes(cls)) {
        return {
          isStable: false,
          reason: `Element has animation class: "${cls}"`,
          recommendation: 'Wait for animation to complete',
        };
      }
    }

    return { isStable: true, reason: '', recommendation: '' };
  }

  /**
   * Check for loading-related attributes
   */
  private checkLoadingAttributes(element: DOMElementNode): { isStable: boolean; reason: string; recommendation: string } {
    // Check for aria-busy
    if (element.attributes['aria-busy'] === 'true') {
      return {
        isStable: false,
        reason: 'Element has aria-busy="true"',
        recommendation: 'Wait for element to finish processing',
      };
    }

    // Check for disabled state during loading
    if (element.attributes.disabled && element.attributes['data-loading']) {
      return {
        isStable: false,
        reason: 'Element is disabled during loading',
        recommendation: 'Wait for loading to complete',
      };
    }

    // Check for loading data attributes
    const loadingAttrs = ['data-loading', 'data-state="loading"', 'data-status="loading"'];
    for (const attr of loadingAttrs) {
      if (element.attributes[attr]) {
        return {
          isStable: false,
          reason: `Element has loading attribute: ${attr}`,
          recommendation: 'Wait for loading state to change',
        };
      }
    }

    return { isStable: true, reason: '', recommendation: '' };
  }

  /**
   * Check parent elements for loading states
   */
  private checkParentLoadingState(element: DOMElementNode): { isStable: boolean; reason: string; recommendation: string } {
    // This is a simplified check - in a real implementation, we'd traverse the DOM tree
    // For now, we'll check if the element is within a common loading container
    
    const parentClasses = element.attributes.class || '';
    const loadingContainers = ['loading-container', 'spinner-container', 'busy'];
    
    for (const container of loadingContainers) {
      if (parentClasses.includes(container)) {
        return {
          isStable: false,
          reason: `Element is within a loading container: ${container}`,
          recommendation: 'Wait for container to finish loading',
        };
      }
    }

    return { isStable: true, reason: '', recommendation: '' };
  }

  /**
   * Check for dynamic content indicators
   */
  private checkDynamicContent(element: DOMElementNode): { isStable: boolean; reason: string; recommendation: string } {
    // Check for skeleton loaders
    const skeletonClasses = ['skeleton', 'placeholder', 'shimmer'];
    const elementClass = (element.attributes.class || '').toLowerCase();
    
    for (const cls of skeletonClasses) {
      if (elementClass.includes(cls)) {
        return {
          isStable: false,
          reason: `Element appears to be a skeleton loader: ${cls}`,
          recommendation: 'Wait for content to load',
        };
      }
    }

    // Check for progress indicators
    if (element.attributes.role === 'progressbar') {
      const value = parseInt(element.attributes['aria-valuenow'] || '0');
      const max = parseInt(element.attributes['aria-valuemax'] || '100');
      
      if (value < max) {
        return {
          isStable: false,
          reason: `Progress bar is not complete: ${value}/${max}`,
          recommendation: 'Wait for progress to complete',
        };
      }
    }

    return { isStable: true, reason: '', recommendation: '' };
  }

  /**
   * Wait for element to become stable with timeout
   */
  async waitForStability(
    element: DOMElementNode,
    timeout: number = this.config.maxAnimationDuration
  ): Promise<StabilityResult> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const result = await this.checkStability(element);
      if (result.isStable) {
        return result;
      }
      
      // Wait before next check
      await new Promise(resolve => setTimeout(resolve, this.config.stabilityCheckInterval));
    }
    
    // Timeout reached
    return {
      isStable: false,
      reason: `Element did not become stable within ${timeout}ms`,
      checkDuration: Date.now() - startTime,
      recommendations: [
        'Consider increasing timeout duration',
        'Check if page is stuck in loading state',
        'Try interacting with a different element',
      ],
    };
  }

  /**
   * Create a new checker with different configuration
   */
  withConfig(config: Partial<StabilityCheckConfig>): ElementStabilityChecker {
    return new ElementStabilityChecker({ ...this.config, ...config });
  }
}
