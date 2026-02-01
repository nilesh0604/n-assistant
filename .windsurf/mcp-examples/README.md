# MCP Server Examples for Nanobrowser

> **Note**: These are example configurations for documentation purposes only.  
> Windsurf MCP servers are configured globally in Windsurf settings, not via project JSON files.

## Available MCP Servers

### Essential Servers for Nanobrowser Development
- **SQLite** - For local data storage and testing
- **GitHub** - For repository management and PR creation
- **Playwright** - For end-to-end testing automation
- **Web Search** - For accessing latest API documentation

### Server Usage Examples

```bash
# SQLite queries
@sqlite Query the last 10 extension settings
@sqlite Create test data for agent workflows

# GitHub operations
@github Create PR for agent improvements
@github List issues for chrome-extension
@github Get file contents from main branch

# Playwright testing
@playwright Run e2e tests for side-panel
@playwright Record test for new feature
@playwright Debug failing test

# Web search
@web Search Chrome Extension Manifest V3 updates
@web Find latest LangChain.js documentation
```

### Configuration Files
Each server should have its own configuration file in this directory:
- `sqlite.json` - SQLite database configuration
- `github.json` - GitHub repository access
- `playwright.json` - Test automation settings
- `web-search.json` - Web search parameters

### Security Notes
- Never commit API keys or credentials
- Use environment variables for sensitive configuration
- Follow principle of least privilege for server permissions
