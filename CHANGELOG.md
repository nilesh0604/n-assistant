# Changelog

All notable changes to the n-assistant (Nanobrowser) Chrome extension project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.1.13] - 2025-01-24

### Project Migration
- **Repository Migration** - Moved from `/Users/Nilesh_Shinde/iSpace/local-ai-assistant/extensions/nanobrowser` to standalone repository
- **Project Rebrand** - Updated from "nanobrowser" to "n-assistant" in package.json and configuration
- **Git History Preserved** - Full commit history maintained from original project

### Current Status (as of migration)
- ✅ **Phase 1.1 - Element Fingerprinting** - Enhanced similarity algorithms with weighted scoring (Dec 1, 2025)
- ✅ **Phase 4.4 - Intent Disambiguation** - Frontend UI complete, backend integration complete
- ✅ **Chrome Extension Foundation** - Manifest V3, background service worker, content scripts
- ✅ **Multi-Agent Architecture** - Navigator, Planner, Validator agents implemented
- ✅ **UI Components** - Side panel chat interface, settings page, options page

### Recently Completed Features
- **Element Fingerprinting Service** - Enhanced similarity calculation with 25% tag name, 35% text content, 20% role/aria, 10% interaction type, 10% structural path weights
- **Intent Disambiguation System** - Chrome messaging integration for clarification flow
- **Progressive Element Disclosure** - Task-aware filtering with i18n support
- **Pre-Action Validation** - Multi-strategy element location and hierarchical DOM
- **JSON Extraction Enhancement** - Multi-strategy fallback for reliable parsing

### ⏳ Currently In Progress
- **Phase 4.1-4.5** - Advanced accuracy improvements (partial implementation)
- **Backend Integration** - Some features require backend work

### 📋 Planned Features
Based on the 7-phase improvement roadmap from original project:

#### Phase 1: Foundation (Partial Complete)
- [ ] 1.2 Structured Output Enforcement
- [ ] 1.3 Pre-Action Validation (partial)

#### Phase 2: Core Accuracy (Not Started)
- [ ] 2.1 Multi-Strategy Locator
- [ ] 2.2 Smart Error Recovery
- [ ] 2.3 Hierarchical DOM

#### Phase 3: Quick Speed Wins (Not Started)
- [ ] 3.1 Adaptive Wait Times
- [ ] 3.2 Ollama Optimization
- [ ] 3.3 Viewport-Focused Processing

#### Phase 4: Advanced Accuracy (Partial)
- [x] 4.4 Intent Disambiguation
- [ ] 4.1 Progressive Element Disclosure
- [ ] 4.2 Action Verification Prompts
- [ ] 4.3 Semantic Classification
- [ ] 4.5 Task Decomposition Validation

#### Phase 5-7: Speed & Expert Optimizations (Not Started)
- Element Tree Caching, Action Batching, Parallel Location
- Incremental DOM Updates, Response Streaming
- WebWorker Offloading, Speculative Execution

### Technical Stack
- **Chrome Extension Manifest V3**
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for bundling
- **Turbo** for build orchestration
- **pnpm** package manager
- **Multi-agent system** with Navigator, Planner, Validator

### Known Issues
- Some Phase 4 features require backend integration
- Fixed 1-second delays between actions need optimization
- Full DOM tree rebuilding on each step needs improvement

### Migration Notes
- All functionality from original project preserved
- Build system updated to use Turbo for better caching
- Package structure maintained as monorepo with workspaces
- Development commands: `pnpm dev`, `pnpm build`, `pnpm test`

---

## Previous History

For complete history prior to 2025-01-24, refer to:
- Original project: `/Users/Nilesh_Shinde/iSpace/local-ai-assistant/CHANGELOG.md`
- Original repository: `/Users/Nilesh_Shinde/iSpace/local-ai-assistant/extensions/nanobrowser`

Key milestones from original project:
- Phase 0-3: Complete RAG system with FastAPI backend
- Chrome Extension Phase 1-2: Content capture and basic automation
- Nanobrowser Phase 1-3: Multi-agent foundation services
- 25+ improvement recommendations documented in accuracy/speed research
