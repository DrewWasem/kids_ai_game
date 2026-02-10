#!/bin/bash
# Stop hook — fires when Claude finishes responding
# Enhanced: tracks message count + elapsed time, nudges /remember
# Triggers on: every 15 messages OR every 5 minutes of elapsed time
# Reads JSON from stdin with stop_hook_active field

MEMORY_DIR="${CLAUDE_PROJECT_DIR:-.}/.claude/memory"
COUNTER_FILE="$MEMORY_DIR/.message-counter"
SESSION_START_FILE="$MEMORY_DIR/.session-start"
LAST_REMEMBER_FILE="$MEMORY_DIR/.last-remember-time"

# Read stdin (required for Stop hooks — JSON with stop_hook_active, etc.)
INPUT=$(cat)

# Check if a stop hook already triggered continuation (prevent infinite loop)
STOP_ACTIVE=$(echo "$INPUT" | grep -o '"stop_hook_active"[[:space:]]*:[[:space:]]*true' 2>/dev/null)
if [ -n "$STOP_ACTIVE" ]; then
    echo '{}'
    exit 0
fi

# Ensure memory dir exists
mkdir -p "$MEMORY_DIR"

NOW=$(date +%s)

# Track session start time
if [ ! -f "$SESSION_START_FILE" ]; then
    echo "$NOW" > "$SESSION_START_FILE"
fi

# Track last /remember nudge time
if [ ! -f "$LAST_REMEMBER_FILE" ]; then
    echo "$NOW" > "$LAST_REMEMBER_FILE"
fi

# Increment message counter
if [ -f "$COUNTER_FILE" ]; then
    COUNT=$(cat "$COUNTER_FILE" 2>/dev/null || echo "0")
    if ! [[ "$COUNT" =~ ^[0-9]+$ ]]; then
        COUNT=0
    fi
    COUNT=$((COUNT + 1))
else
    COUNT=1
fi
echo "$COUNT" > "$COUNTER_FILE"

# Check time since last /remember nudge
LAST_REMEMBER=$(cat "$LAST_REMEMBER_FILE" 2>/dev/null || echo "$NOW")
if ! [[ "$LAST_REMEMBER" =~ ^[0-9]+$ ]]; then
    LAST_REMEMBER=$NOW
fi
ELAPSED_SINCE_REMEMBER=$(( NOW - LAST_REMEMBER ))

# Trigger conditions:
# 1. Every 30 messages
# 2. Every 20 minutes (1200 seconds) of elapsed time since last nudge (min 8 messages)
SHOULD_NUDGE=false
NUDGE_REASON=""

if [ $((COUNT % 30)) -eq 0 ] && [ "$COUNT" -gt 0 ]; then
    SHOULD_NUDGE=true
    NUDGE_REASON="~$COUNT messages"
elif [ "$ELAPSED_SINCE_REMEMBER" -ge 1200 ] && [ "$COUNT" -gt 8 ]; then
    # Time-based trigger: 20+ minutes elapsed AND at least 8 messages exchanged
    SHOULD_NUDGE=true
    MINUTES=$(( ELAPSED_SINCE_REMEMBER / 60 ))
    NUDGE_REASON="~${MINUTES} minutes"
fi

if [ "$SHOULD_NUDGE" = true ]; then
    # Reset the timer on nudge
    echo "$NOW" > "$LAST_REMEMBER_FILE"

    # Check for in-progress plans to add context to the nudge
    PLAN_NOTE=""
    if [ -d "$MEMORY_DIR/plans" ]; then
        IN_PROGRESS=$(grep -rl "Status:.*in-progress" "$MEMORY_DIR/plans/" 2>/dev/null | head -1)
        if [ -n "$IN_PROGRESS" ]; then
            PLAN_NAME=$(basename "$IN_PROGRESS")
            PLAN_NOTE=" You also have an active plan ($PLAN_NAME) — update its checkboxes before saving."
        fi
    fi

    echo '{"decision":"block","reason":"You have exchanged '"$NUDGE_REASON"' this session. Run /remember to capture key context before it scrolls out of the active window.'"$PLAN_NOTE"' Then continue with the task."}'
else
    echo '{}'
fi

exit 0
