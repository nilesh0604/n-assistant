# Windsurf Best Practices Guide

This document outlines the Windsurf Cascade best practices implemented for the Nanobrowser project to maximize accuracy while minimizing token consumption.

## Implemented Configurations

### 1. Strategic Context Management

#### `.codeiumignore`
Created to exclude large directories from indexing:
- `node_modules/`, `dist/`, `build/` - Build outputs
- `pnpm-lock.yaml` - Large lock files
- `.git/`, `.vscode/` - Version control and IDE files
- Coverage reports, cache directories, temp files

#### Context Window Best Practices
- Start fresh threads for distinct tasks
- Use `@` mentions to focus on specific files/folders
- Close unnecessary tabs to reduce context weight

### 2. Accuracy & Code Quality

#### `.windsurfrules`
Project-specific guidelines covering:
- Package manager requirements (pnpm only)
- Architecture constraints (Manifest V3, service workers)
- Multi-agent system structure
- Security requirements
- Testing guidelines

#### Development Workflow
- `megaplan` for complex architectural changes
- Iterative planning with human review
- Medium reasoning effort for most tasks
- Arena Mode for model comparison

### 3. Glob-Based Rules

#### `.windsurf/rules/` Directory
Created specialized rule files:

- **`typescript-tests.md`** - Vitest testing framework requirements
- **`react-components.md`** - React component patterns and Tailwind styling
- **`background-scripts.md`** - Chrome extension service worker rules

### 4. Advanced Efficiency Tips

#### Dedicated Terminal
- Use Cascade Dedicated Terminal for commands
- Handles interactive prompts reliably

#### Checkpoints
- Create named checkpoints before major refactors
- Instant revert capability if AI makes mistakes

#### Model Selection
- Use Gemini 3 Flash for documentation and simple UI tasks
- Pro-tier models for complex logic and debugging

## Usage Guidelines

### For AI Assistants
1. Always check `.windsurfrules` before making changes
2. Use workspace-scoped commands: `pnpm -F <workspace> <command>`
3. Follow the agent system architecture (Navigator, Planner, Validator)
4. Respect Manifest V3 constraints

### For Developers
1. Keep conversations focused on single tasks
2. Use `@` to mention specific contexts when needed
3. Start new threads for different task types
4. Monitor context window indicator

### Token Optimization
1. Selective file pinning with `@` mentions
2. Close irrelevant tabs
3. Use appropriate model for task complexity
4. Leverage auto-fix linter integration

## File Structure

```
n-assistant/
├── .codeiumignore          # Excludes large directories
├── .windsurfrules          # Main project guidelines
└── .windsurf/
    └── rules/
        ├── typescript-tests.md    # Test file rules
        ├── react-components.md    # Component rules
        └── background-scripts.md  # Service worker rules
```

## Benefits Realized

- **Reduced Token Usage**: Excluding unnecessary files from indexing
- **Improved Accuracy**: Project-specific rules guide AI behavior
- **Better Context Management**: Focused conversations and file mentions
- **Enhanced Code Quality**: Automated linting and formatting integration
- **Faster Development**: Workspace-scoped commands and optimized model selection

## Maintenance

- Update `.windsurfrules` when architecture changes
- Add new glob-based rules for emerging patterns
- Review `.codeiumignore` when new build artifacts are created
- Keep documentation current with latest Windsurf features
