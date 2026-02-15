# Context Guardian — Setup Guide

## What It Does

When you're working with Claude Code on a long session, the conversation fills up a "context window" — Claude's working memory. When it gets too full, Claude auto-compacts (summarizes and forgets details), which can happen mid-task and cause lost work.

The **Context Guardian** watches your context usage and steps in *before* you start new work when context is getting low. It:

1. Saves your current work state (git changes, active plans) to a file
2. Tells Claude to write down what it's working on
3. Suggests you run `/compact` to free up space
4. After compacting, Claude picks back up with the saved context

**Think of it like a "save game" that triggers automatically before you run out of memory.**

---

## How to Install

### Step 1: Create the hook script

Create the folder and file:

```bash
mkdir -p ~/.claude/hooks
```

Then create `~/.claude/hooks/context_guardian.sh` with this content:

```bash
#!/bin/bash
# context_guardian.sh — Global UserPromptSubmit hook
# Checks context usage BEFORE new work starts. If context is low,
# saves state and suggests /compact.

INPUT=$(cat)

TRANSCRIPT=$(echo "$INPUT" | jq -r '.transcript_path // empty' 2>/dev/null)
CWD=$(echo "$INPUT" | jq -r '.cwd // empty' 2>/dev/null)
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$CWD}"

if [ -z "$TRANSCRIPT" ] || [ ! -f "$TRANSCRIPT" ]; then
    echo '{}'
    exit 0
fi

# Don't fire more than once per session
GUARD_FLAG="$PROJECT_DIR/.claude/.context-guard-fired"
if [ -f "$GUARD_FLAG" ]; then
    echo '{}'
    exit 0
fi

# Check transcript size as a proxy for context usage
# 900KB ≈ ~65% context used (~35% remaining)
# Adjust THRESHOLD_BYTES up to trigger later, down to trigger earlier
THRESHOLD_BYTES=921600  # 900KB

FILE_SIZE=$(wc -c < "$TRANSCRIPT" 2>/dev/null | tr -d ' ')
if ! [[ "$FILE_SIZE" =~ ^[0-9]+$ ]]; then
    echo '{}'
    exit 0
fi

if [ "$FILE_SIZE" -lt "$THRESHOLD_BYTES" ]; then
    echo '{}'
    exit 0
fi

# === Save state ===
SAVE_DIR="$PROJECT_DIR/.claude/context-saves"
mkdir -p "$SAVE_DIR"
SAVE_FILE="$SAVE_DIR/guardian-$(date +%Y%m%d-%H%M%S).md"
SIZE_KB=$((FILE_SIZE / 1024))

{
    echo "# Context Guardian Auto-Save"
    echo "Triggered: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "Transcript size: ${SIZE_KB}KB"
    echo ""

    if [ -d "$CWD/.git" ]; then
        echo "## Git State"
        echo '```'
        cd "$CWD"
        git branch --show-current 2>/dev/null
        git log --oneline -5 2>/dev/null
        echo ""
        git status --short 2>/dev/null
        echo '```'
        echo ""

        DIFF_STAT=$(git diff --stat 2>/dev/null)
        if [ -n "$DIFF_STAT" ]; then
            echo "## Uncommitted Changes"
            echo '```'
            echo "$DIFF_STAT"
            echo '```'
            echo ""
        fi
    fi

    MEMORY_DIR="$PROJECT_DIR/.claude/memory"
    if [ -d "$MEMORY_DIR/plans" ]; then
        IN_PROGRESS=$(grep -rl "Status:.*in-progress" "$MEMORY_DIR/plans/" 2>/dev/null | head -1)
        if [ -n "$IN_PROGRESS" ]; then
            echo "## Active Plan: $(basename "$IN_PROGRESS")"
            grep -n "\[.\]" "$IN_PROGRESS" 2>/dev/null | tail -10
            echo ""
        fi
    fi

    echo "## Recovery"
    echo "After /compact: check TaskList, read this file for pre-compact state."
} > "$SAVE_FILE"

mkdir -p "$(dirname "$GUARD_FLAG")"
touch "$GUARD_FLAG"

cat <<ENDJSON
{
  "decision": "block",
  "reason": "<user-prompt-submit-hook>CONTEXT GUARDIAN: Transcript is ${SIZE_KB}KB — context is getting full (~35% remaining). Mechanical state saved to ${SAVE_FILE}.\n\nBefore processing the user's new request:\n1. Write a brief work-in-progress summary to ${SAVE_DIR}/work-in-progress.md covering: what you were working on, key decisions made, and exact next steps\n2. Tell the user: Context is getting full. Work state has been auto-saved. Recommend running /compact to free up space before starting new work. Context will be restored automatically after compaction.</user-prompt-submit-hook>"
}
ENDJSON

exit 0
```

Make it executable:

```bash
chmod +x ~/.claude/hooks/context_guardian.sh
```

### Step 2: Add the hook to your settings

Open `~/.claude/settings.json` and add a `hooks` section. If you already have settings, merge it in — just add the `"hooks"` key alongside your existing keys:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/context_guardian.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

If your `settings.json` already has other stuff (permissions, model, statusLine, etc.), just add the `"hooks"` block as a sibling. For example:

```json
{
  "permissions": { ... },
  "model": "opus",
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/context_guardian.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

### Step 3: Verify it's working

Start a new Claude Code session. Every time you send a message, you should see:

```
UserPromptSubmit hook success: Success
```

That means the guardian checked and context is fine. When it eventually triggers, Claude will tell you to `/compact`.

---

## What Happens When It Triggers

You'll see something like:

> **Context is getting full (950KB).** Work state has been auto-saved to `.claude/context-saves/guardian-20260214-091500.md`. I recommend running `/compact` to free up space before starting new work.

**What to do:**
1. Type `/compact` — Claude summarizes the conversation and frees up context
2. Continue working — Claude will have the key context restored

**Where state is saved:**
- `.claude/context-saves/guardian-*.md` — git state, active plans (auto-saved by the hook)
- `.claude/context-saves/work-in-progress.md` — what Claude was working on (written by Claude before you compact)

---

## Customizing the Threshold

The trigger point is controlled by `THRESHOLD_BYTES` in the script:

| Value | Approx. remaining context | When to use |
|-------|--------------------------|-------------|
| `614400` (600KB) | ~50% remaining | Trigger early, more safety margin |
| `921600` (900KB) | ~35% remaining | **Default** — good balance |
| `1258291` (1.2MB) | ~20% remaining | Trigger late, maximize context use |

Edit the line in `~/.claude/hooks/context_guardian.sh`:

```bash
THRESHOLD_BYTES=921600  # Change this number
```

---

## Optional: Add Post-Compact Restore

If you want Claude to automatically re-read the saved state after compacting, add this to your **project's** `.claude/settings.local.json` (not global, since it reads project-specific files):

Create `.claude/hooks/post_compact_restore.sh` in your project:

```bash
#!/bin/bash
# Restore context guardian state after compaction
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"

# Reset the guard flag so it can fire again
rm -f "$PROJECT_DIR/.claude/.context-guard-fired"

# Re-inject work in progress
WIP_FILE="$PROJECT_DIR/.claude/context-saves/work-in-progress.md"
if [ -f "$WIP_FILE" ]; then
    echo "--- WORK IN PROGRESS (restored after compact) ---"
    cat "$WIP_FILE"
    echo "--- END WORK IN PROGRESS ---"
fi

# Re-inject latest guardian save
LATEST=$(find "$PROJECT_DIR/.claude/context-saves" -name "guardian-*.md" -type f 2>/dev/null | sort -r | head -1)
if [ -n "$LATEST" ] && [ -f "$LATEST" ]; then
    echo ""
    echo "--- PRE-COMPACT STATE ---"
    cat "$LATEST"
    echo "--- END PRE-COMPACT STATE ---"
fi

exit 0
```

```bash
chmod +x .claude/hooks/post_compact_restore.sh
```

Then in your project's `.claude/settings.local.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact|clear",
        "hooks": [
          {
            "type": "command",
            "command": "bash \"${CLAUDE_PROJECT_DIR}/.claude/hooks/post_compact_restore.sh\"",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
```

---

## How It Works (Technical Summary)

```
You send a message
       │
       ▼
UserPromptSubmit hook fires
       │
       ▼
context_guardian.sh checks transcript file size
       │
       ├── Under 900KB → allows through, no interruption
       │
       └── Over 900KB → saves git state + plans to file
                         blocks Claude with instructions
                         Claude writes work-in-progress summary
                         Claude tells you to /compact
                              │
                              ▼
                     You type /compact
                              │
                              ▼
                     Context freed up
                     Guard flag reset
                     (Optional: post-compact hook restores state)
                              │
                              ▼
                     Continue working with full context
```

The hook only fires once per session. After compacting, the flag resets so it can fire again if needed.

---

## Files Reference

| File | Location | Purpose |
|------|----------|---------|
| `context_guardian.sh` | `~/.claude/hooks/` | The hook script (global) |
| `settings.json` | `~/.claude/` | Wires up the hook (global) |
| `.context-guard-fired` | `.claude/` in project | Flag file (auto-managed) |
| `guardian-*.md` | `.claude/context-saves/` in project | Auto-saved state files |
| `work-in-progress.md` | `.claude/context-saves/` in project | Claude's summary of current work |

Add to your project's `.gitignore`:
```
.claude/.context-guard-fired
.claude/context-saves/
```
