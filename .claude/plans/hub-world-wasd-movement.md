# Plan: Hub World with Player Movement

## Goal
Replace the React task selector grid with an interactive Phaser hub world scene where the kid character walks around using arrow keys (+ WASD) and approaches task zones to enter them.

## Current State
- Task selection: React card grid in `App.tsx` (lines 81-109)
- Game canvas only appears after selecting a task
- No player movement exists — purely "type and watch"
- 6 task scenes exist, all use SceneScriptPlayer
- `kid` actor exists in assets but is never player-controlled
- Canvas: 1024x576, no physics engine

## Design

### Hub World Layout (1024x576 canvas)
A colorful single-screen overworld with 6 interactive zones. The kid sprite walks freely between them.

```
┌──────────────────────────────────────────────┐
│  "Prompt Quest"    ☆ Hub World ☆             │
│                                              │
│   🎂 Monster     🧙 Wizard     🦕 Dino      │
│   Party          Kitchen       School        │
│                                              │
│              🧒 ← Kid sprite                 │
│                                              │
│   🐕 Dog        🐙 Octopus    🤖 Robot      │
│   Space         Band           Pizza         │
│                                              │
│         "Walk to a quest and press Enter!"   │
└──────────────────────────────────────────────┘
```

Each zone: colored platform/area (120x100px) with emoji icon + label. Glow effect when kid is nearby.

### Player Controller
- **Arrow keys**: Always work for movement (no conflict with textarea)
- **WASD**: Also works when Phaser canvas has focus
- Speed: 200px/s, smooth movement via `update()` loop
- Boundaries: Clamped to canvas bounds (with padding)
- Visual feedback: Gentle bobbing tween while moving, flip X when going left
- No physics engine needed — simple position updates + boundary clamping

### Zone Interaction
- 6 rectangular zones at fixed positions
- Proximity check: kid center within zone bounds → "active" state
- Active zone: glowing border, floating "Press Enter ↵" prompt
- Enter/Space key → zoom transition → start task scene
- EventBus notifies React of scene change

### Scene Flow
```
App starts → HubWorldScene (always first)
  ↓ arrow keys
Kid walks to zone → zone highlights
  ↓ Enter/Space
Transition effect → TaskScene loads (existing behavior)
  ↓ Escape or "Back" button
Return to HubWorldScene (kid position preserved)
```

### React Integration
- `gameStore.ts` gets new state: `isInHub: boolean`
- When `isInHub === true`: hide PromptInput, show minimal HUD
- When `isInHub === false`: show PromptInput (existing behavior)
- EventBus events: `enter-task` (hub→React), `return-to-hub` (task→React)
- "All Tasks" button replaced with "Back to Hub" → triggers return

---

## Phase 1: Player Controller + Hub Scene Foundation
**Goal:** Kid sprite walking around an empty hub with arrow keys

### Task 1.1: Create PlayerController class
**File:** `frontend/src/game/PlayerController.ts` (new)
- Class that wraps a Phaser.GameObjects.Image (the kid sprite)
- Accepts cursor keys + WASD from `this.scene.input.keyboard`
- `update(delta)` method: read keys → update position → clamp to bounds
- Movement speed: 200px/s
- Flip sprite horizontally when moving left (`setFlipX`)
- Gentle Y bobbing while moving (sine wave, ±3px)
- `getPosition()` returns current {x, y}
- `setPosition(x, y)` for restoring position on return to hub

**Verification:** Import in a test scene, kid moves with arrow keys smoothly, stops at edges

### Task 1.2: Create HubWorldScene
**File:** `frontend/src/game/scenes/HubWorldScene.ts` (new)
- Extends `Phaser.Scene`, key: `'HubWorldScene'`
- `preload()`: call `preloadGameAssets(this)` (reuse existing loader)
- `create()`:
  - Draw a colorful gradient background (or reuse a backdrop)
  - Add title text: "Prompt Quest" at top
  - Spawn kid sprite at center (512, 350) using PlayerController
  - Add instruction text: "Walk to a quest and press Enter!" at bottom
  - Emit `'scene-ready'` + `'hub-entered'` events
- `update(time, delta)`: call `playerController.update(delta)`
- `shutdown()`: clean up event listeners

**Verification:** Scene loads, kid appears at center, arrow keys move kid, canvas boundaries work

### Task 1.3: Register HubWorldScene in PhaserGame
**File:** `frontend/src/game/PhaserGame.tsx` (modify)
- Import HubWorldScene
- Add as FIRST scene in the array (Phaser starts the first scene by default)
- Scene list: `[HubWorldScene, MonsterPartyScene, RobotPizzaScene, ...]`

**Verification:** App launches directly into HubWorldScene instead of requiring task selection

---

## Phase 2: Zone System + Visual Polish
**Goal:** 6 interactive zones with proximity detection and visual feedback

### Task 2.1: Add zone definitions and rendering
**File:** `frontend/src/game/scenes/HubWorldScene.ts` (modify)
- Define ZONES array with task metadata:
  ```ts
  { id: 'monster-party', label: 'Monster Party', emoji: '🎂',
    x: 170, y: 180, scene: 'MonsterPartyScene' }
  ```
- 6 zones in 2 rows of 3 (top row y≈180, bottom row y≈380)
- For each zone, create:
  - Filled rounded rectangle (Graphics) as platform/area
  - Emoji text centered on platform
  - Label text below platform
  - Use task-specific colors (purple for monster, blue for dog-space, etc.)

**Verification:** 6 colored zones visible on hub, properly spaced

### Task 2.2: Proximity detection + zone highlighting
**File:** `frontend/src/game/scenes/HubWorldScene.ts` (modify)
- In `update()`: check if kid sprite overlaps any zone (simple AABB check)
- When kid enters zone proximity:
  - Add glow effect (tween alpha on a larger rectangle behind zone)
  - Show floating "Press Enter ↵" text above zone
  - Store `activeZone` reference
- When kid leaves zone:
  - Remove glow + prompt text
  - Clear `activeZone`

**Verification:** Walk near a zone → it highlights + shows Enter prompt. Walk away → unhighlights.

### Task 2.3: Zone enter transition
**File:** `frontend/src/game/scenes/HubWorldScene.ts` (modify)
- Listen for Enter/Space key in `create()`
- On keypress while `activeZone` is set:
  - Play 'click' SFX
  - Camera zoom-in effect toward zone center (1.0 → 2.0 over 500ms)
  - Camera fade-out (300ms)
  - After transition: `this.scene.start(activeZone.scene)` + `this.scene.stop('HubWorldScene')`
  - Emit EventBus `'enter-task'` with zone id
  - Save kid position for return

**Verification:** Walk to zone → press Enter → zoom + fade → task scene loads

---

## Phase 3: React Integration + Return Flow
**Goal:** React UI adapts to hub vs task mode, return-to-hub works

### Task 3.1: Update gameStore with hub state
**File:** `frontend/src/stores/gameStore.ts` (modify)
- Add `isInHub: boolean` (default: true)
- Add `enterHub: () => void` action
- Add `exitHub: (taskId: string) => void` action
- Wire up EventBus listeners:
  - `'enter-task'` → `exitHub(taskId)` → sets `isInHub: false`, `currentTask: taskId`
  - `'hub-entered'` → `enterHub()` → sets `isInHub: true`

**Verification:** Console.log shows state transitions when entering/leaving hub

### Task 3.2: Update App.tsx to use hub state
**File:** `frontend/src/App.tsx` (modify)
- Remove `showGrid` state and the task grid JSX entirely
- Use `isInHub` from gameStore instead
- When `isInHub`:
  - Show Phaser canvas (hub world is running)
  - Hide PromptInput
  - Header shows "Prompt Quest" logo only (no "All Tasks" button)
- When `!isInHub`:
  - Show Phaser canvas (task scene is running)
  - Show PromptInput
  - Header shows "Back to Hub" button (replaces "All Tasks")
- "Back to Hub" button: emits `'return-to-hub'` event → triggers scene transition

**Verification:** Launch app → see hub world in canvas (no grid). Enter zone → PromptInput appears.

### Task 3.3: Add return-to-hub to task scenes
**File:** All 6 scene files + HubWorldScene (modify)
- Each task scene: listen for `'return-to-hub'` EventBus event
- On return: camera fade-out → `this.scene.start('HubWorldScene')` + `this.scene.stop(this.scene.key)`
- HubWorldScene: restore kid position from saved state on re-enter
- Also: pressing Escape key in a task scene triggers return

**Verification:** In task scene, click "Back to Hub" → returns to hub with kid at last position

---

## Phase 4: Polish + Game Feel
**Goal:** Make the hub feel alive and fun for kids

### Task 4.1: Hub world ambient life
**File:** `frontend/src/game/scenes/HubWorldScene.ts` (modify)
- Floating sparkle particles (reuse star/sparkle effect assets)
- Gentle idle animations on zone icons (bobbing sine wave)
- Ambient colored light circles drifting slowly
- Subtle parallax on background elements if kid moves

### Task 4.2: Movement juice
**File:** `frontend/src/game/PlayerController.ts` (modify)
- Dust puff particles when kid starts/stops moving
- Smooth acceleration/deceleration (not instant start/stop)
- Squash-and-stretch on direction changes
- Footstep SFX at regular intervals while moving (use 'click' or 'pop' at low volume)

### Task 4.3: Zone interaction polish
**File:** `frontend/src/game/scenes/HubWorldScene.ts` (modify)
- Zone glow pulses (sine wave alpha)
- "Enter" prompt bounces gently
- Transition: Add particle burst from zone center during zoom
- Return transition: reverse zoom-out effect
- Play 'jingle-start' when entering a task zone

---

## Files Summary

### New Files (2)
| File | Purpose |
|------|---------|
| `frontend/src/game/PlayerController.ts` | Arrow key/WASD movement controller for kid sprite |
| `frontend/src/game/scenes/HubWorldScene.ts` | Hub world scene with zones + player movement |

### Modified Files (3)
| File | Changes |
|------|---------|
| `frontend/src/game/PhaserGame.tsx` | Add HubWorldScene as first scene |
| `frontend/src/stores/gameStore.ts` | Add isInHub state + hub/task transitions |
| `frontend/src/App.tsx` | Replace grid with hub-aware layout, add back-to-hub |

### Lightly Modified (6 task scenes)
| File | Changes |
|------|---------|
| `frontend/src/game/scenes/MonsterPartyScene.ts` | Add return-to-hub listener + Escape key |
| `frontend/src/game/scenes/RobotPizzaScene.ts` | Same |
| `frontend/src/game/scenes/WizardKitchenScene.ts` | Same |
| `frontend/src/game/scenes/DinosaurSchoolScene.ts` | Same |
| `frontend/src/game/scenes/DogSpaceScene.ts` | Same |
| `frontend/src/game/scenes/OctopusBandScene.ts` | Same |

---

## Risk Assessment

| Risk | Mitigation | Impact |
|------|------------|--------|
| WASD conflicts with textarea | Arrow keys are primary; WASD only works when canvas focused | Low (design choice handles it) |
| Kid sprite has no walk frames | Bobbing tween + flip creates illusion of movement | Low |
| Hub world looks empty on 1024x576 | Dense decoration: particles, zone platforms, ambient effects | Medium |
| Scene transition bugs | Save/restore kid position in gameStore | Low |
| Performance with particles | Cap at 20-30 ambient particles, destroy on scene exit | Low |

## Success Criteria
- [ ] Kid walks around hub with arrow keys (+ WASD when canvas focused)
- [ ] 6 zones visible with labels and emojis
- [ ] Walking near a zone highlights it + shows Enter prompt
- [ ] Pressing Enter transitions smoothly to the task scene
- [ ] PromptInput appears in task scenes, hidden in hub
- [ ] "Back to Hub" returns to hub with kid position preserved
- [ ] Escape key in task scene returns to hub
- [ ] Hub feels alive with ambient particles and animations
- [ ] No regressions in existing task gameplay
