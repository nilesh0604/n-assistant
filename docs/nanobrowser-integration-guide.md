# Nanobrowser Integration Guide

## Overview

This guide documents the integration of nanobrowser Chrome extension into the local AI assistant project using git subtree for version control management.

## Git Subtree Setup

### Repository Information
- **Source**: https://github.com/nanobrowser/nanobrowser.git
- **Branch**: master (main development branch)
- **Local Path**: `extensions/nanobrowser/`
- **Setup Date**: November 29, 2025

### Initial Setup Commands

```bash
# Add nanobrowser as git subtree (already executed)
git subtree add --prefix=extensions/nanobrowser https://github.com/nanobrowser/nanobrowser.git master --squash
```

### Update Commands

To pull updates from upstream nanobrowser repository:

```bash
# Pull latest changes from upstream
git subtree pull --prefix=extensions/nanobrowser https://github.com/nanobrowser/nanobrowser.git master --squash
```

To push changes to upstream (if you have push access):

```bash
# Push local changes to upstream (rarely needed)
git subtree push --prefix=extensions/nanobrowser https://github.com/nanobrowser/nanobrowser.git master
```

### 🔒 Safety Guarantee

**IMPORTANT**: Normal `git push origin main` will NEVER push to the nanobrowser repository. Only explicit `git subtree push` commands can affect the upstream repo, and you would need write permissions to nanobrowser to succeed.

## Integration Strategy

### Phase 1: LLM Layer Replacement
- **Target**: Replace `createChatModel()` function in `chrome-extension/src/background/agent/helper.ts`
- **Goal**: Route LLM calls to FastAPI backend instead of direct provider APIs
- **Preserve**: All agent logic and browser automation capabilities

### Phase 2: FastAPI Backend Integration
- **Adapter**: Create `FastAPIChatModel` class implementing LangChain.js `BaseChatModel`
- **Interface**: Maintain compatibility with existing agent system
- **Streaming**: Optional SSE streaming enhancement

### Phase 3: Testing and Validation
- **Unit Tests**: Mock FastAPI responses
- **Integration Tests**: Real backend connectivity
- **E2E Tests**: Complete automation workflows

## Key Integration Points

### 1. LLM Provider Factory
**File**: `extensions/nanobrowser/chrome-extension/src/background/agent/helper.ts`
**Function**: `createChatModel(providerConfig, modelConfig)`

**Current Implementation**:
```typescript
export function createChatModel(
  providerConfig: ProviderConfig, 
  modelConfig: ModelConfig
): BaseChatModel {
  switch (modelConfig.provider) {
    case ProviderTypeEnum.Ollama:
      return new ChatOllama({...});
    case ProviderTypeEnum.OpenAI:
      return new ChatOpenAI({...});
    // ... other providers
  }
}
```

**Integration Target**:
```typescript
export function createChatModel(
  providerConfig: ProviderConfig, 
  modelConfig: ModelConfig
): BaseChatModel {
  if (modelConfig.provider === ProviderTypeEnum.FastAPI) {
    return new FastAPIChatModel(providerConfig.baseUrl, modelConfig);
  }
  // ... existing provider logic
}
```

### 2. Base Agent Interface
**File**: `extensions/nanobrowser/chrome-extension/src/background/agent/agents/base.ts`

**Key Requirements**:
- Implement `BaseChatModel` interface
- Support structured output with `{parsed, raw}` format
- Handle `AbortSignal` for cancellation
- Compatible error types

### 3. Message Management
**File**: `extensions/nanobrowser/chrome-extension/src/background/agent/messages/utils.ts`

**Message Types**:
- `BaseMessage` (LangChain.js)
- `HumanMessage`, `AIMessage`, `SystemMessage`
- Custom message formatting for FastAPI

## FastAPI Adapter Implementation

### Required Interface

```typescript
class FastAPIChatModel implements BaseChatModel {
  constructor(
    private baseUrl: string,
    private config: FastAPIConfig
  ) {}
  
  async invoke(
    messages: BaseMessage[], 
    options?: any
  ): Promise<AIMessage> {
    const response = await fetch(`${this.baseUrl}/api/agent/invoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, ...options }),
    });
    
    return this.parseResponse(response);
  }
  
  withStructuredOutput(
    schema: z.ZodSchema, 
    options?: any
  ): StructuredFastAPILLM {
    return new StructuredFastAPILLM(this, schema, options);
  }
}
```

### Structured Output Handler

```typescript
class StructuredFastAPILLM {
  async invoke(
    messages: BaseMessage[], 
    options?: any
  ): Promise<{parsed: any, raw: AIMessage}> {
    const response = await this.chatModel.invoke(messages, {
      ...options,
      schema: this.convertZodToJsonSchema(this.schema),
    });
    
    return {
      parsed: this.schema.parse(response.parsed),
      raw: response,
    };
  }
}
```

## Development Workflow

### Local Development

1. **Navigate to nanobrowser directory**:
   ```bash
   cd extensions/nanobrowser
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Development mode**:
   ```bash
   pnpm dev
   ```

4. **Build extension**:
   ```bash
   pnpm build
   ```

5. **Load in Chrome**:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `extensions/nanobrowser/dist/`

### Making Changes

1. **Create integration branch**:
   ```bash
   git checkout -b feature/fastapi-integration
   ```

2. **Make modifications**:
   - Edit files in `extensions/nanobrowser/`
   - Test changes locally
   - Commit changes

3. **Handle upstream updates**:
   ```bash
   # Pull latest upstream changes
   git subtree pull --prefix=extensions/nanobrowser https://github.com/nanobrowser/nanobrowser.git master --squash
   
   # Resolve conflicts if any
   # Test integration works
   # Commit resolved merge
   ```

## Testing Strategy

### Unit Tests
```bash
# Run nanobrowser unit tests
cd extensions/nanobrowser
pnpm -F chrome-extension test
```

### Integration Tests
```bash
# Test FastAPI adapter
cd extensions/nanobrowser/chrome-extension
pnpm test -- --testNamePattern="FastAPI"
```

### E2E Tests
```bash
# Full automation workflow tests
cd extensions/nanobrowser
pnpm e2e
```

## Troubleshooting

### Common Issues

1. **Git Subtree Conflicts**:
   ```bash
   # Resolve conflicts manually
   git status
   # Edit conflicted files
   git add .
   git commit -m "Resolve subtree merge conflicts"
   ```

2. **Build Failures**:
   ```bash
   # Clean build artifacts
   cd extensions/nanobrowser
   pnpm clean
   pnpm install
   pnpm build
   ```

3. **Extension Loading Issues**:
   - Check manifest permissions
   - Verify build output in `dist/`
   - Check Chrome developer console for errors

### Debug Commands

```bash
# Check git subtree status
git log --oneline -n 5 extensions/nanobrowser

# Verify remote tracking
git remote -v

# Check for uncommitted changes
git status extensions/nanobrowser
```

## Version Management

### Tracking Upstream Changes

1. **Check for updates**:
   ```bash
   git fetch https://github.com/nanobrowser/nanobrowser.git master
   git log HEAD..FETCH_HEAD --oneline extensions/nanobrowser
   ```

2. **Update to latest**:
   ```bash
   git subtree pull --prefix=extensions/nanobrowser https://github.com/nanobrowser/nanobrowser.git master --squash
   ```

3. **Version pinning** (if needed):
   ```bash
   # Pin to specific tag
   git subtree add --prefix=extensions/nanobrowser https://github.com/nanobrowser/nanobrowser.git v0.1.13 --squash
   ```

## Security Considerations

### API Keys and Configuration
- Never commit API keys to repository
- Use environment variables for sensitive configuration
- Validate all user inputs in FastAPI backend
- Implement proper error handling to prevent information leakage

### Extension Permissions
- Review manifest permissions regularly
- Implement content security policy (CSP)
- Validate URLs before navigation
- Sanitize DOM content before injection

## Performance Optimization

### Bundle Size Optimization
- Use tree shaking for unused dependencies
- Implement code splitting for large components
- Optimize images and assets
- Enable compression for distribution

### Runtime Performance
- Implement efficient caching strategies
- Optimize DOM manipulation
- Use web workers for heavy computations
- Monitor memory usage in extension

## Documentation References

- [Nanobrowser Technical Analysis](../nanobrowser-technical-analysis.md)
- [Nanobrowser Low-Level Implementation](../nanobrowser-low-level-analysis.md)
- [Chrome Extension Complete Spec](../chrome-extension-complete-spec.md)
- [Browser Integration & Automation Design](../Feature%20-%20Browser%20Integration%20%26%20Automation%20Design.md)

## Support and Contributing

### Getting Help
- Check nanobrowser documentation: `extensions/nanobrowser/README.md`
- Review Chrome extension developer guides
- Consult FastAPI documentation for backend integration

### Contributing Changes
1. Create feature branch from main
2. Implement changes with proper testing
3. Update documentation
4. Submit pull request with detailed description

---

**Last Updated**: November 29, 2025
**Integration Version**: nanobrowser@master (322384f8b4d48d8614343e51efca68c85e64f90b)
**Maintainer**: Local AI Assistant Team
