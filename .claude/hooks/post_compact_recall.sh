#!/bin/bash
# Post-compaction recall hook — runs on SessionStart with matcher "compact"
# Re-injects key context after context compaction (stdout → Claude context)
# Enhanced: loads structured compaction summary + skill awareness

MEMORY_DIR="${CLAUDE_PROJECT_DIR:-.}/.claude/memory"

if [ ! -d "$MEMORY_DIR" ]; then
    echo "Memory system: Tree not initialized. Context was compacted — some memories may be lost."
    exit 0
fi

TOTAL=$(find "$MEMORY_DIR" -name "*.md" ! -name "_index.md" ! -name ".*" 2>/dev/null | wc -l | tr -d ' ')

echo "Context was compacted. Re-loading key memories ($TOTAL total stored)."

# Skill awareness (re-inject after compaction)
echo ""
echo "--- AVAILABLE COMMANDS ---"
echo "Workflow: /conductor | /research | /create-plan | /implement-plan | /validate-plan"
echo "Content:  /compose-task | /review-content | /test-prompt | /build-cache"
echo "Memory:   /remember | /recall [topic] | /memory-status"
echo "SMEs:     /sme <name> \"task\" — Available: story-writer, character-director, ece-professor, prompt-writer, child-game-design, 3d-game-development, 3d-scale-tester"
echo "Rule:     For non-trivial tasks, use /conductor. Check SME routing table for domain expertise."
echo "--- END COMMANDS ---"

# SME session log (what was consulted before compaction)
SME_LOG="$MEMORY_DIR/.sme-session-log"
if [ -f "$SME_LOG" ]; then
    echo ""
    echo "--- SME STATE (pre-compaction) ---"
    cat "$SME_LOG"
    echo "--- END SME STATE ---"
fi

# SME gaps (persistent across compactions)
SME_GAPS=$(find "$MEMORY_DIR/context" -name "sme-gap-*.md" -type f 2>/dev/null)
if [ -n "$SME_GAPS" ]; then
    echo ""
    echo "--- SME GAPS IDENTIFIED ---"
    for gap in $SME_GAPS; do
        echo "$(basename "$gap" .md): $(head -3 "$gap" | tail -1)"
    done
    echo "Consider creating SMEs for these domains. Ask user before creating."
    echo "--- END SME GAPS ---"
fi

# Load structured compaction summary if it exists
COMPACTION_SUMMARY="$MEMORY_DIR/sessions/.compaction-summary.md"
if [ -f "$COMPACTION_SUMMARY" ]; then
    echo ""
    echo "--- PRE-COMPACTION STATE ---"
    cat "$COMPACTION_SUMMARY"
    echo "--- END PRE-COMPACTION STATE ---"
fi

# Re-inject preferences (always relevant)
if [ -d "$MEMORY_DIR/preferences" ]; then
    PREFS=$(find "$MEMORY_DIR/preferences" -name "*.md" ! -name "_index.md" -type f 2>/dev/null | head -3)
    if [ -n "$PREFS" ]; then
        echo ""
        echo "--- PREFERENCES ---"
        for pref in $PREFS; do
            head -20 "$pref"
            echo ""
        done
        echo "--- END PREFERENCES ---"
    fi
fi

# Re-inject recent decisions (last 2)
RECENT_DECISIONS=$(find "$MEMORY_DIR/decisions" -name "*.md" ! -name "_index.md" -type f 2>/dev/null | sort -r | head -2)
if [ -n "$RECENT_DECISIONS" ]; then
    echo ""
    echo "--- RECENT DECISIONS ---"
    for dec in $RECENT_DECISIONS; do
        head -15 "$dec"
        echo "..."
        echo ""
    done
    echo "--- END RECENT DECISIONS ---"
fi

# Re-inject latest session summary
LATEST_SESSION=$(find "$MEMORY_DIR/sessions" -name "*.md" ! -name "_index.md" -type f 2>/dev/null | sort -r | head -1)
if [ -n "$LATEST_SESSION" ] && [ -f "$LATEST_SESSION" ]; then
    echo ""
    echo "--- CURRENT SESSION CONTEXT ---"
    head -25 "$LATEST_SESSION"
    echo "--- END SESSION CONTEXT ---"
fi

# Check for in-progress plans (critical to resume after compaction)
IN_PROGRESS=$(grep -rl "Status:.*in-progress" "$MEMORY_DIR/plans/" 2>/dev/null | head -1)
if [ -n "$IN_PROGRESS" ]; then
    PLAN_NAME=$(basename "$IN_PROGRESS")
    echo ""
    echo "--- ACTIVE PLAN ---"
    echo "In-progress plan: $PLAN_NAME"
    head -30 "$IN_PROGRESS"
    echo "Resume with: /implement-plan $PLAN_NAME"
    echo "--- END ACTIVE PLAN ---"
fi

echo ""
echo "Use /recall [topic] to retrieve more specific memories."

exit 0
