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

## README Requirements

When creating a new bookmarklet, **always create an accompanying README**:

1. **Naming**: Use `{bookmarklet_name}_README.md` (e.g., `speed_reader_README.md`)
2. **Reference existing READMEs** for standard structure and format
3. **Required sections**:
   - Title and brief description
   - `## Purpose` - what it's for and use cases
   - `## Features` - bullet list of capabilities
   - `## Installation` - with Easy Mode and Hard Mode:
     - Easy Mode: `[Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet={filename}.js)`
     - Hard Mode: Link to generic installer + GitHub source file
   - `## Usage` - step-by-step instructions
   - `## How It Works` - technical explanation
   - `## Source Code` - link to GitHub: `https://github.com/oaustegard/bookmarklets/blob/main/{filename}.js`
