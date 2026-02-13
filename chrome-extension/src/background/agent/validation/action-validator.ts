import { createLogger } from '@src/background/log';
import type { Action } from '../actions/builder';
import type { AgentContext } from '../types';
import { DOMElementNode, DOMState } from '../../browser/dom/views';
import { ElementFingerprintService } from '../../browser/dom/fingerprint';
import { ElementStabilityChecker } from './element-stability-checker';
import { t } from '@extension/i18n';

const logger = createLogger('ActionValidator');

/**
 * Interface for action validation result
 */
export interface ActionValidation {
  canExecute: boolean;
  elementExists: boolean;
  elementVisible: boolean;
  elementEnabled: boolean;
  elementStable: boolean;
  stabilityResult?: {
    isStable: boolean;
    reason: string;
    recommendations: string[];
  };
  alternativeIndex?: number;
  errors: string[];
  warnings: string[];
}

/**
 * Interface for element fingerprint for future enhancement
 */
export interface ElementFingerprint {
  tagName: string;
  textContent: string;
  ariaLabel: string | null;
  role: string | null;
  nearbyText: string[];
  structuralPath: string;
  interactionType: 'click' | 'input' | 'select' | 'scroll';
}

/**
 * Pre-Action Validation Service
 * Validates actions before execution to prevent errors and enable recovery
 */
export class ActionValidator {
  private fingerprintService: ElementFingerprintService;
  private stabilityChecker: ElementStabilityChecker;

  constructor(private context: AgentContext) {
    this.fingerprintService = new ElementFingerprintService();
    this.stabilityChecker = new ElementStabilityChecker();
  }

  /**
   * Validate a single action before execution
   */
  async validateAction(
    action: Record<string, unknown>,
    state: DOMState
  ): Promise<ActionValidation> {
    const validation: ActionValidation = {
      canExecute: false,
      elementExists: false,
      elementVisible: false,
      elementEnabled: false,
      elementStable: false,
      errors: [],
      warnings: [],
    };

    try {
      // Get the target element
      const element = this.getTargetElement(action, state);

      if (!element) {
        validation.errors.push('Element not found');
        return validation;
      }

      validation.elementExists = true;
      validation.elementVisible = element.isVisible;

      // Check if element is enabled
      validation.elementEnabled = this.isElementEnabled(element);

      // Check element stability (not animating/loading)
      const stabilityResult = await this.stabilityChecker.checkStability(element);
      validation.elementStable = stabilityResult.isStable;
      validation.stabilityResult = {
        isStable: stabilityResult.isStable,
        reason: stabilityResult.reason,
        recommendations: stabilityResult.recommendations,
      };

      if (!stabilityResult.isStable) {
        validation.warnings.push(`Element may not be stable: ${stabilityResult.reason}`);
      }

      // Validate action-specific requirements
      const actionValidation = this.validateActionSpecificRequirements(action, element);
      validation.errors.push(...actionValidation.errors);
      validation.warnings.push(...actionValidation.warnings);

      // Determine if action can be executed
      validation.canExecute =
        validation.elementExists &&
        validation.elementVisible &&
        validation.elementEnabled &&
        validation.elementStable &&
        validation.errors.length === 0;

      // Try to find alternative if primary element is not suitable
      if (!validation.canExecute && validation.elementExists) {
        const alternative = await this.findAlternativeElement(action, state);
        if (alternative !== null) {
          validation.alternativeIndex = alternative;
          validation.canExecute = true;
          validation.warnings.push('Using alternative element');
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      validation.errors.push(`Validation error: ${errorMessage}`);
      logger.error('Action validation failed', error);
    }

    return validation;
  }

  /**
   * Validate multiple actions in batch
   */
  async validateActions(
    actions: Record<string, unknown>[],
    state: DOMState
  ): Promise<ActionValidation[]> {
    return Promise.all(
      actions.map(action => this.validateAction(action, state))
    );
  }

  /**
   * Get target element from action
   */
  private getTargetElement(
    action: Record<string, unknown>,
    state: DOMState
  ): DOMElementNode | null {
    const index = action.index as number;

    if (typeof index !== 'number' || index < 0) {
      return null;
    }

    // Find element by highlight index
    return this.findElementByIndex(state, index);
  }

  /**
   * Find element by highlight index in DOM state
   */
  private findElementByIndex(state: DOMState, index: number): DOMElementNode | null {
    const searchInNode = (node: any): DOMElementNode | null => {
      if (node.highlightIndex === index) {
        return node;
      }

      if (node.children) {
        for (const child of node.children) {
          const found = searchInNode(child);
          if (found) return found;
        }
      }

      return null;
    };

    return searchInNode(state.elementTree);
  }

  /**
   * Check if element is enabled for interaction
   */
  private isElementEnabled(element: DOMElementNode): boolean {
    // Check for disabled attribute
    if (element.attributes.disabled === 'disabled' || element.attributes.disabled === 'true') {
      return false;
    }

    // Check for aria-disabled
    if (element.attributes['aria-disabled'] === 'true') {
      return false;
    }

    // Check for readonly attribute on inputs
    if (element.attributes.readonly === 'readonly' || element.attributes.readonly === 'true') {
      return false;
    }

    return true;
  }

  /**
   * Validate action-specific requirements
   */
  private validateActionSpecificRequirements(
    action: Record<string, unknown>,
    element: DOMElementNode
  ): { errors: string[]; warnings: string[] } {
    const result = { errors: [], warnings: [] } as { errors: string[]; warnings: string[] };

    const actionType = action.type as string;

    switch (actionType) {
      case 'click_element':
        this.validateClickAction(action, element, result);
        break;

      case 'input_text':
        this.validateInputAction(action, element, result);
        break;

      case 'select_dropdown_option':
        this.validateSelectAction(action, element, result);
        break;

      case 'scroll_to_text':
        this.validateScrollAction(action, result);
        break;

      default:
        // Unknown action type - add warning but don't block execution
        result.warnings.push(`Unknown action type: ${actionType}`);
    }

    return result;
  }

  /**
   * Validate click action
   */
  private validateClickAction(
    action: Record<string, unknown>,
    element: DOMElementNode,
    result: { errors: string[]; warnings: string[] }
  ): void {
    // Check if element is clickable
    const clickableTags = ['button', 'a', 'input', 'select', 'textarea', 'option'];
    const isClickableTag = clickableTags.includes(element.tagName?.toLowerCase() || '');

    const hasClickRole = element.attributes.role === 'button' || element.attributes.role === 'link';
    const hasClickHandler = element.attributes.onclick !== undefined;

    if (!isClickableTag && !hasClickRole && !hasClickHandler) {
      result.warnings.push('Element may not be clickable');
    }

    // Check for destructive actions
    const destructiveTexts = ['delete', 'remove', 'cancel', 'exit', 'close'];
    const elementText = (element.getAllTextTillNextClickableElement() || '').toLowerCase();
    const isDestructive = destructiveTexts.some(text => elementText.includes(text));

    if (isDestructive) {
      result.warnings.push('Action may be destructive');
    }
  }

  /**
   * Validate input action
   */
  private validateInputAction(
    action: Record<string, unknown>,
    element: DOMElementNode,
    result: { errors: string[]; warnings: string[] }
  ): void {
    const inputTags = ['input', 'textarea'];
    const isInputTag = inputTags.includes(element.tagName?.toLowerCase() || '');

    if (!isInputTag) {
      result.errors.push('Element is not an input field');
      return;
    }

    // Check if input type is compatible with text input
    const inputType = element.attributes.type || 'text';
    const incompatibleTypes = ['file', 'checkbox', 'radio', 'submit', 'button', 'image'];

    if (incompatibleTypes.includes(inputType.toLowerCase())) {
      result.errors.push(`Cannot input text into input type: ${inputType}`);
    }

    // Check for maxlength constraint
    const text = action.text as string;
    const maxlength = element.attributes.maxlength;

    if (text && maxlength && text.length > parseInt(maxlength)) {
      result.warnings.push('Input text exceeds maxlength attribute');
    }
  }

  /**
   * Validate select action
   */
  private validateSelectAction(
    action: Record<string, unknown>,
    element: DOMElementNode,
    result: { errors: string[]; warnings: string[] }
  ): void {
    const selectTags = ['select'];
    const isSelectTag = selectTags.includes(element.tagName?.toLowerCase() || '');

    if (!isSelectTag) {
      result.errors.push('Element is not a select dropdown');
      return;
    }

    // Check if option exists (basic validation)
    const optionText = action.option as string;
    if (!optionText) {
      result.errors.push('No option specified for select action');
    }
  }

  /**
   * Validate scroll action
   */
  private validateScrollAction(
    action: Record<string, unknown>,
    result: { errors: string[]; warnings: string[] }
  ): void {
    const text = action.text as string;
    if (!text || text.trim() === '') {
      result.errors.push('No text specified for scroll action');
    }
  }

  /**
   * Find alternative element using fingerprint similarity
   */
  private async findAlternativeElement(
    action: Record<string, unknown>,
    state: DOMState
  ): Promise<number | null> {
    const index = action.index as number;
    const originalElement = this.findElementByIndex(state, index);

    if (!originalElement || !originalElement.fingerprint) {
      return null;
    }

    // Get all interactive elements as candidates
    const candidates = this.getAllInteractiveElements(state);

    // Find best match using fingerprint similarity
    const bestMatch = this.fingerprintService.findBestMatch(
      originalElement.fingerprint,
      candidates,
      0.7 // similarity threshold
    );

    return bestMatch?.highlightIndex ?? null;
  }

  /**
   * Get all interactive elements from DOM state
   */
  private getAllInteractiveElements(state: DOMState): DOMElementNode[] {
    const interactiveElements: DOMElementNode[] = [];

    const collectInteractiveElements = (node: any): void => {
      if (node instanceof DOMElementNode && node.isInteractive && node.highlightIndex !== null) {
        interactiveElements.push(node);
      }

      if (node.children) {
        for (const child of node.children) {
          collectInteractiveElements(child);
        }
      }
    };

    collectInteractiveElements(state.elementTree);
    return interactiveElements;
  }
}
