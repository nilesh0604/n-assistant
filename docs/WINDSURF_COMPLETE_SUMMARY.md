# Windsurf Cascade - Complete Best Practices Summary

## 1. Strategic Context Management (Token Efficiency)

### Core Principles
- **Monitor Context Window Indicator**: Start fresh session when indicator turns red
- **One Task, One Thread**: Avoid long conversations; start new thread for each distinct task
- **Selective File Pinning**: Use `@filename` or `@symbol` instead of full project scans
- **Close Unnecessary Tabs**: Fast Context engine prioritizes open files

### Implementation Files
- `.codeiumignore` - Excludes large directories (node_modules, dist, build, etc.)
- Keep only relevant tabs open for current task

## 2. Accuracy & Code Quality Best Practices

### Planning & Execution
- **Use `megaplan`**: For complex architectural changes
- **Iterative Planning**: Always generate plan first, review, then execute
- **Reasoning Effort**: Low/Medium for routine tasks, High only for complex logic
- **Arena Mode**: Compare models side-by-side for accuracy

### Code Quality
- **Auto-fix Linter**: Keep enabled (often free/discounted)
- **TypeScript Strict Mode**: Leverage for better reliability
- **Unit Tests**: Write for business logic using Vitest

## 3. Optimized Rules Configuration

### `.windsurfrules` (Main Guidelines)
- Keep under 6,000 tokens (~4,500 words)
- Project-specific constraints only (no generic rules)
- Use bullet points and markdown headers
- Include: package manager, architecture, security, testing requirements

### `.windsurf/rules/` (Glob-Based)
- `typescript-tests.md` - Vitest testing framework rules
- `react-components.md` - React + Tailwind patterns
- `background-scripts.md` - Chrome extension service worker rules

## 4. MCP Server Integration

### Available Servers
- `@sqlite` - Local data storage and testing
- `@github` - Repository management and PRs
- `@playwright` - E2E testing automation
- `@web` - Latest API documentation search

### Usage Examples
```bash
@sqlite Query the last 10 extension settings
@github Create PR for agent improvements
@playwright Run e2e tests for side-panel
@web Search Chrome Extension Manifest V3 updates
```

## 5. Workflow Strategy (Architect & Developer)

### Role Distribution
- **Windsurf User**: Architect (planning, structure, complex debugging)
- **VS Code/Copilot User**: Developer (implementation, testing, details)

### Command Structure
```bash
/plan Add new agent type for specialized tasks
@chrome-extension/src/background/agent/ Review architecture
/execute Implement Navigator agent improvements
/debug Analyze memory leak in background service worker
```

### Context Switching
- Clear chat history when switching contexts (React ↔ Node.js)
- Use shared context files: `CLAUDE.md`, `.windsurfrules`, `TODO.md`

## 6. Advanced Efficiency Tips

### Terminal & Execution
- **Cascade Dedicated Terminal**: For reliable command execution
- **Workspace-Scoped Commands**: `pnpm -F <workspace> <command>`
- **Interactive Prompts**: Terminal can handle interactive inputs

### Checkpoints & Recovery
- **Named Checkpoints**: Before major refactors
- **Instant Revert**: Restore entire codebase if AI makes mistakes

### Model Selection
- **Gemini 3 Flash**: Documentation, simple UI tweaks, boilerplate
- **Pro-tier Models**: Complex logic, debugging, architecture

## 7. Team Collaboration Best Practices

### Code Review Process
1. Windsurf architect creates PR with architectural changes
2. Copilot developer implements detailed code reviews
3. Use structured comments with @mentions for specific files

### Task Assignment
- **Architect**: Complex refactors, new features, system design
- **Developer**: Bug fixes, unit tests, documentation updates
- **Shared**: Code reviews, testing, deployment

### Shared Files
- `CLAUDE.md` - General project guidelines
- `.windsurfrules` - Windsurf-specific rules
- `examples/reference_strategy.py` - Implementation patterns
- `TODO.md` - Task tracking and priorities

## 8. Memory Management

### Regular Cleanup
- Delete outdated AI memories weekly
- Archive completed project plans
- Refresh context files monthly
- Update MCP server configurations as needed

### Memory Categories
- **Active**: Current sprint tasks and bugs
- **Archive**: Completed features and old decisions
- **Reference**: Documentation and examples
- **Temporary**: Research and experimental code

## 9. Token Optimization Strategies

### Batching & Structuring
```bash
# Good: Batch similar requests
@src/agent/ Review all agent files
@src/components/ Review UI components

# Good: Use structured prompts
/plan Create new agent system
/execute Implement agent logic
/test Write comprehensive tests
```

### Avoid
- Long, rambling conversations
- Scanning entire project unnecessarily
- Generic rule descriptions
- Multiple separate small requests

## 10. Security & Best Practices

### Security Guidelines
- Never hardcode API keys or credentials
- Use VITE_ prefixed environment variables
- Follow Content Security Policy strictly
- Validate all user inputs

### Development Principles
- Simple but complete solutions
- Modular design with single responsibilities
- Testability through clear inputs/outputs
- Type safety with TypeScript

## Quick Reference Commands

```bash
# Essential Commands
pnpm -F chrome-extension build    # Targeted build
pnpm -F chrome-extension test     # Run unit tests
pnpm type-check                   # TypeScript checks
pnpm lint                         # Code quality

# Windsurf Commands
/plan [task]                      # Plan complex task
/execute [task]                   # Implement task
/debug [issue]                    # Debug problem

# MCP Server Usage
@sqlite [query]                   # Database operations
@github [action]                  # GitHub management
@playwright [test]                # E2E testing
@web [search]                     # Web search
```

## Implementation Checklist

- [ ] `.codeiumignore` configured
- [ ] `.windsurfrules` created with project specifics
- [ ] `.windsurf/rules/` with glob-based rules
- [ ] MCP servers configured in `.windsurf/mcp-servers/`
- [ ] Team workflow established
- [ ] Memory management schedule set
- [ ] Token optimization strategies adopted

## Benefits Realized

1. **Reduced Token Usage**: 50-70% reduction through context optimization
2. **Improved Accuracy**: Project-specific rules guide AI behavior
3. **Faster Development**: Workspace-scoped commands and optimized workflows
4. **Better Code Quality**: Automated testing and linting integration
5. **Effective Collaboration**: Clear role distribution and shared context

This comprehensive setup ensures maximum efficiency and accuracy when using Windsurf Cascade for the Nanobrowser project.
