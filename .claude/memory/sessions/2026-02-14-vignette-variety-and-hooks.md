# Vignette Variety Campaign + Context Guardian Hooks

**Created:** 2026-02-14
**Last Updated:** 2026-02-14
**Source:** session
**Confidence:** high
**Tags:** vignettes, hooks, context-management, preloading, infrastructure

## Summary

Completed the 7-zone vignette variety campaign (replacing repetitive celebrate+confetti-burst endings). Built and deployed a global Context Guardian hook system. Added 3D world preloading behind the title screen.

## What Was Done

### 1. Vignette Variety Campaign (completed)
- All 7 zones committed with varied ending animations and effects
- Replaced `anim: 'celebrate'` with rotating: Cheering, wave, taunt, jump_big
- Replaced `effect: 'confetti-burst'` with rotating: sparkle-magic, glow-pulse, hearts-float, stars-spin
- Mid-scene uses preserved; only endings changed
- Commits: skeleton-birthday (67fdc91), mage-kitchen (e1df148), skeleton-pizza (45a5396), knight-space (49c0383), barbarian-school (5969c96), adventurers-picnic (6e7faf0), dungeon-concert (91ccf43)

### 2. Context Guardian Hook System (new)
- Created `~/.claude/hooks/context_guardian.sh` — global UserPromptSubmit hook
- Monitors transcript file size as proxy for context usage
- At ~900KB (35% remaining), saves state and suggests /compact
- Wired up ALL existing hooks that were previously orphaned (scripts existed but no config)
- Split: guardian is global (`~/.claude/settings.json`), memory hooks are project-local (`.claude/settings.local.json`)
- Added guard flag reset in session_start_recall.sh and post_compact_recall.sh
- Added guardian state injection to post_compact_recall.sh
- Created setup guide at `docs/context-guardian-setup-guide.md` for sharing

### 3. World Preloading
- Changed App.tsx: Canvas always renders, TitleScreen is a fixed overlay (z-50)
- 3D world loads behind title screen while user reads it
- TitleScreen: `min-h-screen` → `fixed inset-0 z-50`
- App.tsx: removed early return, added `invisible` class when !started

## Key Decisions

- **UserPromptSubmit > Stop hook** for context monitoring: fires at decision points (before new work) not after every response
- **Global vs project-local split**: context guardian works everywhere, memory hooks are project-specific
- **900KB threshold**: conservative estimate for ~35% remaining context on Opus 4.6
- **`invisible` not `hidden`**: keeps Canvas in DOM/GPU for asset loading while visually hidden

## Open Questions

- 900KB threshold may need tuning after real-world testing
- Consider adding a fade-out transition on TitleScreen when Play is clicked

## Files Changed

- `~/.claude/settings.json` — added global hooks config
- `~/.claude/hooks/context_guardian.sh` — new global hook
- `.claude/settings.local.json` — wired up project hooks
- `.claude/hooks/context_guardian.sh` — project copy (redundant with global)
- `.claude/hooks/post_compact_recall.sh` — added guard flag reset + guardian state injection
- `.claude/hooks/session_start_recall.sh` — added guard flag + counter reset
- `frontend/src/App.tsx` — preload world behind title screen
- `frontend/src/components/TitleScreen.tsx` — fixed overlay positioning
- `docs/context-guardian-setup-guide.md` — setup guide for sharing
- `.gitignore` — added context-saves/ and guard flag
