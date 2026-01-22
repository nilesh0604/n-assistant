import { createLogger } from '@src/background/log';
import { DOMElementNode, DOMTextNode } from './views';
import type { BrowserState } from '../views';
import type { ElementFingerprint } from './views';
import { ElementFingerprintService } from './fingerprint';

const logger = createLogger('DOMSummary');

/**
 * Element summary for hierarchical representation
 */
export interface ElementSummary {
  index: number;
  tagName: string;
  text: string;
  attributes: Record<string, string>;
  isVisible: boolean;
  isInteractive: boolean;
  xpath: string;
  role?: string;
  fingerprint?: ElementFingerprint;
}

/**
 * Hierarchical DOM summary levels
 */
export type DOMSummaryLevel = 'page' | 'section' | 'component';

/**
 * Hierarchical DOM representation
 */
export interface DOMSummary {
  level: DOMSummaryLevel;
  interactiveCount: number;
  keyElements: ElementSummary[];
  expandedRegion?: DOMSummary;
  totalElements: number;
  description: string;
}

/**
 * Focus area for detailed expansion
 */
export interface FocusArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * DOM Summary Service for hierarchical representation
 * Optimizes context window usage while maintaining accuracy for LLM decisions
 */
export class DOMSummaryService {
  private fingerprintService = new ElementFingerprintService();
  
  /**
   * Create hierarchical DOM summary
   */
  createHierarchicalDOM(
    browserState: BrowserState,
    focusArea?: FocusArea,
    maxElements: number = 100
  ): DOMSummary {
    const { elementTree, selectorMap } = browserState;
    
    // Start with page-level summary
    const pageSummary = this.createPageSummary(elementTree, selectorMap, maxElements);
    
    // If focus area provided, create expanded region
    if (focusArea) {
      const expandedRegion = this.createExpandedRegion(
        elementTree,
        selectorMap,
        focusArea,
        Math.floor(maxElements / 2)
      );
      pageSummary.expandedRegion = expandedRegion;
    }
    
    return pageSummary;
  }

  /**
   * Create page-level summary (navigation, main content, footer)
   */
  private createPageSummary(
    elementTree: DOMElementNode,
    selectorMap: Map<number, DOMElementNode>,
    maxElements: number
  ): DOMSummary {
    const keyElements: ElementSummary[] = [];
    const semanticSections = new Map<string, DOMElementNode[]>();
    
    // Identify semantic landmarks
    this.identifySemanticSections(elementTree, semanticSections);
    
    // Process each semantic section
    for (const [sectionType, elements] of semanticSections) {
      const sectionElements = this.processSectionElements(elements, selectorMap, Math.floor(maxElements / 4));
      keyElements.push(...sectionElements);
    }
    
    // Add any remaining interactive elements not in semantic sections
    const remainingInteractive = this.getRemainingInteractiveElements(
      elementTree,
      selectorMap,
      keyElements,
      Math.floor(maxElements / 2)
    );
    keyElements.push(...remainingInteractive);
    
    const interactiveCount = keyElements.filter(el => el.isInteractive).length;
    
    return {
      level: 'page',
      interactiveCount,
      keyElements: keyElements.slice(0, maxElements),
      totalElements: selectorMap.size,
      description: `Page summary with ${semanticSections.size} semantic sections and ${interactiveCount} interactive elements`
    };
  }

  /**
   * Create expanded region for focus area
   */
  private createExpandedRegion(
    elementTree: DOMElementNode,
    selectorMap: Map<number, DOMElementNode>,
    focusArea: FocusArea,
    maxElements: number
  ): DOMSummary {
    const focusElements: ElementSummary[] = [];
    
    // Find elements in focus area
    for (const [index, element] of selectorMap) {
      if (this.isElementInFocusArea(element, focusArea)) {
        const summary = this.createElementSummary(element, index);
        focusElements.push(summary);
      }
    }
    
    // Sort by visibility and interactivity
    focusElements.sort((a, b) => {
      if (a.isInteractive && !b.isInteractive) return -1;
      if (!a.isInteractive && b.isInteractive) return 1;
      if (a.isVisible && !b.isVisible) return -1;
      if (!a.isVisible && b.isVisible) return 1;
      return 0;
    });
    
    const interactiveCount = focusElements.filter(el => el.isInteractive).length;
    
    return {
      level: 'component',
      interactiveCount,
      keyElements: focusElements.slice(0, maxElements),
      totalElements: focusElements.length,
      description: `Focus area expansion with ${interactiveCount} interactive elements`
    };
  }

  /**
   * Identify semantic sections (nav, main, form, etc.)
   */
  private identifySemanticSections(
    element: DOMElementNode,
    sections: Map<string, DOMElementNode[]>
  ): void {
    const tagName = element.tagName?.toLowerCase();
    const role = element.attributes.role;
    
    // Check for semantic landmarks
    if (tagName && this.isSemanticLandmark(tagName, role)) {
      const sectionType = this.getSectionType(tagName, role);
      if (!sections.has(sectionType)) {
        sections.set(sectionType, []);
      }
      sections.get(sectionType)!.push(element);
    }
    
    // Recursively process children
    for (const child of element.children) {
      if (child instanceof DOMElementNode) {
        this.identifySemanticSections(child, sections);
      }
    }
  }

  /**
   * Check if element is a semantic landmark
   */
  private isSemanticLandmark(tagName: string, role?: string): boolean {
    const semanticTags = ['nav', 'main', 'header', 'footer', 'aside', 'section', 'article'];
    const semanticRoles = ['navigation', 'main', 'banner', 'contentinfo', 'complementary', 'region'];
    
    return semanticTags.includes(tagName) || 
           (role && semanticRoles.includes(role)) ||
           tagName === 'form';
  }

  /**
   * Get section type for semantic landmark
   */
  private getSectionType(tagName: string, role?: string): string {
    const tagToSection: Record<string, string> = {
      'nav': 'navigation',
      'main': 'main',
      'header': 'header',
      'footer': 'footer',
      'aside': 'sidebar',
      'section': 'section',
      'article': 'article',
      'form': 'form'
    };
    
    if (role && ['navigation', 'main', 'banner', 'contentinfo', 'complementary'].includes(role)) {
      return role;
    }
    
    return tagToSection[tagName] || 'section';
  }

  /**
   * Process elements in a semantic section
   */
  private processSectionElements(
    elements: DOMElementNode[],
    selectorMap: Map<number, DOMElementNode>,
    maxElements: number
  ): ElementSummary[] {
    const summaries: ElementSummary[] = [];
    
    for (const element of elements) {
      // Add the section landmark itself
      const elementIndex = this.findElementIndex(element, selectorMap);
      if (elementIndex !== null) {
        summaries.push(this.createElementSummary(element, elementIndex));
      }
      
      // Add key interactive elements within the section
      const interactiveElements = this.findInteractiveElements(element, selectorMap, Math.floor(maxElements / 2));
      summaries.push(...interactiveElements);
    }
    
    return summaries.slice(0, maxElements);
  }

  /**
   * Find remaining interactive elements not already included
   */
  private getRemainingInteractiveElements(
    elementTree: DOMElementNode,
    selectorMap: Map<number, DOMElementNode>,
    includedElements: ElementSummary[],
    maxElements: number
  ): ElementSummary[] {
    const includedIndexes = new Set(includedElements.map(el => el.index));
    const remaining: ElementSummary[] = [];
    
    for (const [index, element] of selectorMap) {
      if (element.isInteractive && !includedIndexes.has(index)) {
        remaining.push(this.createElementSummary(element, index));
        if (remaining.length >= maxElements) break;
      }
    }
    
    return remaining;
  }

  /**
   * Find interactive elements within a container
   */
  private findInteractiveElements(
    container: DOMElementNode,
    selectorMap: Map<number, DOMElementNode>,
    maxElements: number
  ): ElementSummary[] {
    const interactive: ElementSummary[] = [];
    
    for (const child of container.children) {
      if (child instanceof DOMElementNode) {
        if (child.isInteractive) {
          const index = this.findElementIndex(child, selectorMap);
          if (index !== null) {
            interactive.push(this.createElementSummary(child, index));
            if (interactive.length >= maxElements) break;
          }
        }
        
        // Recursively search children
        if (interactive.length < maxElements) {
          const childInteractive = this.findInteractiveElements(child, selectorMap, maxElements - interactive.length);
          interactive.push(...childInteractive);
        }
      }
    }
    
    return interactive;
  }

  /**
   * Check if element is within viewport bounds
   */
  private isElementInViewport(element: DOMElementNode): boolean {
    if (!element.viewportCoordinates) {
      return false;
    }
    const box = element.viewportCoordinates;
    return (
      box.topLeft.x < window.innerWidth &&
      box.topLeft.x + box.width > 0 &&
      box.topLeft.y < window.innerHeight &&
      box.topLeft.y + box.height > 0
    );
  }

  /**
   * Check if element is within focus area
   */
  private isElementInFocusArea(element: DOMElementNode, focusArea: FocusArea): boolean {
    if (!element.viewportCoordinates) {
      return false;
    }
    
    const box = element.viewportCoordinates;
    return (
      box.topLeft.x < focusArea.x + focusArea.width &&
      box.topLeft.x + box.width > focusArea.x &&
      box.topLeft.y < focusArea.y + focusArea.height &&
      box.topLeft.y + box.height > focusArea.y
    );
  }

  /**
   * Find element index in selector map
   */
  private findElementIndex(
    element: DOMElementNode,
    selectorMap: Map<number, DOMElementNode>
  ): number | null {
    for (const [index, mapElement] of selectorMap) {
      if (mapElement === element) {
        return index;
      }
    }
    return null;
  }

  /**
   * Create element summary
   */
  private createElementSummary(element: DOMElementNode, index: number): ElementSummary {
    const text = this.extractTextContent(element);
    const fingerprint = this.fingerprintService.generateFingerprint(element);
    
    return {
      index,
      tagName: element.tagName || '',
      text,
      attributes: element.attributes,
      isVisible: element.isVisible,
      isInteractive: element.isInteractive,
      xpath: element.xpath || '',
      role: element.attributes.role,
      fingerprint
    };
  }

  /**
   * Extract text content from element
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

  /**
   * Convert DOM summary to markdown for LLM consumption
   */
  summaryToMarkdown(summary: DOMSummary): string {
    let markdown = `# DOM Summary (${summary.level})\n\n`;
    markdown += `${summary.description}\n\n`;
    markdown += `**Total Elements:** ${summary.totalElements}\n`;
    markdown += `**Interactive Elements:** ${summary.interactiveCount}\n\n`;
    
    if (summary.keyElements.length > 0) {
      markdown += `## Key Elements\n\n`;
      for (const element of summary.keyElements) {
        const status = element.isVisible ? '👁️' : '🚫';
        const interactive = element.isInteractive ? '🔗' : '📄';
        markdown += `${status}${interactive} **[${element.index}]** \`${element.tagName}\``;
        
        if (element.role) {
          markdown += ` (role: ${element.role})`;
        }
        
        if (element.text) {
          markdown += ` - "${element.text}"`;
        }
        
        if (element.attributes.id) {
          markdown += ` #${element.attributes.id}`;
        }
        
        if (element.attributes.class) {
          markdown += ` .${element.attributes.class.split(/\s+/).join('.')}`;
        }
        
        markdown += '\n';
      }
    }
    
    if (summary.expandedRegion) {
      markdown += '\n---\n\n';
      markdown += this.summaryToMarkdown(summary.expandedRegion);
    }
    
    return markdown;
  }

  /**
   * Get viewport-based focus area
   */
  getViewportFocusArea(): FocusArea | null {
    // This would typically come from browser context
    // For now, return null to indicate no specific focus
    return null;
  }
}
