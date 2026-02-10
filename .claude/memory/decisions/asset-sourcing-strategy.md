# Asset Sourcing Strategy

**Created:** 2026-02-10
**Last Updated:** 2026-02-10
**Source:** session
**Confidence:** high
**Tags:** assets, strategy, kenney, cc0, decisions

## Summary
Decided to use Kenney.nl (CC0) as primary asset source, supplemented by OpenGameArt (CC0) and itch.io (check per-pack license) for gaps. Custom SVGs for anything not found in free packs.

## Details

### Sourcing Priority Order
1. **Kenney.nl** (CC0, public domain) — primary source for consistent art style
2. **OpenGameArt.org** (CC0 only) — for specific characters (dino, squirrel)
3. **itch.io free packs** (check license per pack) — for octopus, monsters
4. **Custom SVGs** — for any remaining gaps (balloon, present, instruments)
5. **LottieFiles.com** (free tier) — for reaction effect overlays

### Style Decision
- Must maintain consistent visual style across all assets
- Kenney's toon/cartoon style is the baseline
- If mixing sources, scale and color-adjust to match
- Characters ~128-256px, Props ~64-128px, Backdrops 1024x576

### License Safety
- Only use CC0 or equivalent public domain assets
- For itch.io: verify "free for commercial use" before including
- Keep License.txt from each pack in raw-packs/ as proof

## Related
- `frontend/public/assets/ASSET-MANIFEST.md`
- `.claude/memory/research/asset-library.md`
