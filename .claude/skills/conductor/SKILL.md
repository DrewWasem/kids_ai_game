---
name: conductor
description: "Orchestration skill that routes complex tasks through Research → Plan → Implement. Check this skill BEFORE responding to any non-trivial request. Like Superpowers' using-superpowers skill, this is injected at session start to establish the workflow discipline."
---

# Conductor Skill

## The Rule

Before implementing any non-trivial change, STOP and assess whether the task needs orchestration. This is not optional — skipping orchestration on complex tasks leads to wasted context, rework, and wrong approaches.

## Assessment Checklist

**Orchestrate (Research → Plan → Implement) when ANY of these are true:**
- The task touches 3+ files
- You're unfamiliar with the relevant code area
- Multiple valid approaches exist
- The task involves architectural decisions
- The user asks for orchestration (`/conductor`)
- You're about to write more than ~50 lines of new code
- The task requires understanding data flow across components

**Just do it when ALL of these are true:**
- Single file change
- The solution is obvious and unambiguous
- The user gave specific instructions
- No architectural impact

## The Orchestrated Workflow

```
┌───────────┐     ┌─────────┐     ┌──────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│ BRAINSTORM│────▶│ RESEARCH │────▶│ PLAN │────▶│  APPROVE  │────▶│IMPLEMENT │────▶│ VALIDATE │
│/brainstorm│     │ /research│     │/create│     │  (human)  │     │/implement│     │/validate │
│ (optional)│     │          │     │ -plan │     │           │     │  -plan   │     │  -plan   │
└───────────┘     └─────────┘     └──────┘     └───────────┘     └──────────┘     └──────────┘
                       │               │                               │                │
                       ▼               ▼                               ▼                ▼
                    memory/         memory/                         memory/          memory/
                    research/       plans/                          sessions/        research/
```

### Phase 0: Brainstorm (`/brainstorm` — optional)
- Use when requirements are ambiguous or multiple approaches exist
- Ask questions one at a time (Socratic, not a questionnaire)
- Propose 2-3 approaches with trade-offs
- Get alignment before committing to research scope
- Save architectural decisions to `.claude/memory/decisions/`

### Phase 1: Research (`/research {topic}`)
- Dispatch parallel agents to understand the codebase
- Check memory for prior knowledge
- Save structured findings to `.claude/memory/research/`
- Present findings to user
- **Human reviews research before planning begins**

### Phase 2: Plan (`/create-plan`)
- Use research findings as input
- Design phased approach with 2-5 minute tasks
- Every task has exact file paths and verification steps
- Save plan to `.claude/memory/plans/`
- **Human reviews and approves plan before implementation begins**

### Phase 3: Implement (`/implement-plan {filename}`)
- Execute plan one phase at a time
- Verify each task before moving on
- Stop on mismatches — never improvise
- **Human reviews each phase before the next begins**

### Phase 4: Validate (`/validate-plan {filename}`)
- Independent verification of all success criteria
- Two-pass review: spec compliance, then code quality
- Save validation report to memory

### Phase 5: Remember (`/remember`)
- Capture decisions, patterns, and bugs from the session
- Write session summary
- Persist learnings for future sessions

## Agent Roster

| Agent | Role | When Used |
|-------|------|-----------|
| **memory-locator** | Find relevant memories | Research, Planning |
| **memory-writer** | Write entries to memory tree | Remember, Research |
| **codebase-researcher** | Find files and components | Research |
| **codebase-analyzer** | Trace code paths in depth | Research |
| **plan-architect** | Design implementation plans | Planning |
| **implementer** | Execute plan tasks precisely | Implementation |
| **reviewer** | Verify spec compliance + quality | Validation |

## Context Management

The Conductor workflow is designed for **context efficiency**:

1. **Research agents run in subagent context** — their file reads and searches don't pollute the parent window.
2. **Plans are saved to disk** — if context fills, compact and resume from the plan file.
3. **Implementation tracks progress with checkboxes** — you can always see what's done and what's next.
4. **Memory persists across sessions** — `/recall` recovers context from previous sessions.

### Intentional Compaction

If context is getting full mid-workflow:
1. Save current progress: update plan checkboxes, write session notes.
2. Let compaction happen — the post-compact hook will re-inject key context.
3. Resume from the plan file: read it, find the first unchecked task, continue.

## Anti-Rationalization

Watch for these thoughts — they are signals to STOP and follow the workflow, not skip it.

| Thought | Reality |
|---------|---------|
| "This is simple, I'll just..." | If it touches 3+ files, it's not simple. Orchestrate. |
| "I know how to do this" | In unfamiliar code, you're guessing. Research first. |
| "Let me just try something" | Trying without reading the code first = rework. |
| "I'll fix this other thing while I'm here" | That's scope creep. Finish the current task. |
| "The user wants it fast, not perfect" | Building the wrong thing is the slowest path. |
| "I'll test after I implement" | Tests written after rationalize the implementation. Test-first. |
| "Planning will slow us down" | A 5-minute plan saves a 30-minute redo. |
| "I already explored this area before" | Context decays. Check memory or re-read the code. |
| "This doesn't need a brainstorm" | If there are 2+ valid approaches, it does. Run `/brainstorm`. |
| "I can hold all this in my head" | Context windows compact. Save state to disk. |

## Announcement Protocol

When orchestrating, always announce the phase transition:
- "**Conducting: Research** — investigating {topic} using parallel agents."
- "**Conducting: Planning** — designing implementation approach."
- "**Conducting: Implementation** — executing Phase {N} of the plan."
- "**Conducting: Validation** — verifying implementation against plan."
