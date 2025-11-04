# Claude Code Context

## ⚠️ READ THIS FIRST

**REQUIRED READING**: Before starting ANY task, you MUST read [AGENTS.md](./AGENTS.md) completely. It contains:
- All code patterns and reusable snippets (check `snippets/` folder)
- Build commands and testing procedures
- CSP/CORS workarounds and troubleshooting
- Site-specific implementation notes

**OPTIONAL**: If you need an inventory of existing bookmarklets, consult [CONTENT_SUMMARY.md](./CONTENT_SUMMARY.md).

## Claude-Specific Configuration

### Custom Commands
- Available slash commands in `.claude/commands/`
- Use `/bookmarklet` for new features
- Use `/fix-csp` for browser compatibility

### Sub-Agents
- Sub-agent definitions in `.claude/agents/`
- Use test-runner agent for validation

### Patterns
- See AGENTS.md for general patterns
- Claude-specific patterns documented in `.claude/patterns/`
