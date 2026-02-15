# Transition Tile Regression Pattern

**Created:** 2026-02-14
**Last Updated:** 2026-02-14
**Source:** session
**Confidence:** high
**Tags:** hex-terrain, grass, regression, anti-pattern, village-world

## Summary
Transition tiles (hex_transition.gltf) keep getting reintroduced in VillageWorld.tsx HexTerrain component, causing white checkerboard artifacts around zone centers. This pattern has recurred multiple times despite being fixed.

## Details

### The Problem
In `frontend/src/components/VillageWorld.tsx`, the HexTerrain component conditionally renders transition tiles near zone centers:

```typescript
// WRONG - causes white checkerboard
const tileModel = nearZone ? TILES.transition : TILES.grass;
```

This creates visible white transition tiles around zones, breaking the seamless grass aesthetic.

### The Fix
Always use grass tiles only:

```typescript
// CORRECT - seamless grass
const tileModel = TILES.grass;
```

### Why It Keeps Happening
The transition tile logic seems like it should work (zones need transitions, right?), so it gets reintroduced during refactoring. However, the hex_transition.gltf asset is white/blank and visually breaks the scene.

### Root Cause
Original design included transition tiles for zone boundaries, but the actual asset doesn't blend properly. The grass-only approach works better visually.

## Related
- `frontend/src/components/VillageWorld.tsx` - HexTerrain component
- Commit 662a7eb - Original fix
- Session 2026-02-14 - Latest recurrence and fix
- [Village World Architecture](../decisions/village-world-architecture.md)
