# Visual Regression Test Results — Feb 12, 2026

## Summary

**22/22 stages PASS** across all 7 stories. 27 position overlap warnings detected, all categorized as non-blocking.

## Test Results

| Story | Stages | Result | Warnings |
|-------|--------|--------|----------|
| skeleton-birthday | 3/3 | PASS | 1 (off-screen spawn) |
| skeleton-pizza | 3/3 | PASS | 2 (off-screen + center clustering) |
| mage-kitchen | 3/3 | PASS | 0 |
| barbarian-school | 3/3 | PASS | 4 (sequential actions + center overlap) |
| knight-space | 3/3 | PASS | 5 (sequential actions + position pairs) |
| dungeon-concert | 3/3 | PASS | 6 (center crowding — many actors) |
| adventurers-picnic | 4/4 | PASS | 9 (large cast scenes, 17-19 actors) |

## Warning Categories

### Category 1: Off-screen spawn overlaps (8 warnings) — NOT AN ISSUE
Multiple actors spawn at `off-left` or `off-top` then immediately move to their final positions. This is by design — spawn entry points are off-screen staging areas.

Examples:
- skeleton-birthday stage 1: knight + rogue both enter from off-left
- adventurers-picnic stage 1: knight + rogue + barbarian enter from off-left

### Category 2: Same character repeated (8 warnings) — NOT AN ISSUE
Stories describe sequential actions for the same character (e.g., barbarian walks → looks → sits → cheers). The story-resolver creates multiple elements for the same actor. ScenePlayer3D's `handleSpawn` replaces actors with the same ID, so only the last spawn is visible. The overlaps in the script analysis are phantom — only one instance renders.

Examples:
- barbarian-school stage 2: 3x barbarian at center (Walking_A → Idle_A → Sit_Chair_Idle)
- knight-space stage 1: 3x knight at center (Walking_A → Jump → Interact → Attack)

### Category 3: Different actors/props at same position (11 warnings) — MINOR/COSMETIC
The position grid is coarse (left/center/right = 3 usable positions). Scenes with 10+ actors naturally cluster multiple characters and props at the same named position. Visually, R3F renders them at the exact same 3D coordinates, causing overlap.

**Impact:** Characters may partially overlap or merge visually. Props (tables, barrels) may appear inside characters.

**Most affected scenes:**
- dungeon-concert stage 3: 5 actors at center (skeleton, torch, banner, mage, clown)
- adventurers-picnic stage 3: 4 actors at center (knight, table, mage, barrel)
- skeleton-pizza stage 3: 4 actors at center (skeleton, table, knight, skeleton)

**Verdict:** Crowded but all actors still distinguishable in screenshots. For a kids' game with comedy themes, the "chaotic overlap" feels intentional rather than broken. Not worth fixing before demo.

## Potential Future Improvements (Post-Hackathon)

1. **Position jitter**: Add small random x/z offset (±0.5 units) when multiple actors share a position
2. **More positions**: Expand from 3 to 5+ on-screen positions (far-left, left, center-left, center, center-right, right, far-right)
3. **Auto-layout**: Calculate positions based on actor count to evenly distribute across available space
4. **Depth staggering**: Offset actors in the z-axis when sharing x positions to create foreground/background layering

## Screenshots

All screenshots saved to `/tmp/pq-visual-test/{storyId}/stage-{N}-{label}.png`
HTML report: `/tmp/pq-visual-test/report.html`
JSON report: `/tmp/pq-visual-test/report.json`

## Conclusion

All 7 stories progress through their full story arcs successfully. No blockers found. The position overlap warnings are cosmetic issues that don't impact gameplay or demo quality.
