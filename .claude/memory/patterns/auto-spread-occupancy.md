# Auto-Spread Occupancy System

**Created:** 2026-02-14
**Last Updated:** 2026-02-14
**Source:** session
**Confidence:** high
**Tags:** 3d, overlap, spread, occupancy, scenePlayer3d, pattern

## Summary

When multiple actors spawn at the same stage mark position, subsequent actors are automatically offset in a 2-row grid pattern to prevent visual clipping. The system tracks occupancy at spawn, adjusts on move (decrement old, increment new), and cleans up on remove.

## Details

### Key Constants
- SPREAD_OFFSETS: 6-position grid pattern — [0,0], [0.9,0.15], [-0.9,0.15], [0,-0.7], [0.9,-0.7], [-0.9,-0.7]
- WING_POSITIONS: Set of off-stage positions excluded from spread (off-left, off-right, off-top)

### Key Functions
- positionKey(): Converts [x,y,z] to "x.toFixed(1),z.toFixed(1)" for occupancy map keys
- markOccupancy ref: Map<string, number> — tracks count of actors per position key
- actorMarkRef ref: Map<string, string> — tracks which position key each actor occupies

### Integration Points
- handleSpawn(): Apply spread offset based on current occupancy count
- handleMove(): Decrement old position, apply spread at new position
- handleRemove(): Decrement position occupancy
- All reset paths: Clear both refs (zone change, script start, vignette start)

## Related
- `frontend/src/game/ScenePlayer3D.tsx` — Implementation location
- `frontend/src/data/blocking-templates.ts` — 15-mark stage grid definitions
