# Session Transfer System Architecture

**Created:** 2026-02-14
**Last Updated:** 2026-02-14
**Source:** session
**Confidence:** high
**Tags:** context-management, hooks, session-transfer, automation, memory-integration

## Summary
Complete session transfer kit for context handoffs between Claude Code sessions. Uses bridge files, context monitoring, session cleanup, and three specialized agents to manage context limits and preserve knowledge across sessions.

## Details

### Core Components

**1. Context Monitor Hook** (`context_monitor.sh`)
- Reads actual context percentage from bridge file written by inline statusline
- Displays colored warnings: green (<50%), yellow (50-79%), red (≥80%)
- Replaces old context_guardian.sh which guessed at context usage

**2. Session Cleanup Hook** (`session_cleanup.sh`)
- 72-hour retention policy for session files
- Configurable PROJECTS_DIR=$HOME/claude_projects
- Prevents infinite growth of .claude/memory/sessions/

**3. Post-Compact Recall Enhancement** (`post_compact_recall.sh`)
- Reads session transfer handoffs from previous session
- Resets `.session-transfer-guard` flag for new session
- Integrates transfer context into recall flow

**4. Inline Statusline with Bridge File**
- Settings.json contains inline statusline command that writes context % to bridge file
- Bridge file: `.claude/.context-bridge` (format: "45" for 45%)
- Enables accurate context monitoring without parsing

### Three Agents

**1. Context-Session Auditor** (`context-session-auditor`)
- Runs on-demand with `/audit-context`
- Analyzes current context usage
- Recommends transfer timing
- **Memory-aware**: checks .claude/memory tree before recommending what to remember

**2. Session Transfer** (`session-transfer`)
- Triggered by `/context-transfer` or automatically at 80%+ context
- Extracts key decisions, patterns, bugs, context from session
- Writes to memory tree (delegated to memory writer agent)
- Creates handoff document for next session
- Sets `.session-transfer-guard` flag to prevent duplicates

**3. Session Transfer Auditor** (`session-transfer-auditor`)
- Post-transfer verification
- Ensures memory entries were written correctly
- Validates handoff document completeness

### Integration Points

**Hooks:**
- `session_start_recall.sh` - reads transfer handoffs, resets guard flag
- `post_compact_recall.sh` - reads transfer handoffs, resets guard flag
- `context_monitor.sh` - shows context % warnings at every prompt

**Commands:**
- `/audit-context` - run context-session auditor
- `/context-transfer` - manually trigger transfer
- Auto-transfer at 80%+ context (agent checks guard flag first)

**Bridge File:**
`.claude/.context-bridge` - written by inline statusline, read by context_monitor.sh

**Guard File:**
`.claude/.session-transfer-guard` - prevents duplicate transfers within one session

**Handoff File:**
`.claude/memory/.last-transfer-handoff` - read by next session's recall hooks

### Test Results
17/18 tests pass. One expected failure: test looks for standalone `statusline-command.sh` but we kept inline approach in settings.json (this is correct, test needs updating).

### Workflow Example

1. Session starts → hooks read last transfer handoff → reset guard flag
2. Context grows → monitor shows yellow/red warnings
3. At 80% → auditor suggests transfer
4. `/context-transfer` → extract knowledge → write memory → create handoff → set guard
5. Session ends
6. Next session → recall reads handoff → reset guard → continue work

## Related
- `.claude/hooks/context_monitor.sh`
- `.claude/hooks/session_cleanup.sh`
- `.claude/hooks/post_compact_recall.sh`
- `.claude/settings.local.json` - inline statusline
- `.claude/agents/context-session-auditor/`
- `.claude/agents/session-transfer/`
- `.claude/agents/session-transfer-auditor/`
- Session 2026-02-14 - Implementation and testing
