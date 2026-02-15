# Claude Code Hook Architecture

**Created:** 2026-02-14
**Last Updated:** 2026-02-14
**Source:** session
**Confidence:** high
**Tags:** hooks, infrastructure, context-management, claude-code

## Summary

Patterns for Claude Code hooks: event types, configuration, and the context guardian system.

## Details

### Hook Configuration Locations
- **Global:** `~/.claude/settings.json` — applies to all projects
- **Project (shared):** `.claude/settings.json` — committed to repo
- **Project (local):** `.claude/settings.local.json` — gitignored, personal

### Hook Event Lifecycle
1. `SessionStart` (startup|resume|compact|clear) — inject context via stdout
2. `UserPromptSubmit` — gate before Claude processes input (can block)
3. `PreToolUse` / `PostToolUse` — gate tool execution
4. `PreCompact` — save state before compaction (stdout NOT seen by Claude)
5. `Stop` — after each Claude response (can block to continue)

### Context Guardian Pattern
- **Hook:** UserPromptSubmit (fires before new work, not after every response)
- **Proxy:** transcript file size (~900KB ≈ 65% context used on Opus 4.6)
- **Guard flag:** `.claude/.context-guard-fired` prevents repeated firing
- **Reset:** flag cleared on SessionStart (compact|clear|startup|resume)
- **State saved to:** `.claude/context-saves/guardian-{timestamp}.md`

### Key Gotchas
- `PreCompact` stdout is NOT seen by Claude — write to files instead
- `SessionStart` stdout IS injected into Claude's context
- `Stop` hooks must check `stop_hook_active` to prevent infinite loops
- Hook scripts must consume stdin (`INPUT=$(cat)`) even if unused
- Exit 0 = allow, Exit 2 = block, other = allow (stderr logged)
- Blocking response format: `{"decision":"block","reason":"..."}`

### Our Hook Stack (this project)
| Hook | Script | Scope |
|------|--------|-------|
| UserPromptSubmit | `context_guardian.sh` | Global |
| SessionStart:startup | `session_start_recall.sh` | Project |
| SessionStart:compact | `post_compact_recall.sh` | Project |
| PreCompact | `pre_compact_remember.sh` | Project |
| Stop | `stop_remember_nudge.sh` | Project |

## Related
- `~/.claude/hooks/context_guardian.sh`
- `.claude/hooks/` (project hooks)
- `.claude/settings.local.json` (hook config)
- `docs/context-guardian-setup-guide.md`
