import { createLogger } from '@src/background/log';
import type { DOMState } from './views';
import { domCache, type DOMCacheConfig } from './cache';
import { getClickableElements } from './service';

const logger = createLogger('OptimizedDOMService');

/**
 * Configuration for optimized DOM building
 */
export interface OptimizedDOMConfig extends DOMCacheConfig {
  enableIncrementalUpdates: boolean;
  maxRetries: number;
  retryDelay: number;
}

/**
 * Default configuration
 */
export const DEFAULT_OPTIMIZED_CONFIG: OptimizedDOMConfig = {
  maxCacheSize: 10,
  maxAge: 30000,
  enableDiffing: true,
  enableViewportOptimization: true,
  enableIncrementalUpdates: false, // Disabled for now
  maxRetries: 3,
  retryDelay: 1000,
};

/**
 * Optimized DOM service with caching and performance improvements
 */
export class OptimizedDOMService {
  private config: OptimizedDOMConfig;
  private buildPromise: Map<string, Promise<DOMState>> = new Map();

  constructor(config: Partial<OptimizedDOMConfig> = {}) {
    this.config = { ...DEFAULT_OPTIMIZED_CONFIG, ...config };
  }

  /**
   * Build DOM tree with caching and optimization
   */
  async buildDomTree(
    tabId: number,
    url: string,
    options: {
      showHighlightElements?: boolean;
      focusElement?: number;
      viewportExpansion?: number;
      debugMode?: boolean;
      forceRebuild?: boolean;
    } = {}
  ): Promise<DOMState> {
    const {
      showHighlightElements = true,
      focusElement = -1,
      viewportExpansion = 0,
      debugMode = false,
      forceRebuild = false,
    } = options;

    const cacheKey = this.getCacheKey(tabId, url, options);

    // Check if we're already building this DOM
    if (this.buildPromise.has(cacheKey)) {
      logger.debug('DOM build already in progress, waiting...');
      return this.buildPromise.get(cacheKey)!;
    }

    // Check cache first (unless force rebuild)
    if (!forceRebuild) {
      const cached = domCache.get(tabId, url);
      if (cached) {
        logger.debug('Using cached DOM state');
        return cached;
      }
    }

    // Create build promise
    const buildPromise = this.performBuild(
      tabId,
      url,
      showHighlightElements,
      focusElement,
      viewportExpansion,
      debugMode
    );

    // Store promise to prevent duplicate builds
    this.buildPromise.set(cacheKey, buildPromise);

    try {
      const result = await buildPromise;

      // Cache the result
      const checksum = this.computeChecksum(result);
      domCache.set(tabId, url, result, checksum);

      return result;
    } finally {
      // Clean up promise
      this.buildPromise.delete(cacheKey);
    }
  }

  /**
   * Perform the actual DOM build with retry logic
   */
  private async performBuild(
    tabId: number,
    url: string,
    showHighlightElements: boolean,
    focusElement: number,
    viewportExpansion: number,
    debugMode: boolean
  ): Promise<DOMState> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        logger.debug(`Building DOM tree (attempt ${attempt}/${this.config.maxRetries})`);

        const startTime = performance.now();
        const result = await getClickableElements(
          tabId,
          url,
          showHighlightElements,
          focusElement,
          viewportExpansion,
          debugMode
        );

        const duration = performance.now() - startTime;
        logger.debug(`DOM tree built in ${duration.toFixed(2)}ms`);

        // Emit performance metrics if debug mode is on
        if (debugMode) {
          this.emitPerformanceMetrics(tabId, duration, result);
        }

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        logger.error(`DOM build attempt ${attempt} failed:`, lastError);

        if (attempt < this.config.maxRetries) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        }
      }
    }

    // All attempts failed
    throw lastError || new Error('DOM build failed after all retries');
  }

  /**
   * Invalidate cache for a specific tab
   */
  invalidateCache(tabId: number): void {
    domCache.clearTab(tabId);
    logger.debug(`Invalidated cache for tab ${tabId}`);
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    domCache.clear();
    logger.debug('Cleared all DOM caches');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return domCache.getStats();
  }

  /**
   * Preload DOM for a tab to improve responsiveness
   */
  async preloadDom(tabId: number, url: string): Promise<void> {
    try {
      // Build DOM in background without highlights
      await this.buildDomTree(tabId, url, {
        showHighlightElements: false,
        forceRebuild: false,
      });
      logger.debug(`Preloaded DOM for tab ${tabId}`);
    } catch (error) {
      logger.debug('Failed to preload DOM:', error);
    }
  }

  /**
   * Update viewport information for optimization
   */
  updateViewport(
    tabId: number,
    viewport: { width: number; height: number; scrollX: number; scrollY: number }
  ): void {
    domCache.updateViewportInfo(viewport);
  }

  /**
   * Generate cache key for build options
   */
  private getCacheKey(
    tabId: number,
    url: string,
    options: {
      showHighlightElements?: boolean;
      focusElement?: number;
      viewportExpansion?: number;
    }
  ): string {
    return `${tabId}:${url}:${options.showHighlightElements}:${options.focusElement}:${options.viewportExpansion}`;
  }

  /**
   * Compute checksum for DOM state
   */
  private computeChecksum(state: DOMState): string {
    // Simple checksum based on element count
    const countElements = (element: any): number => {
      if (!element.children) return 1;
      return 1 + element.children.reduce((sum: number, child: any) =>
        sum + countElements(child), 0);
    };

    return `${countElements(state.elementTree)}-${state.selectorMap.size}`;
  }

  /**
   * Emit performance metrics for monitoring
   */
  private emitPerformanceMetrics(tabId: number, duration: number, state: DOMState): void {
    const metrics = {
      tabId,
      buildDuration: duration,
      elementCount: this.countElements(state.elementTree),
      interactiveElementCount: state.selectorMap.size,
      cacheSize: domCache.getStats().size,
    };

    // Log metrics (in a real implementation, might send to analytics)
    logger.debug('DOM build performance metrics:', metrics);
  }

  /**
   * Count elements in DOM tree
   */
  private countElements(element: any): number {
    if (!element.children) return 1;
    return 1 + element.children.reduce((sum: number, child: any) =>
      sum + this.countElements(child), 0);
  }
}

// Export singleton instance
export const optimizedDOMService = new OptimizedDOMService();

// Export the optimized build function as drop-in replacement
export const buildDomTree = (
  tabId: number,
  url: string,
  showHighlightElements = true,
  focusElement = -1,
  viewportExpansion = 0,
  debugMode = false
): Promise<DOMState> => {
  return optimizedDOMService.buildDomTree(tabId, url, {
    showHighlightElements,
    focusElement,
    viewportExpansion,
    debugMode,
  });
};
