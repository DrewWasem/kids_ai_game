# Emoji Map Reference

**Created:** 2026-02-14
**Last Updated:** 2026-02-14
**Source:** session
**Confidence:** high
**Tags:** emoji, mapping, assets, reference, joyquest, pixel-art

## Summary

Complete reference for JoyQuest 2.0 emoji pack semantic naming system. Maps 35 human-readable emoji names to JoyQuest numbering with dual-format support (outline 16x16, bubble 32x32).

## Details

### File Location

`frontend/src/data/emoji-map.ts`

### JoyQuest 2.0 Pack Structure

**Total:** 254 PNG files (127 outline + 127 bubble)

**Outline emojis (16x16):**
- Path template: `/assets/2d/emojis/outline/em_outline_{N}.png`
- Numbering: 1-indexed (N=1-99, some skipped)
- Use case: Particle effects, UI icons

**Bubble emojis (32x32):**
- Path template: `/assets/2d/emojis/bubble/bubble_{N}.png`
- Numbering: 0-indexed (N=0-126, offset by -1 from outline)
- Use case: Character emotes, speech bubbles

### Semantic Name Mappings

All 35 mappings visually verified against actual PNG files.

**Positive emotions:**
- happy = 10
- laughing = 7
- love_eyes = 2
- cool = 90
- star_eyes = 15
- party = 19

**Negative emotions:**
- angry = 1
- mad = 6
- sad = 4
- crying = 3
- scared = 16
- worried = 5

**Neutral/Thinking:**
- confused = 17
- thinking = 23
- unamused = 9
- blushing = 95
- determined = 18

**Playful:**
- silly = 21
- tongue_out = 35
- drooling = 40
- dizzy = 45
- mischievous = 11
- smirk = 27

**Special states:**
- mind_blown = 28
- ghost = 24
- sleeping = 20
- frozen = 8

### API Functions

```typescript
/**
 * Get bubble emoji path (32x32) by semantic name or number
 * @param nameOrNum - "happy" or 10
 * @returns "/assets/2d/emojis/bubble/bubble_9.png"
 */
function getEmojiBubblePath(nameOrNum: string | number): string

/**
 * Get outline emoji path (16x16) by semantic name or number
 * @param nameOrNum - "happy" or 10
 * @returns "/assets/2d/emojis/outline/em_outline_10.png"
 */
function getEmojiOutlinePath(nameOrNum: string | number): string
```

### Indexing Rules

**Bubble (0-indexed):**
- Emoji #1 → `bubble_0.png`
- Emoji #10 → `bubble_9.png`
- Emoji #90 → `bubble_89.png`
- Formula: `bubble_{num - 1}.png`

**Outline (1-indexed):**
- Emoji #1 → `em_outline_1.png`
- Emoji #10 → `em_outline_10.png`
- Emoji #90 → `em_outline_90.png`
- Formula: `em_outline_{num}.png`

### Usage Examples

```typescript
// Semantic name resolution
getEmojiBubblePath("happy")
// → "/assets/2d/emojis/bubble/bubble_9.png"

// Direct number
getEmojiOutlinePath(7)
// → "/assets/2d/emojis/outline/em_outline_7.png"

// Scene script emote (backwards compatible)
{ type: "emote", actor: "monster", emoji: "party" }
// → Renders bubble_18.png (emoji #19)

// Particle effect
getEffectParticles("confetti-burst")
// → [
//   { type: "image", content: "/assets/.../em_outline_7.png" },  // laughing
//   { type: "image", content: "/assets/.../em_outline_19.png" }, // party
//   { type: "image", content: "/assets/.../em_outline_15.png" }, // star_eyes
//   { type: "image", content: "/assets/.../em_outline_90.png" }, // cool
// ]
```

### Integration Points

**ScenePlayer3D.tsx:**
- `handleEmote()` — Uses `resolveEmojiImage()` → `getEmojiBubblePath()` for character emotes
- `getEffectParticles()` — Uses `getEmojiOutlinePath()` for 8 pixel-art particle effects
- Fallback: Unmapped emoji strings render as Unicode `<span>`

**Rendering:**
- Bubble images: 48x48px with `image-rendering: pixelated`
- Outline images: 32x32px with `image-rendering: pixelated`
- Both use CSS animations (`emote-bounce`, `particle-pop`)

### Extension Pattern

To add new emoji mappings:

1. Find desired emoji in `/assets/2d/emojis/bubble/` or `/outline/` directories
2. Note the number from filename (e.g., `bubble_42.png` = emoji #43)
3. Add entry to `EMOJI_MAP` with semantic name
4. Optionally add to effect particle arrays in `getEffectParticles()`

Example:
```typescript
const EMOJI_MAP: Record<string, number> = {
  // existing...
  "new_emotion": 99,  // maps to bubble_98.png and em_outline_99.png
};
```

## Related

- `.claude/memory/sessions/2026-02-14-emoji-food-integration.md` — Deployment session
- `frontend/src/game/ScenePlayer3D.tsx` — Consumer of emoji map
- `frontend/public/assets/2d/emojis/` — Source PNG files
- `Model Zips/emoji_comic_pack_Joyquest_2.0.zip` — Original asset pack
