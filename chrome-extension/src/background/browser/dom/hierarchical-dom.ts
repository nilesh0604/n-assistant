import { createLogger } from '@src/background/log';
import { DOMElementNode, DOMTextNode } from './views';
import type { BrowserState } from '../views';

const logger = createLogger('HierarchicalDOM');

/**
 * DOM hierarchy information
 */
export interface DOMHierarchy {
  depth: number;
  path: string[];
  parent?: DOMElementNode;
  children: DOMElementNode[];
  siblings: DOMElementNode[];
  ancestors: DOMElementNode[];
  descendants: DOMElementNode[];
}

/**
 * Element relationship information
 */
export interface ElementRelationship {
  type: 'parent' | 'child' | 'sibling' | 'ancestor' | 'descendant';
  element: DOMElementNode;
  distance: number;
  strength: number; // Relationship strength based on DOM structure
}

/**
 * Hierarchical traversal options
 */
export interface TraversalOptions {
  maxDepth?: number;
  includeHidden?: boolean;
  includeNonInteractive?: boolean;
  filterByTag?: string[];
  filterByAttribute?: Record<string, string>;
}

/**
 * Hierarchical DOM Service
 * Provides advanced DOM traversal and relationship analysis
 */
export class HierarchicalDOMService {
  private hierarchyCache = new Map<DOMElementNode, DOMHierarchy>();
  private relationshipCache = new Map<string, ElementRelationship[]>();

  /**
   * Get complete hierarchy information for an element
   */
  getHierarchy(element: DOMElementNode, browserState: BrowserState): DOMHierarchy {
    // Check cache first
    if (this.hierarchyCache.has(element)) {
      return this.hierarchyCache.get(element)!;
    }

    const hierarchy: DOMHierarchy = {
      depth: this.calculateDepth(element),
      path: this.generatePath(element),
      parent: element.parent || undefined,
      children: this.getChildren(element),
      siblings: this.getSiblings(element, browserState),
      ancestors: this.getAncestors(element),
      descendants: this.getDescendants(element),
    };

    // Cache the result
    this.hierarchyCache.set(element, hierarchy);

    return hierarchy;
  }

  /**
   * Find elements based on hierarchical relationships
   */
  findByRelationship(
    referenceElement: DOMElementNode,
    relationshipType: ElementRelationship['type'],
    browserState: BrowserState,
    options: TraversalOptions = {}
  ): DOMElementNode[] {
    const cacheKey = `${this.getElementId(referenceElement)}_${relationshipType}_${JSON.stringify(options)}`;

    if (this.relationshipCache.has(cacheKey)) {
      return this.relationshipCache.get(cacheKey)!.map(r => r.element);
    }

    const relationships = this.analyzeRelationships(referenceElement, browserState, options);
    const matchingRelationships = relationships.filter(r => r.type === relationshipType);

    // Sort by relationship strength (strongest first)
    matchingRelationships.sort((a, b) => b.strength - a.strength);

    // Cache the result
    this.relationshipCache.set(cacheKey, matchingRelationships);

    return matchingRelationships.map(r => r.element);
  }

  /**
   * Find the best alternative element when the original is not available
   */
  findBestAlternative(
    originalElement: DOMElementNode,
    browserState: BrowserState,
    options: TraversalOptions = {} // eslint-disable-line @typescript-eslint/no-unused-vars
  ): DOMElementNode | null {
    const hierarchy = this.getHierarchy(originalElement, browserState);

    // Strategy 1: Try siblings with similar characteristics
    const similarSiblings = this.findSimilarSiblings(originalElement, hierarchy.siblings);
    if (similarSiblings.length > 0) {
      logger.info(`Found similar sibling as alternative`);
      return similarSiblings[0];
    }

    // Strategy 2: Try parent if it's interactive
    if (hierarchy.parent && hierarchy.parent.isInteractive) {
      logger.info(`Using parent element as alternative`);
      return hierarchy.parent;
    }

    // Strategy 3: Try children with similar text
    const interactiveChildren = hierarchy.children.filter(child => child.isInteractive);
    const similarChild = this.findSimilarByText(originalElement, interactiveChildren);
    if (similarChild) {
      logger.info(`Found similar child as alternative`);
      return similarChild;
    }

    // Strategy 4: Try elements at the same level with similar structure
    const sameLevelElements = this.findSameLevelElements(originalElement, browserState);
    const structuralMatch = this.findStructuralMatch(originalElement, sameLevelElements);
    if (structuralMatch) {
      logger.info(`Found structural match as alternative`);
      return structuralMatch;
    }

    return null;
  }

  /**
   * Navigate DOM structure using relative paths
   */
  navigateByPath(
    startElement: DOMElementNode,
    path: string[],
    browserState: BrowserState
  ): DOMElementNode | null {
    let current = startElement;

    for (const step of path) {
      if (step === '..') {
        // Move to parent
        current = current.parent || current;
      } else if (step.startsWith('child[')) {
        // Move to specific child
        const index = parseInt(step.match(/\d+/)?.[0] || '0');
        const children = this.getChildren(current);
        current = children[index] || current;
      } else if (step.startsWith('sibling[')) {
        // Move to sibling
        const offset = parseInt(step.match(/[+-]?\d+/)?.[0] || '0');
        const siblings = this.getSiblings(current, browserState);
        const currentIndex = siblings.indexOf(current);
        const targetIndex = currentIndex + offset;
        current = siblings[targetIndex] || current;
      } else if (step.startsWith('descendant::')) {
        // Move to descendant by selector
        const tagName = step.replace('descendant::', '');
        const descendants = this.getDescendants(current);
        const match = descendants.find(el => el.tagName === tagName);
        current = match || current;
      }
    }

    return current === startElement ? null : current;
  }

  /**
   * Analyze all relationships for an element
   */
  private analyzeRelationships(
    element: DOMElementNode,
    browserState: BrowserState,
    options: TraversalOptions = {} // eslint-disable-line @typescript-eslint/no-unused-vars
  ): ElementRelationship[] {
    const relationships: ElementRelationship[] = [];
    const hierarchy = this.getHierarchy(element, browserState);

    // Parent relationship
    if (hierarchy.parent) {
      relationships.push({
        type: 'parent',
        element: hierarchy.parent,
        distance: 1,
        strength: 1.0,
      });
    }

    // Child relationships
    hierarchy.children.forEach((child, index) => {
      relationships.push({
        type: 'child',
        element: child,
        distance: 1,
        strength: 1.0 - (index * 0.1), // Earlier children are stronger
      });
    });

    // Sibling relationships
    hierarchy.siblings.forEach((sibling, index) => {
      const distance = Math.abs(this.getSiblings(element, browserState).indexOf(element) - index);
      relationships.push({
        type: 'sibling',
        element: sibling,
        distance,
        strength: 1.0 / (distance + 1),
      });
    });

    // Ancestor relationships
    hierarchy.ancestors.forEach((ancestor, depth) => {
      relationships.push({
        type: 'ancestor',
        element: ancestor,
        distance: depth + 1,
        strength: 1.0 / (depth + 2),
      });
    });

    // Descendant relationships
    hierarchy.descendants.forEach((descendant) => {
      const distance = this.calculateDepth(descendant) - this.calculateDepth(element);
      relationships.push({
        type: 'descendant',
        element: descendant,
        distance,
        strength: 1.0 / (distance + 1),
      });
    });

    // Apply filters
    return this.applyRelationshipFilters(relationships, options);
  }

  /**
   * Helper methods
   */
  private calculateDepth(element: DOMElementNode): number {
    let depth = 0;
    let current = element.parent;

    while (current) {
      depth++;
      current = current.parent;
    }

    return depth;
  }

  private generatePath(element: DOMElementNode): string[] {
    const path: string[] = [];
    let current: DOMElementNode | undefined = element;

    while (current) {
      const tagName = current.tagName?.toLowerCase() || 'unknown';
      const index = current.parent ? this.getChildren(current.parent).indexOf(current) : 0;
      path.unshift(`${tagName}[${index}]`);
      current = current.parent || undefined;
    }

    return path;
  }

  private getChildren(element: DOMElementNode): DOMElementNode[] {
    return element.children.filter(child => child instanceof DOMElementNode) as DOMElementNode[];
  }

  private getSiblings(element: DOMElementNode, browserState: BrowserState): DOMElementNode[] {
    if (!element.parent) {
      // Root elements - find other root elements
      return Array.from(browserState.selectorMap.values()).filter(el => !el.parent);
    }

    return this.getChildren(element.parent);
  }

  private getAncestors(element: DOMElementNode): DOMElementNode[] {
    const ancestors: DOMElementNode[] = [];
    let current = element.parent;

    while (current) {
      ancestors.push(current);
      current = current.parent || null;
    }

    return ancestors;
  }

  private getDescendants(element: DOMElementNode): DOMElementNode[] {
    const descendants: DOMElementNode[] = [];

    const traverse = (el: DOMElementNode) => {
      const children = this.getChildren(el);
      descendants.push(...children);
      children.forEach(traverse);
    };

    traverse(element);
    return descendants;
  }

  private findSimilarSiblings(element: DOMElementNode, siblings: DOMElementNode[]): DOMElementNode[] {
    const elementText = this.extractTextContent(element);
    const elementClasses = element.attributes.class?.split(/\s+/) || [];

    return siblings
      .filter(sibling => {
        // Same tag name
        if (sibling.tagName !== element.tagName) return false;

        // Similar text content
        const siblingText = this.extractTextContent(sibling);
        if (elementText && siblingText) {
          const similarity = this.calculateTextSimilarity(elementText, siblingText);
          if (similarity < 0.5) return false;
        }

        // Similar classes
        const siblingClasses = sibling.attributes.class?.split(/\s+/) || [];
        const classIntersection = elementClasses.filter(c => siblingClasses.includes(c));
        if (classIntersection.length < Math.min(elementClasses.length, 2)) return false;

        return true;
      })
      .sort((a, b) => {
        // Sort by similarity score
        const scoreA = this.calculateSimilarityScore(element, a);
        const scoreB = this.calculateSimilarityScore(element, b);
        return scoreB - scoreA;
      });
  }

  private findSimilarByText(
    reference: DOMElementNode,
    candidates: DOMElementNode[]
  ): DOMElementNode | null {
    const referenceText = this.extractTextContent(reference);

    if (!referenceText) return null;

    let bestMatch: DOMElementNode | null = null;
    let bestScore = 0;

    for (const candidate of candidates) {
      const candidateText = this.extractTextContent(candidate);
      if (!candidateText) continue;

      const similarity = this.calculateTextSimilarity(referenceText, candidateText);
      if (similarity > bestScore && similarity > 0.5) {
        bestScore = similarity;
        bestMatch = candidate;
      }
    }

    return bestMatch;
  }

  private findSameLevelElements(
    element: DOMElementNode,
    browserState: BrowserState
  ): DOMElementNode[] {
    const elementDepth = this.calculateDepth(element);

    return Array.from(browserState.selectorMap.values()).filter(el => {
      const elDepth = this.calculateDepth(el);
      return elDepth === elementDepth && el !== element;
    });
  }

  private findStructuralMatch(
    reference: DOMElementNode,
    candidates: DOMElementNode[]
  ): DOMElementNode | null {
    const referenceStructure = this.getElementStructure(reference);

    let bestMatch: DOMElementNode | null = null;
    let bestScore = 0;

    for (const candidate of candidates) {
      const candidateStructure = this.getElementStructure(candidate);
      const score = this.calculateStructureSimilarity(referenceStructure, candidateStructure);

      if (score > bestScore && score > 0.6) {
        bestScore = score;
        bestMatch = candidate;
      }
    }

    return bestMatch;
  }

  private getElementStructure(element: DOMElementNode): {
    tagName: string;
    childCount: number;
    hasText: boolean;
    attributes: Record<string, string>;
  } {
    return {
      tagName: element.tagName || '',
      childCount: this.getChildren(element).length,
      hasText: this.extractTextContent(element).length > 0,
      attributes: { ...element.attributes },
    };
  }

  private calculateStructureSimilarity(
    struct1: ReturnType<HierarchicalDOMService['getElementStructure']>,
    struct2: ReturnType<HierarchicalDOMService['getElementStructure']>
  ): number {
    let score = 0;

    // Tag name match (40%)
    if (struct1.tagName === struct2.tagName) {
      score += 0.4;
    }

    // Child count similarity (20%)
    const childCountDiff = Math.abs(struct1.childCount - struct2.childCount);
    const childCountSim = 1 - (childCountDiff / Math.max(struct1.childCount, struct2.childCount, 1));
    score += childCountSim * 0.2;

    // Text presence match (20%)
    if (struct1.hasText === struct2.hasText) {
      score += 0.2;
    }

    // Attribute similarity (20%)
    const attrs1 = Object.keys(struct1.attributes);
    const attrs2 = Object.keys(struct2.attributes);
    const commonAttrs = attrs1.filter(attr => attrs2.includes(attr));
    const attrSim = commonAttrs.length / Math.max(attrs1.length, attrs2.length, 1);
    score += attrSim * 0.2;

    return score;
  }

  private calculateSimilarityScore(el1: DOMElementNode, el2: DOMElementNode): number {
    let score = 0;

    // Tag name (30%)
    if (el1.tagName === el2.tagName) score += 0.3;

    // Text similarity (40%)
    const text1 = this.extractTextContent(el1);
    const text2 = this.extractTextContent(el2);
    if (text1 && text2) {
      score += this.calculateTextSimilarity(text1, text2) * 0.4;
    }

    // Class similarity (30%)
    const classes1 = el1.attributes.class?.split(/\s+/) || [];
    const classes2 = el2.attributes.class?.split(/\s+/) || [];
    const commonClasses = classes1.filter(c => classes2.includes(c));
    const classSim = commonClasses.length / Math.max(classes1.length, classes2.length, 1);
    score += classSim * 0.3;

    return score;
  }

  private extractTextContent(element: DOMElementNode): string {
    let text = '';
    for (const child of element.children) {
      if (child instanceof DOMTextNode) {
        text += child.text || '';
      }
    }
    return text.trim().replace(/\s+/g, ' ').substring(0, 100);
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    if (text1 === text2) return 1.0;
    if (!text1 || !text2) return 0.0;

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

  private applyRelationshipFilters(
    relationships: ElementRelationship[],
    options: TraversalOptions
  ): ElementRelationship[] {
    let filtered = relationships;

    // Filter by max depth
    if (options.maxDepth) {
      filtered = filtered.filter(r => r.distance <= options.maxDepth!);
    }

    // Filter by tag name
    if (options.filterByTag && options.filterByTag.length > 0) {
      filtered = filtered.filter(r =>
        options.filterByTag!.includes(r.element.tagName || '')
      );
    }

    // Filter by attributes
    if (options.filterByAttribute) {
      filtered = filtered.filter(r => {
        for (const [key, value] of Object.entries(options.filterByAttribute!)) {
          if (r.element.attributes[key] !== value) {
            return false;
          }
        }
        return true;
      });
    }

    // Filter hidden/non-interactive elements
    if (!options.includeHidden) {
      filtered = filtered.filter(r => r.element.isVisible);
    }

    if (!options.includeNonInteractive) {
      filtered = filtered.filter(r => r.element.isInteractive);
    }

    return filtered;
  }

  private getElementId(element: DOMElementNode): string {
    // Generate a unique identifier for caching
    return `${element.tagName}_${element.attributes.id}_${element.attributes.class}_${this.extractTextContent(element).substring(0, 20)}`;
  }

  /**
   * Clear caches (useful for dynamic pages)
   */
  clearCaches(): void {
    this.hierarchyCache.clear();
    this.relationshipCache.clear();
    logger.info('Hierarchy and relationship caches cleared');
  }
}
