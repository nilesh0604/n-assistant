# Command Reference Guide

## Essential Commands

### Package Management
```bash
pnpm install                    # Install all dependencies
pnpm -F <workspace> install     # Install for specific workspace
```

### Development Commands
```bash
pnpm dev                        # Start development mode
pnpm -F chrome-extension dev    # Dev mode for extension only
pnpm build                      # Build all packages
pnpm -F chrome-extension build  # Build extension only
```

### Code Quality
```bash
pnpm type-check                 # TypeScript checks for all
pnpm -F <workspace> type-check  # TS checks for specific workspace
pnpm lint                       # ESLint for all
pnpm -F <workspace> lint        # ESLint for specific workspace
pnpm prettier                   # Format all code
```

### Testing Commands
```bash
pnpm -F chrome-extension test           # Run unit tests
pnpm -F chrome-extension test -t "name" # Run specific test
pnpm e2e                               # Run end-to-end tests
pnpm zip                               # Create distribution zip
```

### Cleaning Commands
```bash
pnpm clean             # Clean all build artifacts
pnpm clean:bundle      # Clean build outputs only
pnpm clean:turbo       # Clear Turbo cache
pnpm clean:node_modules # Remove dependencies
```

## Windsurf Commands

### Planning Commands
```bash
/plan [task description]           # Plan complex task
/megaplan [architectural change]   # For major refactors
```

### Execution Commands
```bash
/execute [task]                    # Implement planned task
/test [feature]                    # Write tests for feature
/debug [issue]                     # Debug problem
```

### Context Commands
```bash
@filename                          # Pin specific file
@symbol                            # Pin specific symbol
@src/path/ Review all files        # Batch review
```

## MCP Server Commands

### GitHub Integration
```bash
@github Create PR for [feature]    # Create pull request
@github List issues                # List open issues
@github Add comment to #[number]   # Comment on issue
@github Create branch [name]       # Create new branch
```

### Database Operations
```bash
@sqlite Query last 10 settings     # Query recent data
@sqlite Insert into [table]        # Add new data
@sqlite Update [table] set         # Update records
```

### Testing Automation
```bash
@playwright Run e2e tests         # Run all E2E tests
@playwright Test [feature]         # Test specific feature
@playwright Debug [test]           # Debug failing test
```

### Web Search
```bash
@web Search [query]                # Search documentation
@web Find latest Chrome API        # Find specific info
@web Check [library] version       # Check updates
```

## Workspace-Specific Commands

### Chrome Extension
```bash
pnpm -F chrome-extension build    # Build extension
pnpm -F chrome-extension test     # Run tests
pnpm -F chrome-extension dev      # Development mode
```

### Side Panel
```bash
pnpm -F pages/side-panel build    # Build side panel
pnpm -F pages/side-panel dev      # Dev mode with HMR
```

### Options Page
```bash
pnpm -F pages/options build       # Build options
pnpm -F pages/options dev         # Dev mode
```

### Storage Package
```bash
pnpm -F packages/storage test     # Test storage utilities
pnpm -F packages/storage build    # Build storage package
```

## Quick Fix Commands

### Common Issues
```bash
# Type errors
pnpm type-check                   # Check all TS issues
pnpm -F <workspace> type-check    # Check specific workspace

# Linting issues
pnpm lint --fix                   # Auto-fix lint issues
pnpm -F <workspace> lint --fix    # Fix specific workspace

# Build issues
pnpm clean:bundle                 # Clean build artifacts
pnpm build                        # Rebuild all

# Test failures
pnpm -F chrome-extension test -u  # Update snapshots
pnpm test --reporter=verbose      # Detailed test output
```

### Performance Issues
```bash
# Check bundle size
pnpm -F chrome-extension build --analyze

# Profile tests
pnpm -F chrome-extension test --profile

# Memory leak detection
pnpm dev --inspect
```

## Development Workflow Commands

### Before Committing
```bash
pnpm type-check                   # 1. Check types
pnpm lint                         # 2. Check code style
pnpm -F chrome-extension test     # 3. Run tests
pnpm build                        # 4. Verify build
```

### Before Release
```bash
pnpm clean:bundle                 # 1. Clean builds
pnpm build                        # 2. Build all
pnpm e2e                          # 3. Run E2E tests
pnpm zip                          # 4. Create distribution
```

## Agent System Commands

### Debugging Agents
```bash
# Check agent status
@chrome-extension/src/background/agent/ Review agent files

# Test agent coordination
pnpm -F chrome-extension test -t "agent"

# Debug specific agent
/debug Navigator agent memory leak
```

### Agent Development
```bash
/plan Add new agent type
/execute Implement agent logic
/test Write agent tests
```

## Keyboard Shortcuts (VS Code)

### Essential Shortcuts
- `Cmd+Shift+P` - Command palette
- `Cmd+P` - Quick file open
- `Cmd+Shift+F` - Global search
- `Cmd+/` - Toggle comment
- `Cmd+.` - Fix quick action
- `Cmd+K Cmd+S` - Save all

### Windsurf Specific
- `Cmd+I` - Toggle inline chat
- `Cmd+L` - Focus chat input
- `Cmd+Shift+L` - Clear chat

## Environment Variables

### Development
```bash
VITE_DEV_MODE=true                # Enable dev features
VITE_LOG_LEVEL=debug              # Verbose logging
```

### Testing
```bash
VITE_TEST_MODE=true               # Enable test mode
VITE_MOCK_APIS=true               # Mock external APIs
```

### Production
```bash
VITE_API_KEY=your_key            # Set API key
VITE_ENVIRONMENT=production       # Production mode
```

## Tips & Tricks

### Faster Development
1. Use workspace-scoped commands
2. Pin relevant files with @
3. Batch similar operations
4. Use dedicated terminal

### Better Debugging
1. Start with /debug command
2. Check console logs first
3. Use Chrome DevTools
4. Isolate the issue

### Efficient Testing
1. Write focused tests
2. Mock external dependencies
3. Use descriptive test names
4. Run tests in watch mode
