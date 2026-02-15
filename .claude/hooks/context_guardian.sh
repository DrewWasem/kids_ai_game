#!/bin/bash
# context_guardian.sh — UserPromptSubmit hook
# Checks context usage BEFORE new work starts. If context is low,
# blocks and instructs Claude to save state + suggest /compact.
#
# Why UserPromptSubmit: Fires at the decision point — before Claude
# commits context to new work. Much better than checking after every
# response (Stop hook) because:
#   1. Prevents starting work that will hit compaction mid-task
#   2. Saves state BEFORE new work tangles up the context
#   3. Only fires at natural boundaries (new user input)
#
# Context estimation: Uses transcript file size as proxy.
# Claude Opus 4.6 ~200K tokens. JSONL overhead ~2-3x raw content.
# Threshold tuned so it fires well before auto-compact (~85-90% used).

INPUT=$(cat)

TRANSCRIPT=$(echo "$INPUT" | jq -r '.transcript_path // empty' 2>/dev/null)
CWD=$(echo "$INPUT" | jq -r '.cwd // empty' 2>/dev/null)
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$CWD}"

if [ -z "$TRANSCRIPT" ] || [ ! -f "$TRANSCRIPT" ]; then
    echo '{}'
    exit 0
fi

# Don't fire more than once per session (reset after compact/clear)
GUARD_FLAG="$PROJECT_DIR/.claude/.context-guard-fired"
if [ -f "$GUARD_FLAG" ]; then
    echo '{}'
    exit 0
fi

# === Context estimation via transcript file size ===
# Calibration (conservative — fires before auto-compact):
#   ~200K tokens × 4 bytes/token = ~800KB raw content
#   JSONL wrapping + tool output adds ~2-3x overhead
#   65% used ≈ 900KB-1.2MB transcript
#   Using 900KB threshold → ~35% remaining
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

# === Threshold crossed — save mechanical state ===
SAVE_DIR="$PROJECT_DIR/.claude/context-saves"
mkdir -p "$SAVE_DIR"
SAVE_FILE="$SAVE_DIR/guardian-$(date +%Y%m%d-%H%M%S).md"
SIZE_KB=$((FILE_SIZE / 1024))

{
    echo "# Context Guardian Auto-Save"
    echo "Triggered: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "Transcript size: ${SIZE_KB}KB (threshold: $((THRESHOLD_BYTES / 1024))KB)"
    echo ""

    # Git state
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

    # Active plans
    MEMORY_DIR="$PROJECT_DIR/.claude/memory"
    if [ -d "$MEMORY_DIR/plans" ]; then
        IN_PROGRESS=$(grep -rl "Status:.*in-progress" "$MEMORY_DIR/plans/" 2>/dev/null | head -1)
        if [ -n "$IN_PROGRESS" ]; then
            echo "## Active Plan: $(basename "$IN_PROGRESS")"
            # Show plan with progress markers
            grep -n "\[.\]" "$IN_PROGRESS" 2>/dev/null | tail -10
            echo ""
        fi
    fi

    echo "## Recovery"
    echo "After /compact: check TaskList, read this file, post_compact_recall.sh re-injects context."
} > "$SAVE_FILE"

# Mark as fired
touch "$GUARD_FLAG"

# Block with instructions for Claude
cat <<ENDJSON
{
  "decision": "block",
  "reason": "<user-prompt-submit-hook>CONTEXT GUARDIAN: Transcript is ${SIZE_KB}KB — context is getting full (~35% remaining). Mechanical state saved to ${SAVE_FILE}.\n\nBefore processing the user's new request:\n1. Write a brief work-in-progress summary to ${SAVE_DIR}/work-in-progress.md covering: what you were working on, key decisions made, and exact next steps\n2. Tell the user: Context is getting full. Work state has been auto-saved. Recommend running /compact to free up space before starting new work. Context will be restored automatically after compaction.</user-prompt-submit-hook>"
}
ENDJSON

exit 0
