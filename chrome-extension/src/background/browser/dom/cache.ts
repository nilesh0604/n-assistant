import { createLogger } from '@src/background/log';
import { DOMState, DOMElementNode } from './views';
import type { BuildDomTreeResult } from './raw_types';

const logger = createLogger('DOMCache');

/**
 * Configuration for DOM caching
 */
export interface DOMCacheConfig {
  maxCacheSize: number;
  maxAge: number; // ms
  enableDiffing: boolean;
  enableViewportOptimization: boolean;
}

/**
 * Default configuration for DOM caching
 */
export const DEFAULT_DOM_CACHE_CONFIG: DOMCacheConfig = {
  maxCacheSize: 10,
  maxAge: 30000, // 30 seconds
  enableDiffing: true,
  enableViewportOptimization: true,
};

/**
 * Cache entry for DOM state
 */
interface DOMCacheEntry {
  state: DOMState;
  timestamp: number;
  url: string;
  tabId: number;
  checksum: string;
  viewportHash?: string;
}

/**
 * DOM diff result
 */
export interface DOMDiff {
  hasChanges: boolean;
  changedElements: Set<number>;
  addedElements: Set<number>;
  removedElements: Set<number>;
  needsFullRebuild: boolean;
}

/**
 * DOM Cache Service
 * Caches DOM states to avoid unnecessary rebuilding
 */
export class DOMCacheService {
  private cache: Map<string, DOMCacheEntry> = new Map();
  private config: DOMCacheConfig;
  private lastViewportInfo: { width: number; height: number; scrollX: number; scrollY: number } | null = null;

  constructor(config: Partial<DOMCacheConfig> = {}) {
    this.config = { ...DEFAULT_DOM_CACHE_CONFIG, ...config };
  }

  /**
   * Get cached DOM state
   */
  get(tabId: number, url: string): DOMState | null {
    const key = this.getCacheKey(tabId, url);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry is too old
    if (Date.now() - entry.timestamp > this.config.maxAge) {
      this.cache.delete(key);
      logger.debug('DOM cache entry expired');
      return null;
    }

    logger.debug('DOM cache hit');
    return entry.state;
  }

  /**
   * Store DOM state in cache
   */
  set(tabId: number, url: string, state: DOMState, checksum: string): void {
    const key = this.getCacheKey(tabId, url);

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.config.maxCacheSize) {
      this.evictOldest();
    }

    const entry: DOMCacheEntry = {
      state,
      timestamp: Date.now(),
      url,
      tabId,
      checksum,
      viewportHash: this.getViewportHash(),
    };

    this.cache.set(key, entry);
    logger.debug('DOM state cached');
  }

  /**
   * Check if DOM needs rebuilding based on changes
   */
  async needsRebuild(
    tabId: number,
    url: string,
    newChecksum: string
  ): Promise<{ needsRebuild: boolean; reason?: string }> {
    const cached = this.get(tabId, url);

    if (!cached) {
      return { needsRebuild: true, reason: 'No cached state' };
    }

    // Check if checksum changed
    const cachedEntry = this.cache.get(this.getCacheKey(tabId, url));
    if (cachedEntry && cachedEntry.checksum !== newChecksum) {
      return { needsRebuild: true, reason: 'DOM structure changed' };
    }

    // Check viewport changes if optimization is enabled
    if (this.config.enableViewportOptimization && cachedEntry) {
      const currentViewportHash = this.getViewportHash();
      if (cachedEntry.viewportHash !== currentViewportHash) {
        return { needsRebuild: true, reason: 'Viewport changed' };
      }
    }

    return { needsRebuild: false };
  }

  /**
   * Compute DOM diff between cached and new state
   */
  async computeDiff(
    tabId: number,
    url: string,
    newState: DOMState
  ): Promise<DOMDiff> {
    if (!this.config.enableDiffing) {
      return {
        hasChanges: true,
        changedElements: new Set(),
        addedElements: new Set(),
        removedElements: new Set(),
        needsFullRebuild: true,
      };
    }

    const cached = this.get(tabId, url);
    if (!cached) {
      return {
        hasChanges: true,
        changedElements: new Set(),
        addedElements: new Set(),
        removedElements: new Set(),
        needsFullRebuild: true,
      };
    }

    const diff: DOMDiff = {
      hasChanges: false,
      changedElements: new Set(),
      addedElements: new Set(),
      removedElements: new Set(),
      needsFullRebuild: false,
    };

    // Simple checksum comparison for now
    // In a full implementation, we'd do deep tree diffing
    const cachedChecksum = this.computeChecksum(cached.elementTree);
    const newChecksum = this.computeChecksum(newState.elementTree);

    if (cachedChecksum !== newChecksum) {
      diff.hasChanges = true;
      diff.needsFullRebuild = true; // For now, always rebuild if changed
    }

    return diff;
  }

  /**
   * Update only changed parts of DOM
   */
  async updateDOM(
    tabId: number,
    url: string,
    changes: DOMDiff,
    newElements: Map<number, DOMElementNode>
  ): Promise<DOMState | null> {
    if (!this.config.enableDiffing || changes.needsFullRebuild) {
      return null; // Signal that full rebuild is needed
    }

    const cached = this.get(tabId, url);
    if (!cached) {
      return null;
    }

    // For now, return null to trigger full rebuild
    // In a full implementation, we'd apply patches to the cached tree
    return null;
  }

  /**
   * Clear cache for a specific tab
   */
  clearTab(tabId: number): void {
    const keysToDelete: string[] = [];
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tabId === tabId) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.cache.delete(key));
    logger.debug(`Cleared cache for tab ${tabId}`);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    logger.debug('DOM cache cleared');
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; entries: Array<{ url: string; age: number; size: number }> } {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      url: entry.url,
      age: Date.now() - entry.timestamp,
      size: JSON.stringify(entry.state).length,
    }));

    return {
      size: this.cache.size,
      entries,
    };
  }

  /**
   * Generate cache key
   */
  private getCacheKey(tabId: number, url: string): string {
    return `${tabId}:${url}`;
  }

  /**
   * Evict oldest cache entry
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      logger.debug('Evicted oldest DOM cache entry');
    }
  }

  /**
   * Compute simple checksum for DOM tree
   */
  private computeChecksum(element: DOMElementNode): string {
    // Simple hash based on element count and structure
    // In a real implementation, we'd use a proper hashing algorithm
    const countElements = (el: DOMElementNode): number => {
      let count = 1;
      for (const child of el.children) {
        if (child instanceof DOMElementNode) {
          count += countElements(child);
        }
      }
      return count;
    };

    return `${countElements(element)}-${element.tagName}`;
  }

  /**
   * Get viewport hash for optimization
   */
  private getViewportHash(): string {
    // This would be computed from actual viewport info
    // For now, return a simple hash
    return `${this.lastViewportInfo?.width || 0}x${this.lastViewportInfo?.height || 0}`;
  }

  /**
   * Update viewport info
   */
  updateViewportInfo(info: { width: number; height: number; scrollX: number; scrollY: number }): void {
    this.lastViewportInfo = info;
  }
}

// Global cache instance
export const domCache = new DOMCacheService();
