# Windsurf Workflow Strategy for Nanobrowser

## The Architect & Developer Approach

### Role Distribution
- **Windsurf User**: Architect role (planning, structure, complex debugging)
- **VS Code/Copilot User**: Developer role (implementation, testing, details)

### Workflow Phases

#### 1. **Planning Phase (Windsurf)**
```
/plan
- Use @mentions to pin relevant files
- Create comprehensive architecture plans
- Break down complex tasks into manageable steps
- Search web for latest API documentation
```

#### 2. **Implementation Phase (Copilot)**
```
/execute
- Focus on specific file implementations
- Write unit tests and integration tests
- Handle code styling and formatting
- Implement business logic details
```

#### 3. **Debugging Phase (Windsurf)**
```
/debug
- Cross-file issue analysis
- Architectural problem solving
- System-wide optimization
- Performance bottleneck identification
```

### Context Switching Guidelines

#### When to Clear Chat History
- Switching from React to Node.js contexts
- Moving between different workspaces (chrome-extension vs pages)
- Changing task types (bug fix vs new feature)
- Starting new architectural decisions

#### Shared Context Files
- `CLAUDE.md` - General project guidelines
- `.windsurfrules` - Windsurf-specific rules
- `examples/reference_strategy.py` - Implementation patterns
- `TODO.md` - Task tracking and priorities

### Command Structure

#### Planning Commands
```bash
/plan Add new agent type for specialized tasks
@chrome-extension/src/background/agent/ Review current agent architecture
@web Search latest Chrome Extension API changes
```

#### Execution Commands
```bash
/execute Implement Navigator agent improvements
@src/components/ChatInput.tsx Add new validation logic
@sqlite Create test data for new agent
```

#### Debugging Commands
```bash
/debug Analyze memory leak in background service worker
@github Check recent issues related to performance
@playwright Run failing test scenario
```

### Team Collaboration Patterns

#### Code Review Process
1. Windsurf architect creates PR with architectural changes
2. Copilot developer implements detailed code reviews
3. Use structured comments with @mentions for specific files

#### Task Assignment
- Architect: Complex refactors, new features, system design
- Developer: Bug fixes, unit tests, documentation updates
- Shared: Code reviews, testing, deployment preparation

### Token Optimization Strategy

#### Batch Similar Requests
```bash
# Instead of multiple separate requests
@src/agent/ Review all agent files
@src/components/ Review UI components
@tests/ Review test coverage
```

#### Structured Prompts
```bash
# Use command structure
/plan Create new agent system
/execute Implement agent logic
/test Write comprehensive tests
/debug Fix identified issues
```

### Memory Management

#### Regular Cleanup Tasks
- Delete outdated AI memories weekly
- Archive completed project plans
- Refresh context files monthly
- Update MCP server configurations as needed

#### Memory Categories
- **Active**: Current sprint tasks and bugs
- **Archive**: Completed features and old decisions
- **Reference**: Documentation and examples
- **Temporary**: Research and experimental code
