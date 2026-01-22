import { createLogger } from '@src/background/log';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { type BaseMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { t } from '@extension/i18n';

const logger = createLogger('IntentAnalyzer');

/**
 * Intent analysis result with ambiguity detection
 */
export interface IntentAnalysis {
  primaryIntent: string;
  confidence: number;
  ambiguities: string[];
  assumptions: string[];
  clarificationNeeded: boolean;
  suggestedClarification?: string;
  clarifiedTask?: string;
}

/**
 * Ambiguity patterns for detection
 */
interface AmbiguityPattern {
  pattern: RegExp;
  type: 'missing_specificity' | 'multiple_meanings' | 'context_required' | 'vague_reference';
  clarification: string;
}

/**
 * Intent Analyzer Service
 * Detects ambiguities in user tasks and suggests clarifications
 */
export class IntentAnalyzer {
  private llm: BaseChatModel;
  private ambiguityPatterns: AmbiguityPattern[];
  private port?: chrome.runtime.Port;

  constructor(llm: BaseChatModel, port?: chrome.runtime.Port) {
    this.llm = llm;
    this.port = port;
    this.ambiguityPatterns = [
      {
        pattern: /\b(the|a|an) (button|link|input|field|element|section|area)\b/gi,
        type: 'missing_specificity',
        clarification: 'Which specific button/link/element are you referring to? Please provide more details like its text, position, or purpose.',
      },
      {
        pattern: /\b(search|find|look for|get)\b/gi,
        type: 'context_required',
        clarification: 'What specifically are you searching for? Please describe the target content, text, or element.',
      },
      {
        pattern: /\b(click|press|select|choose)\b(?!(.*\b(submit|login|search|cancel|ok|yes|no)\b))/gi,
        type: 'vague_reference',
        clarification: 'Which element should be clicked? Please specify the button text, label, or description.',
      },
      {
        pattern: /\b(fill|enter|type|input)\b(?!(.*\b(email|password|name|username|address|phone)\b))/gi,
        type: 'missing_specificity',
        clarification: 'What information should be entered and in which field?',
      },
      {
        pattern: /\b(go to|navigate|open)\b(?!(.*\b(http|www|\.com|\.org|\.net)\b))/gi,
        type: 'context_required',
        clarification: 'Which page or website should be navigated to?',
      },
    ];
  }

  /**
   * Analyze task intent and detect ambiguities
   */
  async analyzeIntent(task: string): Promise<IntentAnalysis> {
    logger.info(`Analyzing intent for task: "${task}"`);

    // Step 1: Pattern-based ambiguity detection
    const patternAmbiguities = this.detectPatternAmbiguities(task);
    
    // Step 2: LLM-based semantic analysis
    const semanticAnalysis = await this.performSemanticAnalysis(task);
    
    // Step 3: Combine results
    const analysis: IntentAnalysis = {
      primaryIntent: semanticAnalysis.primaryIntent,
      confidence: semanticAnalysis.confidence,
      ambiguities: [...patternAmbiguities, ...semanticAnalysis.ambiguities],
      assumptions: semanticAnalysis.assumptions,
      clarificationNeeded: patternAmbiguities.length > 0 || semanticAnalysis.ambiguities.length > 0,
    };

    // Step 4: Generate clarification if needed
    if (analysis.clarificationNeeded) {
      analysis.suggestedClarification = this.generateClarification(analysis);
    }

    // Step 5: Emit clarification event if needed and port is available
    if (analysis.clarificationNeeded && this.port) {
      try {
        this.port.postMessage({
          type: 'task_clarification_needed',
          message: analysis.suggestedClarification || 'I need more information to complete this task accurately.',
        });
        logger.info('Task clarification needed event emitted');
      } catch (error) {
        logger.error('Failed to emit task clarification needed event:', error);
      }
    }

    logger.info(`Intent analysis complete. Clarification needed: ${analysis.clarificationNeeded}`);
    return analysis;
  }

  /**
   * Detect ambiguities using predefined patterns
   */
  private detectPatternAmbiguities(task: string): string[] {
    const ambiguities: string[] = [];

    for (const pattern of this.ambiguityPatterns) {
      const matches = task.match(pattern.pattern);
      if (matches) {
        ambiguities.push(`Pattern detected: ${pattern.type} - ${pattern.clarification}`);
      }
    }

    return ambiguities;
  }

  /**
   * Perform LLM-based semantic analysis
   */
  private async performSemanticAnalysis(task: string): Promise<{
    primaryIntent: string;
    confidence: number;
    ambiguities: string[];
    assumptions: string[];
  }> {
    const systemPrompt = `You are an intent analysis expert. Your task is to analyze user instructions for web automation and identify:

1. The primary intent (what the user wants to accomplish)
2. Confidence level (0-1) in understanding the intent
3. Any ambiguities that could lead to wrong actions
4. Assumptions you're making about the context

Common ambiguities to look for:
- Vague references to elements ("the button", "that link")
- Missing context ("search for it", "fill the form")
- Multiple possible interpretations
- Unclear targets or destinations

Respond in JSON format:
{
  "primaryIntent": "brief description of main goal",
  "confidence": 0.8,
  "ambiguities": ["list of identified ambiguities"],
  "assumptions": ["list of assumptions being made"]
}`;

    const messages: BaseMessage[] = [
      new SystemMessage(systemPrompt),
      new HumanMessage(`Analyze this task: "${task}"`),
    ];

    try {
      const response = await this.llm.invoke(messages);
      const content = response.content as string;
      
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      logger.warning('LLM semantic analysis failed, using fallback', error);
    }

    // Fallback analysis
    return {
      primaryIntent: this.extractPrimaryIntent(task),
      confidence: 0.6,
      ambiguities: [],
      assumptions: ['Task appears to be straightforward'],
    };
  }

  /**
   * Extract primary intent using simple heuristics
   */
  private extractPrimaryIntent(task: string): string {
    const actionWords = ['click', 'type', 'fill', 'search', 'navigate', 'select', 'scroll', 'wait'];
    const targetWords = ['button', 'link', 'input', 'form', 'page', 'menu', 'element'];
    
    const words = task.toLowerCase().split(' ');
    const action = words.find(w => actionWords.includes(w)) || 'interact';
    const target = words.find(w => targetWords.includes(w)) || 'element';
    
    return `${action} with ${target}`;
  }

  /**
   * Generate clarification message
   */
  private generateClarification(analysis: IntentAnalysis): string {
    if (analysis.ambiguities.length === 0) {
      return '';
    }

    let clarification = t('exec_intent_clarification_needed') + '\n\n';
    
    // Group ambiguities by type
    const specificityIssues = analysis.ambiguities.filter(a => a.includes('missing_specificity') || a.includes('vague_reference'));
    const contextIssues = analysis.ambiguities.filter(a => a.includes('context_required') || a.includes('multiple_meanings'));
    
    if (specificityIssues.length > 0) {
      clarification += '• ' + t('exec_intent_be_more_specific') + '\n';
    }
    
    if (contextIssues.length > 0) {
      clarification += '• ' + t('exec_intent_provide_context') + '\n';
    }

    clarification += '\n' + t('exec_intent_example_clarification');
    
    return clarification;
  }

  /**
   * Clarify task based on user input
   */
  async clarifyTask(originalTask: string, userClarification: string): Promise<string> {
    logger.info(`Clarifying task with user input: "${userClarification}"`);
    
    const clarificationPrompt = `Original task: "${originalTask}"
User clarification: "${userClarification}"

Combine these into a single, clear, and specific task instruction. Remove ambiguities and add the clarified details.

Example:
Original: "click the button"
Clarification: "the blue Submit button at the bottom of the form"
Result: "click the blue Submit button at the bottom of the form"

Respond with only the clarified task, no additional text.`;

    const messages: BaseMessage[] = [
      new HumanMessage(clarificationPrompt),
    ];

    try {
      const response = await this.llm.invoke(messages);
      const clarifiedTask = response.content as string;
      
      // Clean up response
      return clarifiedTask.replace(/^["']|["']$/g, '').trim();
    } catch (error) {
      logger.warning('Task clarification failed, using simple combination', error);
      
      // Fallback: simple combination
      return `${originalTask}. ${userClarification}`;
    }
  }

  /**
   * Check if task is clear enough to proceed
   */
  isTaskClear(analysis: IntentAnalysis): boolean {
    return !analysis.clarificationNeeded || analysis.confidence > 0.8;
  }
}
