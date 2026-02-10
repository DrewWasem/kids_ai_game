---
name: planning
description: "Creates precise, phased implementation plans with verification criteria. Plans are saved to memory and serve as the source of truth during implementation."
---

# Planning Skill

## Purpose

Transform research findings into executable implementation plans. This is Phase 2 of the Conductor workflow.

## When to Use

- After completing research on a topic
- When the user asks to plan an implementation
- When `/create-plan` is invoked

## Plan Quality Criteria

A good plan enables any skilled developer — with zero domain knowledge — to implement it correctly. This means:

1. **Exact file paths** — not "the config file" but `src/config/settings.py:42`
2. **Atomic tasks** — each completable in 2-5 minutes
3. **Verification at every step** — automated commands + expected output
4. **No ambiguity** — all decisions resolved, no "TBD" items
5. **Test-first** — write test → verify fail → implement → verify pass

## Plan Structure

```
Plan
├── Goal (1-2 sentences)
├── Approach (high-level strategy)
├── Phase 1
│   ├── Task 1.1 (file, action, verify)
│   ├── Task 1.2 (file, action, verify)
│   └── Phase verification
├── Phase 2
│   └── ...
├── Success Criteria
│   ├── Automated (test/lint/build commands)
│   └── Manual (human verification steps)
└── Rollback (how to undo)
```

## Outline-First Protocol

1. Present a brief outline to the user BEFORE writing the full plan.
2. Ask for feedback on approach and decisions.
3. Resolve ALL open questions.
4. Only then write the detailed plan.

This prevents wasted effort on plans that go in the wrong direction.

## Memory Integration

- **Read:** Check `memory/decisions/` for established conventions.
- **Read:** Check `memory/patterns/` for reusable approaches.
- **Read:** Use `memory/research/` as the foundation.
- **Write:** Save the plan to `memory/plans/`.
- **Write:** Save architectural decisions to `memory/decisions/`.

## Rules

- No open questions in the final plan.
- Separate automated verification from manual verification.
- Each task must have a verification step.
- Follow existing codebase patterns (found during research).
- Plans are living documents — update checkboxes during implementation.
