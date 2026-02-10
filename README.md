# Prompt Quest

An AI-powered game teaching kids (ages 8-10) prompt engineering through play. Built with Claude Opus 4.6 for the Claude Code Hackathon (Feb 10-16, 2026).

**Solo developer:** Drew

## How It Works

Kids solve outrageous puzzles by describing solutions in natural language. Claude interprets their input and brings it to life through Phaser animations. Better prompts = better results. Kids learn specificity, completeness, and clarity — through play, not lectures.

```
Kid types: "throw a giant birthday cake with balloons and music"
    → Claude Opus 4.6 evaluates the prompt
    → Phaser animates: cake flies across screen, monster catches it, balloons appear, confetti!
    → Feedback: "Great job! You described WHAT, HOW BIG, and added decorations!"
```

## Tasks

- **Monster Birthday Party** — Plan a birthday party for a monster who's never had one
- **Robot Pizza Delivery** — Program a robot to deliver pizza through an obstacle-filled city

## Features

- **Voice input** — speak prompts via Web Speech API (Chrome)
- **Three-tier response system** — Cache (instant) → Live API → Fallback (never errors)
- **40 pre-cached responses** — instant, reliable demo without API dependency
- **Fuzzy keyword matching** — similar prompts still hit the cache (60% overlap threshold)
- **Kid-friendly feedback** — concrete game advice, not abstract prompting tips
- **8 animation types** — spawn, move, animate, react, emote, wait, remove, sfx
- **7 move styles** — linear, arc, bounce, float, shake, spin-in, drop-in
- **Post-script celebrations** — confetti rain on success, screen shake on funny fails

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 18, TypeScript, Tailwind CSS, Zustand |
| Game Engine | Phaser 3 (embedded in React via EventBus) |
| AI | Claude Opus 4.6 (scene script generation) |
| Voice | Web Speech API (Chrome, graceful fallback) |
| Build | Vite 5 |
| Test | Vitest + Testing Library (165 tests) |
| Deploy | Vercel-ready (vercel.json configured) |

## Architecture

```
React UI (Zustand) → Three-Tier Resolver → Phaser SceneScriptPlayer
                     ├── Tier 1: Cache (instant, fuzzy keyword matching)
                     ├── Tier 2: Live API (Opus 4.6, 6s timeout)
                     └── Tier 3: Fallback (safe default, demo never errors)
```

**Key design decisions:**
- **Vocabulary Contract** — Claude can ONLY reference pre-built assets (9 actors, 29 props, 6 backdrops, 10 effects). This prevents hallucinating assets that don't exist.
- **Scene Scripts** — Claude returns structured JSON (not free text), which Phaser executes as tween-based animations.
- **Golden Response Cache** — 40 pre-computed Opus responses for zero-latency demo. Fuzzy keyword matching means variations of cached prompts also hit instantly.
- **Placeholder system** — Missing textures render as colored rectangles with labels, so the game never crashes on missing assets.

## Quick Start

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5174
```

For live Claude API calls, create a `.env` file:
```bash
cp .env.example .env
# Edit .env and add your VITE_ANTHROPIC_API_KEY
```

Without an API key, cached responses and fallbacks still work — the game is fully playable.

## Commands

```bash
cd frontend
npm run dev          # Start dev server (port 5174)
npm run build        # Production build (tsc + vite)
npm run test         # Run 165 tests
npm run test:watch   # Watch mode
npm run preview      # Preview production build
```

## Project Structure

```
frontend/src/
├── game/                         # Phaser game engine
│   ├── SceneScriptPlayer.ts      # Core animation engine (8 action types)
│   ├── scenes/                   # Game scenes
│   │   ├── MonsterPartyScene.ts  # Monster Birthday Party
│   │   └── RobotPizzaScene.ts    # Robot Pizza Delivery
│   ├── PhaserGame.tsx            # React wrapper (forwardRef)
│   └── EventBus.ts               # Scene ↔ React bridge
├── services/                     # API + caching layer
│   ├── claude.ts                 # Claude API client (Opus 4.6, 6s timeout)
│   ├── cache.ts                  # Fuzzy keyword match cache
│   └── resolver.ts               # Three-tier resolver
├── prompts/                      # System prompts per task
│   ├── monster-party.ts          # Monster Birthday Party prompt
│   └── robot-pizza.ts            # Robot Pizza Delivery prompt
├── data/                         # Pre-generated data
│   ├── demo-cache.json           # 40 cached responses
│   └── fallback-scripts.ts       # Safe fallback for each task
├── stores/
│   └── gameStore.ts              # Zustand state + submit flow
├── components/
│   ├── PromptInput.tsx           # Input + feedback panel
│   ├── VoiceButton.tsx           # Web Speech API voice input
│   └── ErrorBoundary.tsx         # Catch React errors
├── types/
│   └── scene-script.ts           # Vocabulary contract types
└── App.tsx                       # Task selector + layout
```

## Scene Script Format

Claude returns structured JSON that Phaser executes:

```json
{
  "success_level": "FULL_SUCCESS",
  "narration": "The monster loved the giant flying cake!",
  "actions": [
    { "type": "spawn", "target": "cake-giant", "position": "left" },
    { "type": "move", "target": "cake-giant", "to": "center", "style": "arc" },
    { "type": "animate", "target": "monster", "anim": "eat" },
    { "type": "react", "effect": "confetti-burst", "position": "center" }
  ],
  "prompt_feedback": "Great job being specific about the cake size and adding action!",
  "missing_elements": []
}
```

## Testing

165 tests across 8 files covering:
- Scene script type validation (32 tests)
- JSON parsing + code fence stripping (11 tests)
- Cache fuzzy matching + normalization (37 tests)
- Three-tier resolver logic (10 tests)
- Fallback vocabulary contract compliance (23 tests)
- UI component rendering + interactions (9 tests)
- Edge-case stress tests (34 tests)
- Store state management (9 tests)

## License

MIT

## Credits

- AI: [Claude Opus 4.6](https://anthropic.com) by Anthropic
- Game Engine: [Phaser 3](https://phaser.io)
- Build Tool: [Claude Code](https://claude.ai/code) by Anthropic
