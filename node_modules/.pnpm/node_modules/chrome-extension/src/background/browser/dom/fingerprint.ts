import { createLogger } from '@src/background/log';
import { DOMElementNode, DOMTextNode } from './views';
import type { ElementFingerprint } from './views';

const logger = createLogger('ElementFingerprint');

/**
 * Element Fingerprint Service
 * Generates stable fingerprints for DOM elements to track them across changes
 */
export class ElementFingerprintService {
  /**
   * Generate a fingerprint for a DOM element
   */
  generateFingerprint(element: DOMElementNode): ElementFingerprint {
    return {
      tagName: element.tagName?.toLowerCase() || 'unknown',
      textContent: this.extractTextContent(element),
      ariaLabel: element.attributes['aria-label'] || null,
      role: element.attributes.role || null,
      nearbyText: this.extractNearbyText(element),
      structuralPath: this.generateStructuralPath(element),
      interactionType: this.determineInteractionType(element),
    };
  }

  /**
   * Calculate similarity score between two fingerprints (0-1)
   * Enhanced with improved weighting and similarity algorithms
   */
  calculateSimilarity(fp1: ElementFingerprint, fp2: ElementFingerprint): number {
    let similarity = 0;
    let factors = 0;
    
    // Compare tag name (high weight)
    if (fp1.tagName === fp2.tagName) {
      similarity += 0.25;
    }
    factors += 0.25;
    
    // Compare text content (high weight)
    const textSimilarity = this.calculateTextSimilarity(fp1.textContent, fp2.textContent);
    similarity += textSimilarity * 0.35;
    factors += 0.35;
    
    // Compare role/aria (medium weight)
    if (fp1.role === fp2.role && fp1.role) {
      similarity += 0.2;
    }
    factors += 0.2;
    
    // Compare interaction type (medium weight)
    if (fp1.interactionType === fp2.interactionType) {
      similarity += 0.1;
    }
    factors += 0.1;
    
    // Compare structural path (low weight)
    const pathSimilarity = this.calculatePathSimilarity(fp1.structuralPath, fp2.structuralPath);
    similarity += pathSimilarity * 0.1;
    factors += 0.1;
    
    return similarity / factors;
  }

  /**
   * Calculate text similarity using word-based Jaccard similarity
   */
  public calculateTextSimilarity(text1: string, text2: string): number {
    if (text1 === text2) return 1;
    if (!text1 || !text2) return 0;
    
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Calculate path similarity with weighted comparison from leaf elements
   */
  public calculatePathSimilarity(path1: string, path2: string): number {
    const segments1 = path1.split(' > ');
    const segments2 = path2.split(' > ');
    
    // Compare from the end (leaf elements are more important)
    let matches = 0;
    const minLength = Math.min(segments1.length, segments2.length);
    
    for (let i = 0; i < minLength; i++) {
      const segment1 = segments1[segments1.length - 1 - i];
      const segment2 = segments2[segments2.length - 1 - i];
      
      if (segment1 === segment2) {
        matches += 1 / (i + 1); // Weight recent matches more heavily
      }
    }
    
    return Math.min(matches, 1);
  }

  /**
   * Find best matching element by fingerprint similarity
   */
  findBestMatch(
    targetFingerprint: ElementFingerprint,
    candidates: DOMElementNode[],
    threshold: number = 0.7
  ): DOMElementNode | null {
    let bestMatch: DOMElementNode | null = null;
    let bestScore = 0;

    for (const candidate of candidates) {
      if (!candidate.fingerprint) {
        continue;
      }

      const similarity = this.calculateSimilarity(targetFingerprint, candidate.fingerprint);
      
      if (similarity > bestScore && similarity >= threshold) {
        bestScore = similarity;
        bestMatch = candidate;
      }
    }

    return bestMatch;
  }

  /**
   * Extract clean text content from element
   */
  private extractTextContent(element: DOMElementNode): string {
    let text = '';
    
    for (const child of element.children) {
      if (child instanceof DOMTextNode) {
        text += child.text || '';
      }
    }

    // Clean up whitespace and normalize
    return text.trim().replace(/\s+/g, ' ').substring(0, 100);
  }

  /**
   * Extract nearby text from sibling and parent elements
   */
  private extractNearbyText(element: DOMElementNode): string[] {
    const nearbyText: string[] = [];
    
    // Get text from parent
    if (element.parent) {
      const parentText = this.extractTextContent(element.parent);
      if (parentText && parentText !== this.extractTextContent(element)) {
        nearbyText.push(parentText);
      }
    }

    // Get text from siblings (simplified - would need actual DOM traversal in real implementation)
    // For now, just collect text from this element's context
    const elementText = this.extractTextContent(element);
    if (elementText) {
      nearbyText.push(elementText);
    }

    // Limit to nearby text array size
    return nearbyText.slice(0, 3).map(text => text.substring(0, 50));
  }

  /**
   * Generate structural path from root to element
   */
  private generateStructuralPath(element: DOMElementNode): string {
    const path: string[] = [];
    let current: DOMElementNode | null = element;

    while (current) {
      const tagName = current.tagName?.toLowerCase() || 'unknown';
      const siblingIndex = this.getSiblingIndex(current);
      path.unshift(`${tagName}[${siblingIndex}]`);
      current = current.parent;
    }

    return path.join(' > ');
  }

  /**
   * Get element's index among its siblings
   */
  private getSiblingIndex(element: DOMElementNode): number {
    if (!element.parent) {
      return 0;
    }

    let index = 0;
    for (const sibling of element.parent.children) {
      if (sibling === element) {
        return index;
      }
      if (sibling instanceof DOMElementNode && sibling.tagName === element.tagName) {
        index++;
      }
    }

    return 0;
  }

  /**
   * Determine likely interaction type for this element
   */
  private determineInteractionType(element: DOMElementNode): ElementFingerprint['interactionType'] {
    const tagName = element.tagName?.toLowerCase();
    const type = element.attributes.type?.toLowerCase();

    if (tagName === 'input' || tagName === 'textarea') {
      return type === 'checkbox' || type === 'radio' ? 'click' : 'input';
    }

    if (tagName === 'select') {
      return 'select';
    }

    if (tagName === 'button' || 
        tagName === 'a' || 
        element.attributes.role === 'button' ||
        element.attributes.onclick !== undefined) {
      return 'click';
    }

    // Default to click for interactive elements
    return element.isInteractive ? 'click' : 'scroll';
  }
}
