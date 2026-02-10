# CLAUDE.md

## Project

Prompt Quest: AI-powered game teaching kids (ages 8-10) prompt engineering through play.
Built with Opus 4.6 for the Claude Code Hackathon (Feb 10-16, 2026).
Solo developer: Drew.

## Tech Stack

- React + TypeScript + Vite (UI layer)
- Phaser 3 (game engine, embedded in React via EventBus)
- Zustand (state management)
- Claude API via Opus 4.6 (scene script generation)
- shadcn/ui (component library)
- Fredoka + Nunito (Google Fonts for kid-friendly typography)
- Vercel (deployment)

## Architecture

React owns UI state (Zustand). Phaser owns game state. EventBus bridges them (one-way commands).
Claude API returns scene scripts referencing ONLY assets in the vocabulary contract.
Pre-built asset library — Phaser assembles pre-loaded sprites/props, never generates at runtime.
Golden Response Cache: pre-computed Opus responses served instantly during demo.

### Three-Tier Response System
1. **Tier 1 — Cache** (instant): exact or fuzzy match from pre-generated responses
2. **Tier 2 — Live API** (1-8s): call Claude with 6s timeout, cache the result
3. **Tier 3 — Fallback** (instant): pre-written generic response, demo never errors

## Scope (Solo Dev — Locked)

### Building
- Explorer Mode only (text input + optional voice, ages 8-10)
- 1 core task: Monster Birthday Party
- 1 stretch task: Robot Pizza Delivery (only if core is flawless)
- Golden Response Cache (20-30 pre-computed responses)
- Scene Script Player (spawn, move, animate, react actions)
- Prompt feedback panel (concrete tips, not abstract)

### Cut
- Magic Mode (ages 5-7) — too much UI work solo
- Builder Mode (ages 11-13) — code editor too complex
- Trophy Room / Badge system — nice-to-have, not demo-critical
- Custom Lottie guide character — use pre-made animations
- More than 2 tasks

## Commands

```bash
npm run dev          # Start dev server on port 5174
npm run build        # Production build
npm run preview      # Preview production build
vercel --prod        # Deploy to Vercel
```

## Key Reference Docs (read on demand, not always in context)

- `ROADMAP.md` — 7-day solo build plan with daily gates
- `docs/Prompt-Quest-Backend-Architecture.html` — Claude Code primitives mapping
- `docs/Prompt-Quest-Execution-Playbook.html` — Risk mitigation, demo failsafes
- `docs/Prompt-Quest-Outrageous-Tasks-Asset-Library.html` — Tasks, asset library, vocabulary contract
- `docs/Prompt-Quest-Research-Analysis.html` — Child development, hackathon strategy

## Key Files

- `src/services/claude.ts` — Claude API client with timeout + JSON parser
- `src/services/cache.ts` — Golden Response Cache with fuzzy matching
- `src/services/resolver.ts` — Three-tier response resolver
- `src/game/SceneScriptPlayer.ts` — Executes scene scripts in Phaser
- `src/game/scenes/MonsterPartyScene.ts` — Core demo scene
- `src/prompts/monster-party.ts` — System prompt for Monster Birthday Party
- `src/data/demo-cache.json` — Pre-generated cached responses
- `src/index.css` — Game-themed CSS utilities (btn-game, input-magic, bubble-result, stars-bg)
- `tailwind.config.js` — quest-* color palette, glow shadows, playful animations

## Scene Script Format

```json
{
  "success_level": "FULL_SUCCESS | PARTIAL_SUCCESS | FUNNY_FAIL",
  "narration": "One fun sentence (under 20 words)",
  "actions": [
    { "type": "spawn", "actor": "cake-giant", "position": "left" },
    { "type": "move", "actor": "cake-giant", "to": "center", "style": "arc" },
    { "type": "animate", "actor": "monster", "anim": "eat" },
    { "type": "react", "effect": "confetti", "position": "center" }
  ],
  "feedback": "Concrete game advice for the child"
}
```

## Rules

- NEVER reference an asset not in the vocabulary contract
- Scene scripts max 6 actions
- All Claude API calls use model: `claude-opus-4-6`
- Phaser uses static images + tweens (not sprite atlas animations unless sourced)
- Test every API prompt with 10+ inputs before shipping
- Every failure mode must have a fallback — demo never shows an error screen
- Use pnpm or npm (whichever was initialized with)
- TypeScript strict mode

## Commit Convention

All commits must use a prefix: FEAT, FIX, ENH, PERF, REFACTOR, TEST, DOC, STYLE, CHORE, WIP

## Environment

- `VITE_ANTHROPIC_API_KEY` — Claude API key (set in .env, never commit)

See `.env.example` for all variables.
