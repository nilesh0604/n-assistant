/* eslint-disable @typescript-eslint/no-unused-vars */
import { BasePrompt } from './base';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import type { AgentContext, AgentOutput } from '@src/background/agent/types';
import { createLogger } from '@src/background/log';
import { navigatorSystemPromptTemplate } from './templates/navigator';
import { DOMSummaryService } from '@src/background/browser/dom/summary';
import { ElementDisclosureService, type ElementDisclosure, type TaskContext } from '@src/background/browser/dom/element-disclosure';
import type { ActionResult } from '@src/background/agent/types';

const logger = createLogger('agent/prompts/navigator');

export interface NavigatorPromptOptions {
  maxActionsPerStep?: number;
  useHierarchicalDOM?: boolean;
  maxElements?: number;
  useProgressiveDisclosure?: boolean;
  disclosureConfig?: {
    maxEssentialElements?: number;
    maxRelevantElements?: number;
    relevanceThreshold?: number;
  };
}

export class NavigatorPrompt extends BasePrompt {
  private systemMessage: SystemMessage;
  private domSummaryService: DOMSummaryService;
  private elementDisclosureService: ElementDisclosureService;
  private options: NavigatorPromptOptions;

  constructor(options: NavigatorPromptOptions = {}) {
    super();

    this.options = {
      maxActionsPerStep: 10,
      useHierarchicalDOM: false,
      maxElements: 100,
      useProgressiveDisclosure: true,
      disclosureConfig: {
        maxEssentialElements: 20,
        maxRelevantElements: 50,
        relevanceThreshold: 0.3,
      },
      ...options
    };

    const promptTemplate = navigatorSystemPromptTemplate;
    // Format the template with the maxActionsPerStep
    const formattedPrompt = promptTemplate.replace('{{max_actions}}', this.options.maxActionsPerStep!.toString()).trim();
    this.systemMessage = new SystemMessage(formattedPrompt);
    
    // Initialize DOM summary service for hierarchical representation
    this.domSummaryService = new DOMSummaryService();
    
    // Initialize element disclosure service
    this.elementDisclosureService = new ElementDisclosureService(this.options.disclosureConfig);
  }

  getSystemMessage(): SystemMessage {
    /**
     * Get the system prompt for the agent.
     *
     * @returns SystemMessage containing the formatted system prompt
     */
    return this.systemMessage;
  }

  /**
   * Override to use hierarchical DOM when enabled
   */
  async getUserMessage(context: AgentContext): Promise<HumanMessage> {
    if (this.options.useHierarchicalDOM) {
      console.log('🌳 Using Hierarchical DOM representation');
      return this.buildHierarchicalBrowserStateMessage(context);
    } else {
      console.log('📄 Using Full DOM representation');
      return this.buildBrowserStateUserMessage(context);
    }
  }

  /**
   * Build user message with hierarchical DOM representation
   */
  private async buildHierarchicalBrowserStateMessage(context: AgentContext): Promise<HumanMessage> {
    const browserState = await context.browserContext.getState(context.options.useVision);
    
    // Generate hierarchical DOM summary
    const focusArea = this.domSummaryService.getViewportFocusArea();
    const domSummary = this.domSummaryService.createHierarchicalDOM(
      browserState,
      focusArea ?? undefined,
      this.options.maxElements
    );
    
    // Apply progressive element disclosure if enabled
    let processedSummary = domSummary;
    let disclosureInfo: ElementDisclosure | null = null;
    
    if (this.options.useProgressiveDisclosure) {
      console.log('🔍 Applying Progressive Element Disclosure');
      
      // Create task context for relevance scoring
      const taskContext = this.createTaskContext(context, browserState);
      
      // Apply element filtering
      disclosureInfo = this.elementDisclosureService.filterElementsByRelevance(
        domSummary.keyElements,
        taskContext,
        domSummary
      );
      
      // Create new summary with filtered elements
      processedSummary = {
        ...domSummary,
        keyElements: [...disclosureInfo.essential, ...disclosureInfo.relevant],
        interactiveCount: disclosureInfo.essential.length + disclosureInfo.relevant.filter(e => e.isInteractive).length,
      };
      
      // Log disclosure metrics
      console.log(`🎯 Element Disclosure: ${disclosureInfo.essential.length} essential, ${disclosureInfo.relevant.length} relevant, ${disclosureInfo.hidden} hidden`);
      console.log(`📊 Disclosure ratio: ${(disclosureInfo.disclosureRatio * 100).toFixed(1)}% (task phase: ${taskContext.taskPhase})`);
    }
    
    // Log DOM optimization metrics
    const originalElementCount = browserState.selectorMap.size;
    const summaryElementCount = processedSummary.keyElements.length;
    const reductionPercentage = Math.round((1 - summaryElementCount/originalElementCount) * 100);
    console.log(`🔍 DOM Optimization: ${originalElementCount} → ${summaryElementCount} elements (${reductionPercentage}% reduction)`);
    console.log(`📊 Key elements: ${processedSummary.keyElements.length}, Total elements: ${processedSummary.totalElements}`);
    
    const summaryMarkdown = this.domSummaryService.summaryToMarkdown(processedSummary);

    // Add disclosure information to the prompt if enabled
    let disclosureNote = '';
    if (disclosureInfo) {
      disclosureNote = `\n\nNote: ${disclosureInfo.hidden} additional elements hidden for relevance (showing ${disclosureInfo.disclosureRatio.toFixed(1)}% of elements). Task phase: ${disclosureInfo.metadata.taskPhase}.`;
    }

    let stepInfoDescription = '';
    if (context.stepInfo) {
      stepInfoDescription = `Current step: ${context.stepInfo.stepNumber + 1}/${context.stepInfo.maxSteps}`;
    }

    const timeStr = new Date().toISOString().slice(0, 16).replace('T', ' ');
    stepInfoDescription += `Current date and time: ${timeStr}`;

    let actionResultsDescription = '';
    if (context.actionResults.length > 0) {
      for (let i = 0; i < context.actionResults.length; i++) {
        const result = context.actionResults[i];
        if (result.extractedContent) {
          actionResultsDescription += `\nAction result ${i + 1}/${context.actionResults.length}: ${result.extractedContent}`;
        }
        if (result.error) {
          const error = result.error.split('\n').pop();
          actionResultsDescription += `\nAction error ${i + 1}/${context.actionResults.length}: ...${error}`;
        }
      }
    }

    const currentTab = `{id: ${browserState.tabId}, url: ${browserState.url}, title: ${browserState.title}}`;
    const otherTabs = browserState.tabs
      .filter(tab => tab.id !== browserState.tabId)
      .map(tab => `- {id: ${tab.id}, url: ${tab.url}, title: ${tab.title}}`);
    
    const stateDescription = `
[Task history memory ends]
[Current state starts here]
The following is one-time information - if you need to remember it write it to memory:
Current tab: ${currentTab}
Other available tabs:
  ${otherTabs.join('\n')}
Hierarchical DOM representation ( optimized for context window usage ):${disclosureNote}
${summaryMarkdown}
${stepInfoDescription}
${actionResultsDescription}
`;

    if (browserState.screenshot && context.options.useVision) {
      return new HumanMessage({
        content: [
          { type: 'text', text: stateDescription },
          {
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${browserState.screenshot}` },
          },
        ],
      });
    }

    return new HumanMessage(stateDescription);
  }

  /**
   * Create task context for element relevance scoring
   */
  private createTaskContext(context: AgentContext, browserState: any): TaskContext {
    // Extract current task from message manager, filtering for HumanMessage types
    const messages = context.messageManager.getMessages();
    const humanMessages = messages.filter(msg => msg.getType() === 'human');
    const currentTask = humanMessages.length > 0 
      ? humanMessages[humanMessages.length - 1].content as string
      : 'Navigate and interact with webpage';
    
    // Determine task phase based on task content and execution state
    const taskPhase = this.determineTaskPhase(currentTask, context.actionResults);
    
    // Extract target element types from task
    const targetElements = this.extractTargetElements(currentTask);
    
    return {
      currentTask,
      taskPhase,
      targetElements,
      previousActions: context.actionResults,
      currentUrl: browserState.url,
      executionStep: context.stepInfo?.stepNumber || 0,
    };
  }

  /**
   * Determine task phase based on content and execution history
   */
  private determineTaskPhase(task: string, actionResults: ActionResult[]): TaskContext['taskPhase'] {
    const taskLower = task.toLowerCase();
    
    // Check for navigation keywords
    if (taskLower.includes('navigate') || taskLower.includes('go to') || taskLower.includes('open')) {
      return 'navigation';
    }
    
    // Check for form filling keywords
    if (taskLower.includes('fill') || taskLower.includes('form') || taskLower.includes('input') || taskLower.includes('type')) {
      return 'form_filling';
    }
    
    // Check for verification keywords
    if (taskLower.includes('verify') || taskLower.includes('check') || taskLower.includes('confirm')) {
      return 'verification';
    }
    
    // Check for exploration keywords
    if (taskLower.includes('explore') || taskLower.includes('browse') || taskLower.includes('find')) {
      return 'exploration';
    }
    
    // Default to interaction for general tasks
    return 'interaction';
  }

  /**
   * Extract target element types from task description
   */
  private extractTargetElements(task: string): string[] {
    const targets: string[] = [];
    const taskLower = task.toLowerCase();
    
    // Common element types
    const elementTypes = ['button', 'input', 'link', 'form', 'select', 'textarea', 'checkbox', 'radio'];
    
    elementTypes.forEach(type => {
      if (taskLower.includes(type)) {
        targets.push(type);
      }
    });
    
    return targets;
  }
}
