# TypeScript Test Files Rules

## Testing Framework
- Use Vitest for all TypeScript tests
- Import from `vitest` not `jest` or other frameworks
- Use `describe`, `it`, `test`, `expect` from vitest

## Test Structure
- Place tests in `__tests__` directories
- Name test files with `*.test.ts` suffix
- Test files should be alongside source files when possible

## Mocking Guidelines
- Mock all network/browser APIs using `vi.mock()`
- Mock Chrome APIs with proper interfaces
- Use `vi.fn()` for function mocks

## Test Patterns
```typescript
// Preferred import
import { describe, it, expect, vi } from 'vitest'

// Mock example
vi.mock('@extension/storage', () => ({
  storage: {
    get: vi.fn(),
    set: vi.fn(),
  }
}))
```

## Coverage Requirements
- Aim for 80%+ coverage on business logic
- Test error paths and edge cases
- Mock external dependencies completely
