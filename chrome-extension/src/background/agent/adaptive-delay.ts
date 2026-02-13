import { createLogger } from '@src/background/log';

const logger = createLogger('AdaptiveDelay');

/**
 * Configuration for adaptive delays
 */
export interface AdaptiveDelayConfig {
  baseDelay: number; // Base delay in ms
  minDelay: number; // Minimum delay in ms
  maxDelay: number; // Maximum delay in ms
  enableSmartDelays: boolean;
  enablePageLoadDetection: boolean;
  enableAnimationDetection: boolean;
  rapidModeThreshold: number; // Number of fast actions before enabling rapid mode
}

/**
 * Default configuration
 */
export const DEFAULT_ADAPTIVE_DELAY_CONFIG: AdaptiveDelayConfig = {
  baseDelay: 500, // Reduced from 1000ms
  minDelay: 100,
  maxDelay: 2000,
  enableSmartDelays: true,
  enablePageLoadDetection: true,
  enableAnimationDetection: true,
  rapidModeThreshold: 5,
};

/**
 * Context for delay calculation
 */
export interface DelayContext {
  actionType: string;
  previousActionTime: number;
  consecutiveFastActions: number;
  pageHasAnimations: boolean;
  pageIsLoading: boolean;
  elementType?: string;
  isFormAction?: boolean;
  isNavigationAction?: boolean;
}

/**
 * Adaptive delay service that optimizes delays based on context
 */
export class AdaptiveDelayService {
  private config: AdaptiveDelayConfig;
  private actionHistory: Array<{ timestamp: number; duration: number; type: string }> = [];
  private rapidMode = false;
  private pageState = {
    isLoading: false,
    hasAnimations: false,
    lastPageLoadTime: 0,
  };

  constructor(config: Partial<AdaptiveDelayConfig> = {}) {
    this.config = { ...DEFAULT_ADAPTIVE_DELAY_CONFIG, ...config };
  }

  /**
   * Calculate optimal delay based on context
   */
  async calculateDelay(context: DelayContext): Promise<number> {
    if (!this.config.enableSmartDelays) {
      return this.config.baseDelay;
    }

    let delay = this.config.baseDelay;

    // Factor 1: Action type
    delay = this.adjustDelayForActionType(delay, context);

    // Factor 2: Page state
    delay = this.adjustDelayForPageState(delay, context);

    // Factor 3: Consecutive fast actions (rapid mode)
    delay = this.adjustDelayForRapidMode(delay, context);

    // Factor 4: Element type
    delay = this.adjustDelayForElementType(delay, context);

    // Ensure bounds
    delay = Math.max(this.config.minDelay, Math.min(this.config.maxDelay, delay));

    logger.debug(`Calculated adaptive delay: ${delay}ms`, {
      baseDelay: this.config.baseDelay,
      actionType: context.actionType,
      rapidMode: this.rapidMode,
      pageLoading: context.pageIsLoading,
    });

    return delay;
  }

  /**
   * Wait for the calculated delay
   */
  async wait(context: DelayContext): Promise<void> {
    const delay = await this.calculateDelay(context);
    
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Update action history
    this.updateHistory(context.actionType, delay);
  }

  /**
   * Adjust delay based on action type
   */
  private adjustDelayForActionType(delay: number, context: DelayContext): number {
    const { actionType } = context;

    // Navigation actions need more time
    if (context.isNavigationAction || actionType === 'open_url') {
      return delay * 1.5;
    }

    // Form actions might need time for validation
    if (context.isFormAction || actionType === 'input_text' || actionType === 'select_dropdown_option') {
      return delay * 1.2;
    }

    // Simple clicks can be faster
    if (actionType === 'click_element') {
      return delay * 0.8;
    }

    // Scroll actions can be fast
    if (actionType === 'scroll_to_text' || actionType === 'scroll_to_element') {
      return delay * 0.6;
    }

    return delay;
  }

  /**
   * Adjust delay based on page state
   */
  private adjustDelayForPageState(delay: number, context: DelayContext): number {
    if (context.pageIsLoading && this.config.enablePageLoadDetection) {
      return delay * 2; // Double delay during page load
    }

    if (context.pageHasAnimations && this.config.enableAnimationDetection) {
      return delay * 1.3; // Increase delay for animations
    }

    return delay;
  }

  /**
   * Adjust delay for rapid mode
   */
  private adjustDelayForRapidMode(delay: number, context: DelayContext): number {
    // Enable rapid mode after several fast actions
    if (context.consecutiveFastActions >= this.config.rapidModeThreshold) {
      this.rapidMode = true;
    }

    // Disable rapid mode if there's a slow action
    if (context.previousActionTime > this.config.baseDelay * 1.5) {
      this.rapidMode = false;
    }

    if (this.rapidMode) {
      return delay * 0.5; // Halve the delay in rapid mode
    }

    return delay;
  }

  /**
   * Adjust delay based on element type
   */
  private adjustDelayForElementType(delay: number, context: DelayContext): number {
    if (!context.elementType) return delay;

    // Complex elements might need more time
    const complexElements = ['select', 'textarea', 'canvas', 'video'];
    if (complexElements.includes(context.elementType.toLowerCase())) {
      return delay * 1.1;
    }

    // Simple inputs can be faster
    const simpleElements = ['button', 'a', 'input[type="checkbox"]', 'input[type="radio"]'];
    if (simpleElements.includes(context.elementType.toLowerCase())) {
      return delay * 0.9;
    }

    return delay;
  }

  /**
   * Update action history for pattern detection
   */
  private updateHistory(actionType: string, duration: number): void {
    const now = Date.now();
    this.actionHistory.push({
      timestamp: now,
      duration,
      type: actionType,
    });

    // Keep only recent history (last 20 actions)
    if (this.actionHistory.length > 20) {
      this.actionHistory.shift();
    }
  }

  /**
   * Get statistics about delay performance
   */
  getStats(): {
    averageDelay: number;
    rapidModeActive: boolean;
    totalActions: number;
    averageActionDuration: number;
  } {
    if (this.actionHistory.length === 0) {
      return {
        averageDelay: this.config.baseDelay,
        rapidModeActive: this.rapidMode,
        totalActions: 0,
        averageActionDuration: 0,
      };
    }

    const totalDelay = this.actionHistory.reduce((sum, action) => sum + action.duration, 0);
    const averageDelay = totalDelay / this.actionHistory.length;

    return {
      averageDelay,
      rapidModeActive: this.rapidMode,
      totalActions: this.actionHistory.length,
      averageActionDuration: averageDelay,
    };
  }

  /**
   * Update page state information
   */
  updatePageState(state: { isLoading?: boolean; hasAnimations?: boolean }): void {
    if (state.isLoading !== undefined) {
      this.pageState.isLoading = state.isLoading;
      if (state.isLoading) {
        this.pageState.lastPageLoadTime = Date.now();
      }
    }
    if (state.hasAnimations !== undefined) {
      this.pageState.hasAnimations = state.hasAnimations;
    }
  }

  /**
   * Reset rapid mode and history
   */
  reset(): void {
    this.rapidMode = false;
    this.actionHistory = [];
    logger.debug('Adaptive delay service reset');
  }

  /**
   * Create a new service with different configuration
   */
  withConfig(config: Partial<AdaptiveDelayConfig>): AdaptiveDelayService {
    return new AdaptiveDelayService({ ...this.config, ...config });
  }
}

// Global instance
export const adaptiveDelayService = new AdaptiveDelayService();

/**
 * Convenience function to wait with adaptive delay
 */
export async function adaptiveWait(context: DelayContext): Promise<void> {
  return adaptiveDelayService.wait(context);
}
