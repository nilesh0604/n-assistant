import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NavigatorPrompt } from '../navigator';
import type { AgentContext, ActionResult } from '@src/background/agent/types';

// Mock dependencies
vi.mock('@src/background/log', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

vi.mock('@src/background/browser/dom/summary', () => ({
  DOMSummaryService: vi.fn().mockImplementation(() => ({
    getViewportFocusArea: vi.fn(),
    createHierarchicalDOM: vi.fn(),
    summaryToMarkdown: vi.fn(),
  })),
}));

vi.mock('@src/background/browser/dom/element-disclosure', () => ({
  ElementDisclosureService: vi.fn().mockImplementation(() => ({
    filterElements: vi.fn(),
  })),
}));

describe('NavigatorPrompt Helper Methods', () => {
  let navigatorPrompt: NavigatorPrompt;
  let mockContext: AgentContext;
  let mockBrowserState: any;

  beforeEach(() => {
    navigatorPrompt = new NavigatorPrompt();
    
    mockContext = {
      messageManager: {
        getMessages: vi.fn(),
      },
      actionResults: [],
      stepInfo: { stepNumber: 1 },
    } as any;

    mockBrowserState = {
      url: 'https://example.com',
      title: 'Example Page',
    };
  });

  describe('determineTaskPhase', () => {
    it('should detect navigation phase for navigation keywords', () => {
      const task = 'Navigate to google.com';
      const phase = (navigatorPrompt as any).determineTaskPhase(task, []);
      expect(phase).toBe('navigation');
    });

    it('should detect form_filling phase for form keywords', () => {
      const task = 'Fill the contact form with name John';
      const phase = (navigatorPrompt as any).determineTaskPhase(task, []);
      expect(phase).toBe('form_filling');
    });

    it('should detect interaction phase for click/interaction keywords', () => {
      const task = 'Click the submit button';
      const phase = (navigatorPrompt as any).determineTaskPhase(task, []);
      expect(phase).toBe('interaction');
    });

    it('should detect verification phase for verification keywords', () => {
      const task = 'Verify the submission was successful';
      const phase = (navigatorPrompt as any).determineTaskPhase(task, []);
      expect(phase).toBe('verification');
    });

    it('should default to exploration phase', () => {
      const task = 'Explore the website';
      const phase = (navigatorPrompt as any).determineTaskPhase(task, []);
      expect(phase).toBe('exploration');
    });
  });

  describe('extractTargetElements', () => {
    it('should extract button elements from task', () => {
      const task = 'Click the submit button';
      const targets = (navigatorPrompt as any).extractTargetElements(task);
      expect(targets).toContain('button');
    });

    it('should extract input elements from task', () => {
      const task = 'Fill the input field with email';
      const targets = (navigatorPrompt as any).extractTargetElements(task);
      expect(targets).toContain('input');
    });

    it('should extract link elements from task', () => {
      const task = 'Click the login link';
      const targets = (navigatorPrompt as any).extractTargetElements(task);
      expect(targets).toContain('link');
    });

    it('should return empty array for no target elements', () => {
      const task = 'Navigate to the homepage';
      const targets = (navigatorPrompt as any).extractTargetElements(task);
      expect(targets).toEqual([]);
    });
  });

  describe('createTaskContext', () => {
    it('should create task context with proper message extraction', () => {
      const mockMessages = [
        { content: 'First message', getType: () => 'ai' },
        { content: 'Fill the contact form with input fields', getType: () => 'human' },
      ];
      mockContext.messageManager.getMessages.mockReturnValue(mockMessages);

      const taskContext = (navigatorPrompt as any).createTaskContext(mockContext, mockBrowserState);

      expect(taskContext.currentTask).toBe('Fill the contact form with input fields');
      expect(taskContext.taskPhase).toBe('form_filling');
      expect(taskContext.targetElements).toContain('input');
      expect(taskContext.targetElements).toContain('form');
      expect(taskContext.currentUrl).toBe('https://example.com');
      expect(taskContext.executionStep).toBe(1);
    });

    it('should use default task when no messages available', () => {
      mockContext.messageManager.getMessages.mockReturnValue([]);

      const taskContext = (navigatorPrompt as any).createTaskContext(mockContext, mockBrowserState);

      expect(taskContext.currentTask).toBe('Navigate and interact with webpage');
      expect(taskContext.taskPhase).toBe('navigation'); // Default task contains "navigate"
    });

    it('should handle null stepInfo gracefully', () => {
      mockContext.stepInfo = null;
      mockContext.messageManager.getMessages.mockReturnValue([{ content: 'Click button', getType: () => 'human' }]);

      const taskContext = (navigatorPrompt as any).createTaskContext(mockContext, mockBrowserState);

      expect(taskContext.executionStep).toBe(0);
    });
  });
});
