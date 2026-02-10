# Plan: Brand & Game Design Brief Implementation

**Created:** 2026-02-10
**Status:** draft
**Research:** docs/prompt-quest-brand-game-design-brief.html

## Goal
Align the codebase's visual theme with the brand & game design brief — colors, typography, sizing, animations, and component styling across 8 files.

## Approach
Update from foundation (Tailwind design tokens) outward to components (CSS → React → Phaser). Each phase builds on the previous. Verify with `npm run build` after each phase.

---

## Phase 1: Foundation — Tailwind Tokens & HTML

### Task 1.1: Update Tailwind color tokens
**File:** `frontend/tailwind.config.js`
**Action:** Replace quest.* color tokens with brand brief palette:
```
quest.bg:      #0f0a1e → #0F0A1A     (Void - deepest bg)
quest.panel:   #1a1035 → #1A0F2E     (Night - page bg)
quest.card:    #241850 → #231546     (Card surfaces)
quest.surface: NEW      #2D1B69     (Elevated panels)
quest.border:  #3d2d6b → #3D2B7A     (Dividers, outlines)
quest.borderLight: NEW  #4C3D8F     (Active borders)
quest.accent:  #a855f7 → #8B5CF6     (Vivid purple - buttons, active)
quest.purple:  NEW      #6C3FC5     (Deep purple - brand, headings)
quest.glow:    #c084fc → #A78BFA     (Light purple - secondary)
quest.gold:    #fbbf24  (unchanged)
quest.orange:  NEW      #FF8C42     (CTAs, highlights, action)
quest.orangeLight: NEW  #FFB380     (Hover, warm glow)
quest.cyan:    #22d3ee  REMOVE (replaced by quest.blue)
quest.blue:    NEW      #60A5FA     (Info, tips, hints)
quest.pink:    #f472b6  (unchanged)
quest.green:   #4ade80 → #34D399     (Reward green)
quest.red:     NEW      #F87171     (System warnings only)
quest.redSoft: NEW      #FCA5A5     (Gentle warnings)
```

Add text color tokens:
```
quest.text.bright:    #FFFFFF
quest.text.primary:   #E8E0F7
quest.text.secondary: #B8A9D4
quest.text.dim:       #8B7AAE
quest.text.muted:     #6B5C8A
```

**Action:** Update heading font from Fredoka to Nunito per brief:
```
fontFamily.heading: ['Fredoka', ...] → ['Nunito', ...]
```

**Action:** Update box shadows to use new purple values:
```
glow-purple: rgba(139, 92, 246, 0.3) + rgba(139, 92, 246, 0.1)
glow-gold: unchanged
glow-cyan: REMOVE, add glow-orange: 0 0 20px rgba(255, 140, 66, 0.25)
```

**Verify:**
- [ ] `cd frontend && npx tailwindcss --help` runs without error
- [ ] `npm run build` succeeds

### Task 1.2: Update body background color
**File:** `frontend/index.html`
**Action:** Change `bg-[#0f0a1e]` → `bg-quest-bg` (which will resolve to #0F0A1A)
**Verify:**
- [ ] `npm run build` succeeds

---

## Phase 2: CSS Component Classes

### Task 2.1: Update .btn-game class
**File:** `frontend/src/index.css`
**Action:** Update button sizing per brief (48px min, 56px preferred):
```css
.btn-game {
  @apply px-6 py-3.5 font-heading font-extrabold rounded-[14px]
         transition-all duration-150 transform
         hover:scale-105 active:scale-[0.96]
         disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100;
}
```
Changes: py-3 → py-3.5, font-bold → font-extrabold, rounded-2xl → rounded-[14px], duration-200 → duration-150, active:scale-95 → active:scale-[0.96], disabled:opacity-50 → disabled:opacity-40.

### Task 2.2: Update .input-magic class
**File:** `frontend/src/index.css`
**Action:** Update textarea per brief (min-height 100px, 16px padding, 14px radius):
```css
.input-magic {
  @apply w-full p-4 bg-quest-panel text-white rounded-[14px]
         border-2 border-quest-border font-body text-base
         placeholder-quest-text-muted resize-none
         focus:outline-none focus:border-quest-accent focus:shadow-glow-purple
         disabled:opacity-40 transition-all duration-300;
  min-height: 100px;
}
```
Changes: px-5 py-4 → p-4, bg-quest-card/80 → bg-quest-panel, rounded-2xl → rounded-[14px], placeholder color → quest.text.muted, disabled:opacity-50 → disabled:opacity-40, add min-height.

### Task 2.3: Update .bubble-result class
**File:** `frontend/src/index.css`
**Action:** Update per brief (20px radius, padding 20px 24px):
```css
.bubble-result {
  @apply px-6 py-5 rounded-[20px] font-body text-sm border backdrop-blur-sm;
}
```
Changes: p-4 → px-6 py-5, rounded-2xl → rounded-[20px], border-2 → border.

**Verify:**
- [ ] `npm run build` succeeds

---

## Phase 3: React Components

### Task 3.1: Update App.tsx header and nav
**File:** `frontend/src/App.tsx`
**Action:**
- Update gradient text: `from-quest-gold via-quest-accent to-quest-cyan` → `from-quest-gold via-quest-accent to-quest-blue`
- Update active tab: `from-quest-accent to-purple-700` → `from-quest-accent to-quest-purple`
- Update active tab border: `border-quest-glow shadow-glow-purple` → `border-quest-accent shadow-glow-purple`
- Update inactive tab: `border-quest-border hover:border-quest-accent/50` → `border-quest-border hover:border-quest-orange/50`

### Task 3.2: Update PromptInput.tsx — Submit button
**File:** `frontend/src/components/PromptInput.tsx`
**Action:** Change submit button from gold gradient to purple gradient per brief:
```
from: bg-gradient-to-b from-quest-gold to-amber-600 text-quest-bg
      border-2 border-yellow-400/50 shadow-glow-gold
to:   bg-gradient-to-br from-quest-accent to-quest-purple text-white
      border-2 border-quest-accent/50 shadow-glow-purple
```
Update hover: `hover:from-purple-400 hover:to-purple-600`
Update disabled: keep similar gray pattern
Update sizing: `text-base px-7 py-4` → `text-lg px-8 py-4 min-w-[160px]` (closer to 56px height)

### Task 3.3: Update PromptInput.tsx — Rotating loading messages
**File:** `frontend/src/components/PromptInput.tsx`
**Action:** Add loading messages array and rotate randomly:
```typescript
const LOADING_MESSAGES = [
  'The monster is getting ready...',
  'Setting up the scene...',
  'This is gonna be good...',
  'Hold on, something\'s happening...',
  'Mixing up some magic...',
];
```
Replace static "Thinking..." with random pick from array. Use a state ref or memo to pick once per loading cycle.

### Task 3.4: Update PromptInput.tsx — Feedback panel colors
**File:** `frontend/src/components/PromptInput.tsx`
**Action:** Update SUCCESS_STYLES to use brand brief colors:
- FULL_SUCCESS: keep emerald (matches brand's #34D399 reward green)
- PARTIAL_SUCCESS: keep amber (matches brand's #FBBF24 fun yellow)
- FUNNY_FAIL: update to use orange accent per brief (orange = "try again")

Update narration text: font-heading → font-body (Nunito), text-base → text-lg (18px per brief)
Update feedback tip text: add orange color accent per brief

### Task 3.5: Update PromptInput.tsx — Input panel background
**File:** `frontend/src/components/PromptInput.tsx`
**Action:** Update panel background: `bg-quest-panel/90` is fine (will pick up new #1A0F2E)

### Task 3.6: Update VoiceButton.tsx colors
**File:** `frontend/src/components/VoiceButton.tsx`
**Action:** Update idle state colors:
- `bg-quest-accent/20` → `bg-quest-accent/20` (fine, picks up new #8B5CF6)
- `text-quest-glow` → `text-quest-glow` (fine, picks up new #A78BFA)
No significant changes needed — colors update automatically via token changes.

**Verify:**
- [ ] `npm run build` succeeds
- [ ] Manual: dev server shows purple submit button, rotating loading text, updated colors

---

## Phase 4: Phaser Scenes

### Task 4.1: Update MonsterPartyScene fonts and colors
**File:** `frontend/src/game/scenes/MonsterPartyScene.ts`
**Action:**
- All `fontFamily: 'Arial, sans-serif'` → `fontFamily: 'Nunito, sans-serif'`
- Background: `#1a0533` → `#1A0533` (keep — this is the Phaser canvas bg, different from UI bg)
- Title: fontSize 28px → 32px, add fontStyle: '800' for extra bold
- Instruction text color: `#8888bb` → `#8B7AAE` (quest.text.dim)
- Label text color: `#aaaacc` → `#B8A9D4` (quest.text.secondary)
- Narration FUNNY_FAIL color: `#c084fc` → `#FF8C42` (orange for "try again" per brief)

### Task 4.2: Update RobotPizzaScene fonts and colors
**File:** `frontend/src/game/scenes/RobotPizzaScene.ts`
**Action:**
- All `fontFamily: 'Arial, sans-serif'` → `fontFamily: 'Nunito, sans-serif'`
- Title: fontSize 28px → 32px, fontStyle: '800'
- Instruction text color: `#7799bb` → `#8B7AAE` (quest.text.dim)
- Label text color: `#7799bb` → `#B8A9D4` (quest.text.secondary)
- Narration FUNNY_FAIL color: `#c084fc` → `#FF8C42` (orange)

**Verify:**
- [ ] `npm run build` succeeds
- [ ] Manual: dev server shows Nunito fonts in Phaser canvas, updated narration colors

---

## Success Criteria

### Automated
- [ ] `cd frontend && npm run build` succeeds with no new errors
- [ ] No TypeScript errors in modified files

### Manual
- [ ] Colors match brand brief palette (deep purple bg, vivid purple accents)
- [ ] Submit button is purple gradient with glow (not gold)
- [ ] Loading state shows rotating fun messages
- [ ] Text input has min-height ~100px, 14px border radius
- [ ] Phaser scene text uses Nunito font (not Arial)
- [ ] Narration colors: green (success), yellow (partial), orange (funny fail)
- [ ] Heading font is Nunito Extra Bold (not Fredoka)

## Rollback
All changes are in 8 tracked files. `git checkout -- frontend/` reverts everything.
