# Kenney All-in-1 3D + Audio Deployment

**Created:** 2026-02-14
**Last Updated:** 2026-02-15
**Source:** session
**Confidence:** high
**Tags:** assets, kenney, 3d, audio, deployment, glb, ogg

## Summary
Deployed 1,636 GLB models (31MB) from Kenney Game Assets All-in-1 v3.3.0 across 13 packs, plus 665 OGG audio files (20MB) across 8 categories. All 1,636 3D GLBs registered in PROP_PATHS. Audio fully integrated into SoundManager3D.

## Details

### Source
- Zip: `Model Zips/Kenney Game Assets All-in-1 3.3.0.zip` (456MB)
- License: CC0 (public domain)
- Contains: 50 3D packs (~4,984 GLBs total), 16 audio packs (1,286 OGGs total)
- We deployed 13 relevant 3D packs and 8 audio categories

### 3D Packs Deployed (`frontend/public/assets/3d/kenney/`)
| Pack | GLB Count | Content |
|------|-----------|---------|
| food-kit/ | 200 | Food items (may overlap with food-mega-pack) |
| fantasy-town/ | 167 | Medieval buildings, walls, props |
| furniture-kit/ | 140 | Indoor furniture, appliances |
| nature-kit/ | 329 | Trees, rocks, plants, terrain |
| holiday-kit/ | 99 | Holiday decorations, presents |
| graveyard-kit/ | 91 | Tombstones, fences, spooky props |
| castle-kit/ | 76 | Castle walls, towers, gates |
| space-kit/ | 153 | Space vehicles, stations, props |
| space-station/ | 177 | Space station modules, corridors |
| pirate-kit/ | 66 | Pirate ships, barrels, treasure |
| weapon-pack/ | 37 | Medieval weapons |
| survival-kit/ | 80 | Camping, survival gear |
| mini-dungeon/ | 21 | Small dungeon set |
| **Total** | **1,636** | **~31MB** |

### Naming Convention
- All files renamed: spaces → hyphens
- Example: `chair_01.glb`, `table-round_01.glb`
- Extracted from "GLTF format" directories (actually contain .glb files)

### Registration (COMPLETE)
All 1,636 GLBs registered in `PROP_PATHS` in ScenePlayer3D.tsx.
- **Collision resolution:** 160 names collided with existing props → `_kn` suffix (e.g., `flag_kn`, `barrel_kn`, `cake_kn`)
- **Scale system:** `KENNEY_PACK_SCALE` lookup in `resolvePropScale()` — 13 pack prefixes mapped to default scales:
  - 3.0: fantasy-town, food-kit, holiday-kit (small models need scale-up)
  - 2.5: castle-kit, furniture-kit, graveyard-kit, nature-kit, pirate-kit, survival-kit, weapon-pack
  - 2.0: mini-dungeon, space-kit, space-station
- **Total PROP_PATHS:** 2,186 entries (kenney: 1,636 + others: 550)
- **Bundle impact:** +90 kB JS (+14.5 kB gzipped) — purely config data strings

### Audio Deployment
See `audio-system-architecture.md` for full audio details.

### Summary Doc
`docs/asset-expansion-summary.md` — comprehensive inventory of all assets, locations, and registration status.

## Related
- `frontend/public/assets/3d/kenney/` — 13 pack directories
- `frontend/public/assets/audio/` — 8 audio directories
- `frontend/src/game/ScenePlayer3D.tsx` — PROP_PATHS (2,186 entries), KENNEY_PACK_SCALE
- `.claude/memory/context/audio-system-architecture.md` — audio integration details
- `docs/asset-expansion-summary.md` — full asset expansion summary
