# Chrome Extension Background Scripts

## Service Worker Requirements
- All background scripts run as service workers (Manifest V3)
- No access to DOM or window object
- Use Chrome APIs for all browser interactions

## Agent System
- Three specialized agents: Navigator, Planner, Validator
- Agent coordination through Chrome messaging APIs
- Each agent handles specific tasks:

### Navigator Agent
- Handles DOM interactions and web navigation
- Executes clicks, form fills, and page navigation
- Reports element states and actions taken

### Planner Agent  
- High-level task planning and strategy
- Breaks down complex tasks into steps
- Coordinates agent execution order

### Validator Agent
- Validates task completion and results
- Checks if goals were achieved
- Reports success/failure states

## Message Passing
```typescript
// Use Chrome runtime messaging
chrome.runtime.sendMessage({
  type: 'AGENT_ACTION',
  agent: 'navigator',
  action: 'click',
  params: { selector: '#submit-btn' }
});

// Listen for responses
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'AGENT_RESPONSE') {
    handleAgentResponse(message);
  }
});
```

## Security Constraints
- No eval() or dynamic code execution
- Follow Content Security Policy strictly
- Validate all message parameters
