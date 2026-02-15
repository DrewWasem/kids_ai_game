# Pixel-Art Particle & Emote System

**Created:** 2026-02-14
**Last Updated:** 2026-02-14
**Source:** session
**Confidence:** high
**Tags:** emotes, particles, effects, animation, pixel-art, joyquest, rendering

## Summary

Upgraded ScenePlayer3D emote and particle effects to render JoyQuest 2.0 pixel-art emoji images instead of Unicode fallbacks. Supports semantic emoji names, dual-format images (bubble/outline), and enhanced CSS animations with per-particle rotation and gravity.

## Details

### Problem

Original system rendered emotes and particles as Unicode emoji text (`<span>`), which:
- Varied drastically across browsers/OS (different fonts)
- Didn't match game's pixel-art aesthetic
- Limited animation options (couldn't apply image-specific effects)
- No control over emoji design

### Solution

**Two-tier rendering:**
1. **Mapped emojis** → Render pixel-art PNG images from JoyQuest 2.0 pack
2. **Unmapped emojis** → Fall back to Unicode `<span>` (backwards compatible)

**Dual image formats:**
- **Bubble (32x32)** → Character emotes (speech bubble style)
- **Outline (16x16)** → Particle effects (lightweight, transparent)

**Semantic naming:** Use human-readable names (`"happy"`, `"laughing"`) instead of emoji numbers

### Architecture

#### New Data Structures

```typescript
// Particle type enum
interface EffectParticle {
  type: 'unicode' | 'image';
  content: string;  // Unicode char or image path
}

// Emoji mapping (emoji-map.ts)
const EMOJI_MAP: Record<string, number> = {
  happy: 10,
  laughing: 7,
  love_eyes: 2,
  // ... 35 total mappings
};

function getEmojiBubblePath(nameOrNum: string | number): string;
function getEmojiOutlinePath(nameOrNum: string | number): string;
```

#### Emote System (handleEmote)

**Flow:**
1. Scene script provides emoji name: `{ type: "emote", actor: "monster", emoji: "happy" }`
2. `resolveEmojiImage("happy")` checks emoji-map.ts
3. If mapped → returns `/assets/2d/emojis/bubble/bubble_9.png`
4. If unmapped → returns `null`, fall back to Unicode

**Rendering:**
```typescript
// Mapped emoji (image)
<img
  src={emojiPath}
  style={{
    width: '48px',
    height: '48px',
    imageRendering: 'pixelated',
  }}
  className="emote-bubble"
/>

// Unmapped emoji (Unicode fallback)
<span className="emote-bubble" style={{ fontSize: '48px' }}>
  {emojiStr}
</span>
```

**CSS animation:**
```css
@keyframes emote-bounce {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.emote-bubble {
  animation: emote-bounce 0.6s ease-in-out infinite;
}
```

#### Particle System (getEffectParticles)

**Pixel-art effects (8 total):**
1. `confetti-burst` → [laughing, party, star_eyes, cool] (outline)
2. `hearts-float` → [love_eyes, blushing] (outline)
3. `laugh-tears` → [laughing x4] (outline)
4. `sad-cloud` → [sad, crying] (outline)
5. `sparkle-magic` → [star_eyes x3] (outline)
6. `explosion-cartoon` → [mind_blown x3] (outline)
7. `glow-pulse` → [happy, star_eyes] (outline)
8. `skull-burst` → [ghost x4] (outline)

**Unicode fallback effects:**
All other effect names (e.g., `rainbow-trail`, `fire-burst`) use existing `getEffectEmojis()` function.

**Flow:**
```typescript
function getEffectParticles(effect: string): EffectParticle[] {
  switch (effect) {
    case 'confetti-burst':
      return [
        { type: 'image', content: getEmojiOutlinePath('laughing') },
        { type: 'image', content: getEmojiOutlinePath('party') },
        { type: 'image', content: getEmojiOutlinePath('star_eyes') },
        { type: 'image', content: getEmojiOutlinePath('cool') },
      ];
    // ... 7 more cases

    default:
      // Unicode fallback
      return getEffectEmojis(effect).map(emoji => ({
        type: 'unicode',
        content: emoji,
      }));
  }
}
```

**Rendering:**
```typescript
{particles.map((particle, i) => (
  particle.type === 'image' ? (
    <img
      key={i}
      src={particle.content}
      style={{
        width: '32px',
        height: '32px',
        imageRendering: 'pixelated',
        '--rotate': `${Math.random() * 360 - 180}deg`,
        animationDelay: `${i * 70}ms`,
      }}
      className="particle-item"
    />
  ) : (
    <span key={i} className="particle-item" style={{ fontSize: '32px' }}>
      {particle.content}
    </span>
  )
))}
```

### Enhanced CSS Animation

**New keyframe with physics:**
```css
@keyframes particle-pop {
  0% {
    transform: translate(0, 0) scale(0) rotate(0deg);
    opacity: 0;
  }
  20% {
    transform: translate(
      calc(var(--dx, 0) * 0.4),
      calc(var(--dy, 0) * 0.4 + 5px)
    ) scale(1.4) rotate(var(--rotate, 0deg));
    opacity: 1;
  }
  40% {
    transform: translate(
      calc(var(--dx, 0) * 0.8),
      calc(var(--dy, 0) * 0.8 + 12px)
    ) scale(1.1) rotate(calc(var(--rotate, 0deg) * 1.5));
    opacity: 1;
  }
  100% {
    transform: translate(
      var(--dx, 0),
      calc(var(--dy, 0) + 20px)  /* Gravity drift */
    ) scale(0.3) rotate(calc(var(--rotate, 0deg) * 2));
    opacity: 0;
  }
}

.particle-item {
  animation: particle-pop 1.8s ease-out forwards;
}
```

**Animation features:**
- **Stagger:** 70ms delay per particle via inline `animationDelay`
- **Rotation:** Per-particle CSS var `--rotate` (random -180° to 180°)
- **Gravity:** +20px downward drift during animation
- **Scale sequence:** 0 → 1.4x → 1.1x → 0.3x (pop-in with overshoot)
- **Duration:** 1.8s total (was 1.5s)

### Semantic Emoji Mappings

**All 35 verified mappings:**
```typescript
// Positive
happy: 10, laughing: 7, love_eyes: 2, cool: 90, star_eyes: 15, party: 19

// Negative
angry: 1, mad: 6, sad: 4, crying: 3, scared: 16, worried: 5

// Neutral
confused: 17, thinking: 23, unamused: 9, blushing: 95, determined: 18

// Playful
silly: 21, tongue_out: 35, drooling: 40, dizzy: 45, mischievous: 11, smirk: 27

// Special
mind_blown: 28, ghost: 24, sleeping: 20, frozen: 8
```

### Backwards Compatibility

**Scene scripts unchanged:**
```json
// Old format still works (Unicode fallback)
{ "type": "emote", "actor": "monster", "emoji": "🎉" }

// New format (pixel-art image)
{ "type": "emote", "actor": "monster", "emoji": "party" }

// React action still works (Unicode fallback)
{ "type": "react", "effect": "rainbow-trail", "position": "center" }

// New pixel-art effect
{ "type": "react", "effect": "confetti-burst", "position": "center" }
```

**Migration strategy:**
- Phase 1: Dual rendering (current)
- Phase 2: Update all vignette scripts to use semantic names
- Phase 3: Remove Unicode fallback if all scripts migrated

### Image Rendering Settings

**Pixel-art preservation:**
```typescript
style={{
  imageRendering: 'pixelated',  // Prevents anti-aliasing blur
  width: '48px',  // Bubble emotes
  height: '48px',
}}

style={{
  imageRendering: 'pixelated',
  width: '32px',  // Outline particles
  height: '32px',
}}
```

**Browser support:** Works in all modern browsers (Chrome, Firefox, Safari, Edge)

### Performance Impact

**Before (Unicode):**
- Render: `<span>` with system emoji font
- No network requests
- Instant

**After (pixel-art images):**
- Render: `<img>` with PNG file
- Network requests: 254 total emoji PNGs (127 bubble + 127 outline)
- File size: ~2-4 KB per PNG, ~640 KB total
- Caching: Browser caches after first load
- Loading: Preload common emojis on game start

**Optimization:**
- Only load outline emojis used in particle effects (8 effects = ~30 unique emojis)
- Only load bubble emojis used in scene scripts (~20 unique)
- Total realistic payload: ~200 KB (vs 640 KB if all loaded)

### Testing Checklist

- [ ] Mapped emojis render as pixel-art images
- [ ] Unmapped emojis fall back to Unicode
- [ ] Particle effects use outline images for 8 core effects
- [ ] Emote animations play smoothly (bounce loop)
- [ ] Particle animations show rotation + gravity
- [ ] Images preserve pixel-art crispness (no blur)
- [ ] Scene scripts with old emoji format still work

### Extension Pattern

**Adding new pixel-art effects:**

1. Choose effect name (e.g., `"star-shower"`)
2. Select emojis from emoji-map.ts (e.g., `star_eyes`, `sparkle`)
3. Add case to `getEffectParticles()`:
   ```typescript
   case 'star-shower':
     return [
       { type: 'image', content: getEmojiOutlinePath('star_eyes') },
       { type: 'image', content: getEmojiOutlinePath('star_eyes') },
       { type: 'image', content: getEmojiOutlinePath('star_eyes') },
     ];
   ```
4. Use in scene script: `{ type: "react", effect: "star-shower" }`

**Adding new emoji mappings:**

1. Find desired emoji in `/assets/2d/emojis/bubble/` directory
2. Note number from filename (e.g., `bubble_42.png` = emoji #43)
3. Add to `EMOJI_MAP` in emoji-map.ts:
   ```typescript
   new_emotion: 99,  // bubble_98.png, em_outline_99.png
   ```
4. Use in scene script: `{ type: "emote", actor: "character", emoji: "new_emotion" }`

## Related

- `.claude/memory/context/emoji-map-reference.md` — Complete emoji mapping reference
- `.claude/memory/sessions/2026-02-14-emoji-food-integration.md` — Deployment session
- `frontend/src/game/ScenePlayer3D.tsx` — Implementation (handleEmote, getEffectParticles)
- `frontend/src/data/emoji-map.ts` — Semantic emoji mappings
- `frontend/public/assets/2d/emojis/` — Pixel-art PNG files
