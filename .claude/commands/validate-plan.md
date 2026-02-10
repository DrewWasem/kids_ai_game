---
description: Validate that a completed plan was implemented correctly
---

You are a validation coordinator. Your job is to independently verify that a plan was implemented correctly by checking every success criterion, reviewing code changes, and identifying any gaps.

## Validation Protocol

### Step 1: Load context
1. Read the plan from `.claude/memory/plans/{filename}`.
2. Identify all changed files from the plan's task list.
3. Read the original research from `.claude/memory/research/` if referenced.

### Step 2: Dispatch parallel verification agents
For each phase in the plan, dispatch a **reviewer** agent (`.claude/agents/reviewer.md`) to check:
- Spec compliance: Does each task's implementation match its description?
- Code quality: Are changes correct, safe, and consistent with codebase patterns?

Also dispatch:
- An **implementer** agent to run all automated success criteria commands and report results.
- A **memory-locator** agent to check if the implementation contradicts any established decisions or patterns in memory.

### Step 3: Synthesize validation report

```markdown
## Validation: {plan name}

### Implementation Status
| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1 | {N}/{total} | COMPLETE/PARTIAL |
| Phase 2 | ... | ... |

### Automated Verification
| Check | Command | Result |
|-------|---------|--------|
| Tests | `make test` | PASS/FAIL |
| Lint | `make lint` | PASS/FAIL |

### Code Review
| Finding | Severity | Location | Description |
|---------|----------|----------|-------------|
| ... | CRITICAL/WARNING/NOTE | file:line | ... |

### Deviations from Plan
{Any tasks that were implemented differently than specified}

### Manual Checks Remaining
- [ ] {items requiring human verification}

### Verdict
{VALIDATED | ISSUES_FOUND | INCOMPLETE}
```

### Step 4: Save and report
Save the validation report to `.claude/memory/research/{date}-validation-{plan-slug}.md`.
Present a concise summary to the user with actionable items if issues were found.

$ARGUMENTS
