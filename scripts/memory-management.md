# Memory Management Schedule

## Weekly Tasks (Every Friday)
- [ ] Review and delete outdated AI memories from the past week
- [ ] Archive completed project plans to separate file
- [ ] Clean up temporary research memories
- [ ] Update TODO.md with completed tasks

## Monthly Tasks (1st of each month)
- [ ] Refresh context files (CLAUDE.md, .windsurfrules)
- [ ] Review and update MCP server configurations
- [ ] Archive old sprint memories to Reference category
- [ ] Check for duplicate or conflicting memories

## Quarterly Tasks
- [ ] Comprehensive memory audit
- [ ] Reorganize memory categories if needed
- [ ] Update implementation examples
- [ ] Review team collaboration guidelines

## Memory Categories Guidelines

### Active Memories (Current Sprint)
- Current sprint tasks and bugs
- Active development discussions
- Recent architectural decisions
- Ongoing investigations

### Archive Memories
- Completed features and old decisions
- Past sprint retrospectives
- Resolved bugs and their solutions
- Old project plans

### Reference Memories
- Documentation and examples
- Best practices and patterns
- API references
- Troubleshooting guides

### Temporary Memories
- Research and experimental code
- Quick notes and reminders
- Draft implementations
- Test results

## Automation Scripts

### Memory Cleanup Script
```bash
# Run weekly to clean old memories
find . -name "*.memory" -mtime +7 -type f -delete
```

### Archive Script
```bash
# Archive completed plans
mv plans/completed/* archive/plans/
```

## Memory Triggers

### When to Create Memories
- Architectural decisions made
- Complex bugs resolved
- New patterns discovered
- User feedback recorded

### When to Archive
- Sprint completed
- Feature shipped
- Bug fixed and verified
- Documentation updated

### When to Delete
- Duplicate memories
- Outdated information
- Temporary notes no longer needed
- Test memories after validation

## Best Practices
1. Be specific with memory titles
2. Use consistent tagging
3. Include relevant file references
4. Keep memories concise but complete
5. Review regularly to maintain relevance
