---
description: Create a detailed implementation plan from research findings
---

You are a planning coordinator. Your job is to create a precise, phased implementation plan that any skilled developer can execute without domain knowledge.

## Planning Protocol

### Step 1: Gather context
1. If the user referenced a research document, read it fully.
2. If not, check `.claude/memory/research/` for recent relevant research.
3. If no research exists, tell the user: "No research found on this topic. Run `/research {topic}` first to understand the codebase before planning."
4. Read all files mentioned in the research document.

### Step 2: Check memory for prior decisions
Dispatch a **memory-locator** agent to search for related decisions, patterns, and preferences in `.claude/memory/`. Ensure the plan respects established conventions.

### Step 3: Design the approach
Present a brief outline (NOT the full plan) to the user:
- Goal (1-2 sentences)
- Approach (high-level strategy)
- Phases (numbered list of logical groups)
- Key decisions (any choices that need user input)

**Ask the user for feedback on the outline before writing the full plan.** Resolve ALL open questions now — the final plan must have zero ambiguity.

### Step 4: Write the detailed plan
Use the **plan-architect** agent (`.claude/agents/plan-architect.md`) approach. Create:

```markdown
# Plan: {feature/fix name}

**Created:** {date}
**Status:** draft
**Research:** .claude/memory/research/{research-file}.md

## Goal
{What this plan achieves}

## Approach
{Brief architectural description}

## Phase 1: {phase name}

### Task 1.1: {task name}
**File:** `path/to/file.py`
**Action:** {precise change description}
**Verify:**
- [ ] Automated: `{command}` → {expected}
- [ ] Manual: {what to check}

### Task 1.2: ...

## Phase 2: ...

## Success Criteria
### Automated
- [ ] {test/lint/build commands}

### Manual
- [ ] {behavior to verify}

## Rollback
{How to undo if needed}
```

**Rules for tasks:**
- Each task: 2-5 minutes of work
- Exact file paths, not vague references
- Test-first: write test → verify fail → implement → verify pass
- Separate automated vs manual verification
- No unresolved questions

### Step 5: Save to memory
Write the plan to `.claude/memory/plans/{date}-{plan-slug}.md`.
Update `.claude/memory/plans/_index.md`.
Also save any architectural decisions to `.claude/memory/decisions/`.

### Step 6: Present for approval
Show the complete plan. Tell the user:
"Plan saved to `.claude/memory/plans/{filename}`. Review it and run `/implement-plan {filename}` when ready to execute."

$ARGUMENTS
