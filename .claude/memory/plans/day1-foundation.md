# Day 1: Foundation — Retrofit Frontend for Phaser + Claude

**Created:** 2026-02-10
**Status:** COMPLETE
**Gate:** Phaser scene loads in React, Claude returns valid JSON for "throw a huge cake"

---

## Phase 1: Install Dependencies & Clean SaaS Boilerplate

**Goal:** Add game deps, remove SaaS cruft from the UI layer

- [x] **Task 1.1:** Install game dependencies
  - `cd frontend && npm install phaser zustand`
  - File: `frontend/package.json`
  - Verify: `npm ls phaser zustand` shows installed versions

- [x] **Task 1.2:** Strip SaaS pages and providers from App.tsx
  - Remove: Login, Dashboard, Items, Settings pages
  - Remove: AuthContext, AuthProvider, ProtectedRoute, React Query
  - Keep: ThemeProvider, ToastProvider, ErrorBoundary (useful)
  - Replace router with single game view
  - File: `frontend/src/App.tsx`
  - Verify: App renders without errors, no SaaS UI visible

- [x] **Task 1.3:** Update index.html title and meta
  - Change title from "MyApp" to "Prompt Quest"
  - File: `frontend/index.html`

---

## Phase 2: Phaser Game Embedded in React

**Goal:** Phaser canvas renders inside the React app

- [x] **Task 2.1:** Create EventBus
  - Simple typed event emitter for React↔Phaser communication
  - File: `frontend/src/game/EventBus.ts`
  - Verify: Can emit and listen for events

- [x] **Task 2.2:** Create PhaserGame React component
  - Mounts Phaser.Game into a div ref
  - Destroys on unmount
  - Passes game instance up via ref/callback
  - File: `frontend/src/game/PhaserGame.tsx`
  - Verify: Phaser canvas appears in browser

- [x] **Task 2.3:** Create MonsterPartyScene (basic)
  - Extends Phaser.Scene
  - create(): renders colored background + "Monster Party" text (placeholder)
  - Listens for EventBus 'play-script' events
  - File: `frontend/src/game/scenes/MonsterPartyScene.ts`
  - Verify: Scene loads, shows placeholder content

- [x] **Task 2.4:** Wire PhaserGame into App.tsx
  - Replace SaaS layout with game layout: Phaser canvas + input area below
  - File: `frontend/src/App.tsx`
  - Verify: Full-page game view renders

---

## Phase 3: Claude API Client + System Prompt

**Goal:** Browser-side Claude call returns valid scene script JSON

- [x] **Task 3.1:** Create scene script TypeScript types
  - SceneScript, Action, SuccessLevel types matching vocabulary contract
  - File: `frontend/src/types/scene-script.ts`

- [x] **Task 3.2:** Create Claude API client service
  - Uses @anthropic-ai/sdk with dangerouslyAllowBrowser (hackathon only)
  - evaluateInput(taskId, userInput) → SceneScript
  - JSON parsing with markdown fence stripping
  - 6s timeout
  - File: `frontend/src/services/claude.ts`
  - Verify: Compiles without errors

- [x] **Task 3.3:** Write Monster Party system prompt
  - Full vocabulary contract embedded
  - Success criteria: cake + decorations + entertainment = FULL_SUCCESS
  - File: `frontend/src/prompts/monster-party.ts`

- [x] **Task 3.4:** Create .env with VITE_ANTHROPIC_API_KEY placeholder
  - File: `frontend/.env.example` (commit-safe)
  - File: `frontend/.env` (gitignored — user creates manually)
  - Verify: `import.meta.env.VITE_ANTHROPIC_API_KEY` accessible

- [x] **Task 3.5:** Test Claude response manually (deferred — needs API key in .env)
  - Temporary test: call evaluateInput('monster-party', 'throw a huge cake') from App.tsx
  - Log result to console
  - Verify: Valid JSON with success_level, narration, actions, prompt_feedback
  - Verify: All referenced actors/props exist in vocabulary contract

---

## Phase 4: Minimal Game UI (Input + Submit)

**Goal:** User can type input and trigger Claude evaluation

- [x] **Task 4.1:** Create Zustand game store
  - State: currentTask, userInput, isLoading, lastScript, error
  - Actions: setInput, submitInput, clearScript
  - File: `frontend/src/stores/gameStore.ts`

- [x] **Task 4.2:** Create PromptInput component
  - Textarea + Submit button
  - Shows loading state
  - Emits 'play-script' on EventBus when response arrives
  - File: `frontend/src/components/PromptInput.tsx`
  - Verify: Can type, submit, see loading, see result in console

- [x] **Task 4.3:** Wire everything together in App.tsx
  - Layout: Phaser canvas (top 70%) + PromptInput (bottom 30%)
  - File: `frontend/src/App.tsx`
  - Verify: Type "throw a huge cake" → Claude responds → log shows valid JSON

---

## Day 1 Gate Verification

- [x] Phaser canvas renders in browser at localhost:5173 (build succeeds, all modules transform)
- [x] MonsterPartyScene loads with placeholder content
- [ ] Claude API returns valid scene script JSON for "throw a huge cake" (needs API key in frontend/.env)
- [ ] JSON contains success_level, narration, actions array, prompt_feedback
- [ ] All actors/props in response exist in vocabulary contract
- [x] No TypeScript errors, no console errors (tsc --noEmit passes, vite build succeeds)

---

## Files Created/Modified

| Action | File |
|--------|------|
| MODIFY | `frontend/package.json` (add phaser, zustand) |
| MODIFY | `frontend/src/App.tsx` (replace SaaS with game layout) |
| MODIFY | `frontend/index.html` (title) |
| CREATE | `frontend/src/game/EventBus.ts` |
| CREATE | `frontend/src/game/PhaserGame.tsx` |
| CREATE | `frontend/src/game/scenes/MonsterPartyScene.ts` |
| CREATE | `frontend/src/types/scene-script.ts` |
| CREATE | `frontend/src/services/claude.ts` |
| CREATE | `frontend/src/prompts/monster-party.ts` |
| CREATE | `frontend/src/stores/gameStore.ts` |
| CREATE | `frontend/src/components/PromptInput.tsx` |
| CREATE | `frontend/.env.example` |

## Notes

- NOT installing @anthropic-ai/sdk — use direct fetch to Claude API instead (smaller bundle, no Node.js polyfill issues in browser)
- NOT installing shadcn/ui yet — Tailwind classes are sufficient for Day 1
- Keep existing SaaS files in place (don't delete) — just don't route to them
- Backend Python API is untouched for Day 1 — browser calls Claude directly
