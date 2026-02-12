"""
Nanobrowser Project - Implementation Reference Patterns

This file contains reference patterns and examples for common tasks
in the Nanobrowser Chrome extension project.
"""

# ============================================================================
# AGENT SYSTEM PATTERNS
# ============================================================================

class AgentPattern:
    """
    Reference implementation for agent communication patterns
    """
    
    def __init__(self, agent_type: str):
        self.agent_type = agent_type
        self.message_handlers = {
            'NAVIGATOR': self.handle_navigator_task,
            'PLANNER': self.handle_planner_task,
            'VALIDATOR': self.handle_validator_task
        }
    
    async def coordinate_agents(self, task: dict):
        """
        Example: Coordinate multiple agents for a complex task
        """
        # 1. Planner breaks down task
        plan = await self.send_to_planner(task)
        
        # 2. Navigator executes steps
        results = []
        for step in plan.steps:
            result = await self.send_to_navigator(step)
            results.append(result)
        
        # 3. Validator confirms completion
        validation = await self.send_to_validator(results)
        
        return validation

# ============================================================================
# MESSAGING PATTERNS
# ============================================================================

# Chrome Extension Message Passing Pattern
MESSAGE_PATTERNS = {
    "agent_action": {
        "type": "AGENT_ACTION",
        "payload": {
            "agent": "navigator|planner|validator",
            "action": "click|type|navigate|validate",
            "params": {}
        }
    },
    "agent_response": {
        "type": "AGENT_RESPONSE",
        "payload": {
            "status": "success|error|pending",
            "data": {},
            "error": None
        }
    }
}

# ============================================================================
# ERROR HANDLING PATTERNS
# ============================================================================

class ErrorHandler:
    """
    Centralized error handling for agent operations
    """
    
    ERROR_TYPES = {
        "ELEMENT_NOT_FOUND": "act_errors_elementNotExist",
        "NAVIGATION_FAILED": "act_errors_navigationFailed",
        "VALIDATION_FAILED": "exec_errors_validationFailed",
        "TIMEOUT": "bg_errors_timeout"
    }
    
    def handle_error(self, error_type: str, context: dict):
        """
        Example: Handle errors with proper logging and user feedback
        """
        error_key = self.ERROR_TYPES.get(error_type, "errors_unknown")
        
        # Log error for debugging
        self.log_error(error_type, context)
        
        # Return user-friendly message
        return {
            "success": False,
            "error_key": error_key,
            "context": context
        }

# ============================================================================
# PERFORMANCE OPTIMIZATION PATTERNS
# ============================================================================

# Memoization Pattern for Expensive Operations
memoization_cache = {}

def memoize_expensive_operation(operation_id: str, data: dict):
    """
    Example: Cache DOM queries and API responses
    """
    cache_key = f"{operation_id}:{hash(str(data))}"
    
    if cache_key in memoization_cache:
        return memoization_cache[cache_key]
    
    result = perform_operation(data)
    memoization_cache[cache_key] = result
    
    return result

# ============================================================================
# TESTING PATTERNS
# ============================================================================

# Vitest Test Structure Example
TEST_PATTERN = """
import { describe, it, expect, vi } from 'vitest'
import { AgentManager } from '../AgentManager'

describe('AgentManager', () => {
  it('should coordinate agents correctly', async () => {
    // Mock Chrome APIs
    vi.mock('chrome.runtime', () => ({
      sendMessage: vi.fn(),
      onMessage: { addListener: vi.fn() }
    }))
    
    const manager = new AgentManager()
    const task = { type: 'navigate', url: 'https://example.com' }
    
    const result = await manager.executeTask(task)
    
    expect(result.success).toBe(true)
  })
})
"""

# ============================================================================
# CHROME EXTENSION PATTERNS
# ============================================================================

# Background Service Worker Pattern
BACKGROUND_SCRIPT_PATTERN = """
// Service worker entry point
chrome.runtime.onInstalled.addListener(() => {
  // Initialize extension
  initializeAgents()
})

// Handle messages from content scripts and UI
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'EXECUTE_TASK':
      handleTaskExecution(message.task)
        .then(sendResponse)
        .catch(error => sendResponse({ error: error.message }))
      return true // Keep message channel open
      
    case 'AGENT_STATUS':
      sendResponse(getAgentStatuses())
      break
  }
})
"""

# Content Script Injection Pattern
CONTENT_SCRIPT_PATTERN = """
// Inject into page for DOM access
(function() {
  // Create communication bridge
  const port = chrome.runtime.connect({ name: 'content-script' })
  
  // Listen for agent commands
  port.onMessage.addListener((message) => {
    if (message.type === 'DOM_ACTION') {
      executeDomAction(message.action)
        .then(result => port.postMessage({ type: 'ACTION_RESULT', result }))
        .catch(error => port.postMessage({ type: 'ACTION_ERROR', error }))
    }
  })
  
  // Report page changes
  observePageChanges(changes => {
    port.postMessage({ type: 'PAGE_CHANGED', changes })
  })
})()
"""

# ============================================================================
# SECURITY PATTERNS
# ============================================================================

# Input Validation Pattern
def validate_user_input(input_data: dict, required_fields: list):
    """
    Example: Validate all user inputs before processing
    """
    if not isinstance(input_data, dict):
        raise ValueError("Input must be a dictionary")
    
    for field in required_fields:
        if field not in input_data:
            raise ValueError(f"Missing required field: {field}")
        
        # Sanitize string inputs
        if isinstance(input_data[field], str):
            input_data[field] = sanitize_string(input_data[field])
    
    return True

# CSP-Compliant Dynamic Content
def create_safe_element(tag: str, attributes: dict, content: str = ""):
    """
    Example: Create DOM elements safely without violating CSP
    """
    element = document.createElement(tag)
    
    for attr, value in attributes.items():
        # Only allow safe attributes
        if attr in ['class', 'id', 'data-*', 'aria-*']:
            element.setAttribute(attr, value)
    
    # Use textContent instead of innerHTML
    if content:
        element.textContent = content
    
    return element

# ============================================================================
# INTERNATIONALIZATION PATTERNS
# ============================================================================

# I18n Message Usage
I18N_PATTERNS = {
    "simple": "t('bg_errors_noTabId')",
    "with_placeholders": "t('act_click_ok', ['5', 'Submit Button'])",
    "complex": "t('exec_task_fail', { error: errorMessage, retryCount: 3 })"
}

# Message Key Structure
MESSAGE_KEY_STRUCTURE = {
    "format": "component_category_specificAction_state",
    "examples": {
        "background": "bg_errors_noTabId",
        "actions": "act_click_ok",
        "executor": "exec_task_fail",
        "errors": "act_errors_elementNotExist"
    }
}

# ============================================================================
# WORKFLOW COMMAND EXAMPLES
# ============================================================================

WORKFLOW_COMMANDS = {
    # Planning
    "plan_feature": "/plan Add new agent type for specialized tasks",
    "plan_architecture": "/megaplan Refactor agent system for better scalability",
    
    # Execution
    "implement": "/execute Implement Navigator agent improvements",
    "test": "/test Write comprehensive tests for agent coordination",
    
    # Debugging
    "debug_issue": "/debug Analyze memory leak in background service worker",
    
    # MCP Usage
    "github_pr": "@github Create PR for agent improvements",
    "sqlite_query": "@sqlite Query the last 10 extension settings",
    "web_search": "@web Search Chrome Extension Manifest V3 updates",
    "playwright_test": "@playwright Run e2e tests for side-panel"
}

# ============================================================================
# QUICK REFERENCE
# ============================================================================

QUICK_COMMANDS = {
    "build": "pnpm -F chrome-extension build",
    "test": "pnpm -F chrome-extension test",
    "type_check": "pnpm type-check",
    "lint": "pnpm lint",
    "clean": "pnpm clean"
}

BEST_PRACTICES = {
    "context": "Use @filename instead of full scans",
    "tokens": "Batch similar requests together",
    "planning": "Always plan before executing complex tasks",
    "testing": "Mock all external dependencies",
    "security": "Never hardcode API keys"
}
