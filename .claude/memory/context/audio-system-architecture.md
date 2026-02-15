# Audio System Architecture

**Created:** 2026-02-14
**Last Updated:** 2026-02-14
**Source:** session
**Confidence:** high
**Tags:** audio, sound, music, sfx, ogg, web-audio, kenney, architecture

## Summary
SoundManager3D upgraded from 248-line synthesized-only system to 470-line hybrid system with real Kenney OGG audio files, background music streaming, and synthesized fallbacks. 665 OGG files deployed across 8 categories.

## Details

### SoundManager3D (`frontend/src/game/SoundManager3D.ts`)
- **SFX**: AudioBuffer cache for instant playback, fetched + decoded via Web Audio API
- **Music**: HTMLAudioElement streaming with loop=true, fade-in (~1.5s) / fade-out (~0.5s)
- **Fallback**: Synthesized Web Audio API oscillators/noise for all 9 sound types
- **Volume**: sfxVolume=0.5, musicVolume=0.3 (separate controls)
- **Preload**: `preload()` fetches + decodes all SFX files on mount
- **Mute**: `setMuted()` controls both SFX and music, synced via gameStore `isMuted`

### SFX File Mapping (SOUND_FILES constant)
| SoundName | Files | Source Pack |
|-----------|-------|-------------|
| spawn | pepSound{1-3}.ogg | sfx/ |
| move | phaseJump{1-3}.ogg | sfx/ |
| react | powerUp{1-3}.ogg | sfx/ |
| success | jingles-pizzicato_{00-01}.ogg | jingles/ |
| partial | jingles-steel_{00-01}.ogg | jingles/ |
| fail | lose{1-3}.ogg | retro/ |
| click | click_{001-003}.ogg | ui/ |
| remove | minimize_{001-002}.ogg | ui/ |
| intro | [] (synthesized only) | — |

### Background Music (ZONE_MUSIC constant)
| Zone | Track |
|------|-------|
| village | Mishief-Stroll.ogg |
| skeleton-birthday | Retro-Mystic.ogg |
| knight-space | Space-Cadet.ogg |
| mage-kitchen | Italian-Mom.ogg |
| barbarian-school | Cheerful-Annoyance.ogg |
| dungeon-concert | Alpha-Dance.ogg |
| skeleton-pizza | Retro-Comedy.ogg |
| adventurers-picnic | Farm-Frolics.ogg |
| title | Wacky-Waiting.ogg |

### Audio File Deployment (`frontend/public/assets/audio/`)
| Directory | Count | Content |
|-----------|-------|---------|
| music/ | 29 | Background loops and idents |
| jingles/ | 85 | Victory/fail stingers (5 styles x 17 each) |
| rpg/ | 51 | Ambient RPG sounds (doors, books, footsteps) |
| ui/ | 151 | Interface clicks, confirmations, toggles |
| impact/ | 130 | Footsteps, impacts (by surface type) |
| scifi/ | 73 | Space sounds (engines, lasers, force fields) |
| retro/ | 84 | 8-bit effects (coins, jumps, explosions) |
| sfx/ | 62 | Digital synth sounds (power-ups, phase jumps) |
| **Total** | **665** | **~20MB all OGG format** |

### App.tsx Wiring
- `SoundManager3D.preload()` called in mount useEffect
- useEffect subscribes to `currentZone` → `playMusic(zone)` or `playMusic('village')`
- Only activates after `started` is true (title screen dismissed)

### Smart Fallback Pattern
First play: synthesized instantly (synchronous). OGG loaded in background. Subsequent plays: real audio from cache. This preserves test compatibility (34 tests pass).

## Related
- `frontend/src/game/SoundManager3D.ts` — implementation
- `frontend/src/App.tsx` — music wiring
- `frontend/public/assets/audio/` — all OGG files
- `.claude/memory/context/asset-pack-locations.md` — legacy Phaser-era asset paths
