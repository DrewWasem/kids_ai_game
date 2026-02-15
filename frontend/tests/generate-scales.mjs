/**
 * generate-scales.mjs — Reads asset-dimensions.json and generates asset-scales.ts
 *
 * Uses FIXED PACK-LEVEL SCALE FACTORS derived from VillageWorld.tsx ground truth.
 * Each asset pack was placed at a specific scale in VillageWorld zones — those
 * scales are the authoritative "correct" values for spawning props near characters.
 *
 * Usage: node frontend/tests/generate-scales.mjs
 * Prerequisites: Run measure-assets.mjs first to generate asset-dimensions.json
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIMENSIONS_PATH = path.join(__dirname, '..', 'src', 'data', 'asset-dimensions.json')
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'asset-scales.ts')

// ============================================================================
// PACK-LEVEL SCALE FACTORS — derived from VillageWorld.tsx ground truth
// ============================================================================
//
// These are the scales VillageWorld uses when placing these models in zones
// (near ~2.6u characters). Validated by visual inspection in-game.
//
// Strategy: fixed scale per pack/path. NOT computed from dimensions.
// This avoids the "target height" problem where a barrel and a wall in
// the same pack get wildly different scales.

const PACK_SCALES = [
  // ── KayKit Characters (reference baseline) ──
  { pattern: /^kaykit\/characters\//, scale: 1.0, name: 'kaykit-character' },

  // ── KayKit Dungeon Pack ──
  // Walls/floors: 1.0. Pillars: 1.3. Containers (barrel/crate/chest): 0.4-0.5.
  // Banners/shields: 0.7. Scaffolds: 0.8. Torches: 2.0.
  // Using per-model type scales since this pack has varied models at different scales.
  { pattern: /^kaykit\/packs\/dungeon\/wall/, scale: 1.0, name: 'kaykit-dungeon-wall' },
  { pattern: /^kaykit\/packs\/dungeon\/floor/, scale: 1.0, name: 'kaykit-dungeon-floor' },
  { pattern: /^kaykit\/packs\/dungeon\/pillar/, scale: 1.3, name: 'kaykit-dungeon-pillar' },
  { pattern: /^kaykit\/packs\/dungeon\/(barrel|crate|chest|box)/, scale: 0.5, name: 'kaykit-dungeon-container' },
  { pattern: /^kaykit\/packs\/dungeon\/(banner|shield)/, scale: 0.7, name: 'kaykit-dungeon-banner' },
  { pattern: /^kaykit\/packs\/dungeon\/scaffold/, scale: 0.8, name: 'kaykit-dungeon-scaffold' },
  { pattern: /^kaykit\/packs\/dungeon\/torch/, scale: 2.0, name: 'kaykit-dungeon-torch' },
  { pattern: /^kaykit\/packs\/dungeon\/(sword|axe|weapon)/, scale: 0.7, name: 'kaykit-dungeon-weapon' },
  { pattern: /^kaykit\/packs\/dungeon\/(table|shelf|rack)/, scale: 0.7, name: 'kaykit-dungeon-furniture' },
  { pattern: /^kaykit\/packs\/dungeon\/book/, scale: 0.5, name: 'kaykit-dungeon-book' },
  { pattern: /^kaykit\/packs\/dungeon\/candle/, scale: 1.0, name: 'kaykit-dungeon-candle' },
  { pattern: /^kaykit\/packs\/dungeon\/door/, scale: 1.0, name: 'kaykit-dungeon-door' },
  { pattern: /^kaykit\/packs\/dungeon\/stair/, scale: 1.0, name: 'kaykit-dungeon-stair' },
  { pattern: /^kaykit\/packs\/dungeon\/key/, scale: 0.5, name: 'kaykit-dungeon-key' },
  { pattern: /^kaykit\/packs\/dungeon\//, scale: 0.7, name: 'kaykit-dungeon-misc' },

  // ── KayKit Restaurant Pack — all scale 1.0 in VillageWorld ──
  { pattern: /^kaykit\/packs\/restaurant\//, scale: 1.0, name: 'kaykit-restaurant' },

  // ── KayKit Space Base Pack — all scale 2.5 in VillageWorld ──
  { pattern: /^kaykit\/packs\/space_base\//, scale: 2.5, name: 'kaykit-space' },

  // ── KayKit Forest Nature Pack ──
  // In zone context (near characters): rocks 1.0-1.2
  // As village decoration: 7.0 (but that's for landscape, not spawning)
  // For props spawned near characters, use 1.0
  { pattern: /^kaykit\/packs\/forest_nature\//, scale: 1.0, name: 'kaykit-nature' },

  // ── KayKit Furniture Pack ──
  { pattern: /^kaykit\/packs\/furniture\//, scale: 1.0, name: 'kaykit-furniture' },

  // ── KayKit Holiday Pack ──
  { pattern: /^kaykit\/packs\/holiday\//, scale: 1.0, name: 'kaykit-holiday' },

  // ── KayKit Halloween Pack ──
  { pattern: /^kaykit\/packs\/halloween\//, scale: 1.0, name: 'kaykit-halloween' },

  // ── KayKit Medieval Hex Pack ──
  // These are tiny hex-tile models. Village uses 7.0 for buildings/decorations.
  // For spawning near characters, 7.0 is correct (they're miniature without it).
  { pattern: /^kaykit\/packs\/medieval_hex\//, scale: 7.0, name: 'kaykit-medieval-hex' },

  // ── KayKit RPG Tools Pack ──
  { pattern: /^kaykit\/packs\/rpg_tools\//, scale: 1.0, name: 'kaykit-rpg-tools' },

  // ── KayKit City Builder Pack ──
  // Tiny hex-scale models, need ~7.0 for character scale
  { pattern: /^kaykit\/packs\/city_builder\//, scale: 7.0, name: 'kaykit-city' },

  // ── KayKit Block Pack ──
  { pattern: /^kaykit\/packs\/block\//, scale: 1.0, name: 'kaykit-block' },

  // ── KayKit Platformer Pack ──
  { pattern: /^kaykit\/packs\/platformer\//, scale: 1.0, name: 'kaykit-platformer' },

  // ── KayKit Resource Pack ──
  { pattern: /^kaykit\/packs\/resource\//, scale: 1.0, name: 'kaykit-resource' },

  // ── KayKit Animations (skip — not props) ──
  { pattern: /^kaykit\/animations\//, skip: true, name: 'animation' },

  // ── Tiny Treats — all packs use scale 1.0 in VillageWorld ──
  { pattern: /^tiny-treats\//, scale: 1.0, name: 'tiny-treats' },

  // ── Poly Pizza ──
  // Crystals: 0.25 in zone (huge raw models ~15u)
  { pattern: /^poly-pizza\/nature\/crystal/, scale: 0.25, name: 'poly-pizza-crystal' },
  // Camping: 2.0 in zone
  { pattern: /^poly-pizza\/misc\/small-camping/, scale: 2.0, name: 'poly-pizza-camping' },
  // Animals: generally fine at 1.0 (varies by species)
  { pattern: /^poly-pizza\/animals\//, scale: 1.0, name: 'poly-pizza-animal' },
  // Food packs: generally 1.0
  { pattern: /^poly-pizza\/food\//, scale: 1.0, name: 'poly-pizza-food' },
  // Interior/furniture: 1.0
  { pattern: /^poly-pizza\/interior\//, scale: 1.0, name: 'poly-pizza-interior' },
  // Nature (non-crystal): 1.0
  { pattern: /^poly-pizza\/nature\//, scale: 1.0, name: 'poly-pizza-nature' },
  // Space: 1.0
  { pattern: /^poly-pizza\/space\//, scale: 1.0, name: 'poly-pizza-space' },
  // Fantasy: 1.0
  { pattern: /^poly-pizza\/fantasy\//, scale: 1.0, name: 'poly-pizza-fantasy' },
  // Seasonal: 1.0
  { pattern: /^poly-pizza\/seasonal\//, scale: 1.0, name: 'poly-pizza-seasonal' },
  // Platforms: 1.0
  { pattern: /^poly-pizza\/platforms\//, scale: 1.0, name: 'poly-pizza-platform' },
  // Vehicles: 1.0
  { pattern: /^poly-pizza\/vehicles\//, scale: 1.0, name: 'poly-pizza-vehicle' },
  // Misc: 1.0
  { pattern: /^poly-pizza\/misc\//, scale: 1.0, name: 'poly-pizza-misc' },

  // ── Quaternius ──
  // Mushrooms: ~1.8 in zone (small raw models ~0.5u)
  { pattern: /^quaternius\/nature\/Mushroom/, scale: 1.8, name: 'quaternius-mushroom' },
  // Rest of nature: 1.0
  { pattern: /^quaternius\/nature\//, scale: 1.0, name: 'quaternius-nature' },
  // Food: small models, need ~2.5x
  { pattern: /^quaternius\/food\//, scale: 2.5, name: 'quaternius-food' },
  // Japanese food: small, need ~2.0x
  { pattern: /^quaternius\/japanese-food\//, scale: 2.0, name: 'quaternius-japanese-food' },
  // Christmas decorations: varied, ~1.5
  { pattern: /^quaternius\/christmas\//, scale: 1.5, name: 'quaternius-christmas' },
  // Animals: 1.0
  { pattern: /^quaternius\/animals\//, scale: 1.0, name: 'quaternius-animal' },
  // Creatures: 1.0
  { pattern: /^quaternius\/creatures\//, scale: 1.0, name: 'quaternius-creature' },
  // Characters: 1.0
  { pattern: /^quaternius\/characters-extra\//, scale: 1.0, name: 'quaternius-character' },
  // Blocks: 1.0
  { pattern: /^quaternius\/blocks\//, scale: 1.0, name: 'quaternius-block' },
  // Decorations: 1.0
  { pattern: /^quaternius\/decorations\//, scale: 1.0, name: 'quaternius-decor' },
  // Fantasy: 1.0
  { pattern: /^quaternius\/fantasy\//, scale: 1.0, name: 'quaternius-fantasy' },
  // Game mechanics: 1.0
  { pattern: /^quaternius\/game-mechanics\//, scale: 1.0, name: 'quaternius-game' },
  // Items: 1.0
  { pattern: /^quaternius\/items\//, scale: 1.0, name: 'quaternius-item' },
  // Medieval props: 1.0
  { pattern: /^quaternius\/medieval-props\//, scale: 1.0, name: 'quaternius-medieval' },
  // Vehicles: 1.0
  { pattern: /^quaternius\/vehicles\//, scale: 1.0, name: 'quaternius-vehicle' },

  // ── Cartoon City ──
  { pattern: /^cartoon-city\//, scale: 1.0, name: 'cartoon-city' },

  // ── Living Room ──
  { pattern: /^living-room\//, scale: 1.0, name: 'living-room' },
]

/** Default fallback */
const DEFAULT_SCALE = { scale: 1.0, name: 'default' }

function categorize(modelPath) {
  for (const rule of PACK_SCALES) {
    if (rule.pattern.test(modelPath)) return rule
  }
  return DEFAULT_SCALE
}

async function run() {
  if (!fs.existsSync(DIMENSIONS_PATH)) {
    console.error(`Missing ${DIMENSIONS_PATH} — run measure-assets.mjs first`)
    process.exit(1)
  }

  const dimensions = JSON.parse(fs.readFileSync(DIMENSIONS_PATH, 'utf-8'))
  const totalModels = Object.keys(dimensions).length
  console.log(`Read ${totalModels} model dimensions`)

  // Assign scales
  const scales = {}
  const categoryStats = {}
  let skipped = 0
  let errors = 0

  for (const [modelPath, dims] of Object.entries(dimensions)) {
    if (dims.error) { errors++; continue }

    const rule = categorize(modelPath)

    if (rule.skip) { skipped++; continue }

    // Skip degenerate models (no geometry)
    if (dims.w === 0 && dims.h === 0 && dims.d === 0) { skipped++; continue }

    if (!categoryStats[rule.name]) {
      categoryStats[rule.name] = { count: 0, scale: rule.scale }
    }
    categoryStats[rule.name].count++

    scales[modelPath] = rule.scale
  }

  console.log(`\nCategory breakdown:`)
  for (const [name, stats] of Object.entries(categoryStats).sort((a, b) => b.count - a.count)) {
    console.log(`  ${name}: ${stats.count} models → scale ${stats.scale}`)
  }

  console.log(`\nTotal: ${Object.keys(scales).length} scales assigned, ${skipped} skipped, ${errors} errors`)

  // Generate TypeScript file
  const lines = [
    '/** Auto-generated scale values — run `node tests/generate-scales.mjs` to regenerate */',
    `// Generated from ${totalModels} model measurements on ${new Date().toISOString().split('T')[0]}`,
    '// Scale values derived from VillageWorld.tsx ground truth (pack-level factors)',
    '',
    'export const ASSET_SCALES: Record<string, number> = {',
  ]

  // Group by top-level directory for readability
  const grouped = {}
  for (const [modelPath, scale] of Object.entries(scales)) {
    const topDir = modelPath.split('/').slice(0, 2).join('/')
    if (!grouped[topDir]) grouped[topDir] = []
    grouped[topDir].push([modelPath, scale])
  }

  for (const [group, entries] of Object.entries(grouped).sort()) {
    // Only include groups that have non-1.0 scales
    const nonDefault = entries.filter(([, s]) => s !== 1.0)
    if (nonDefault.length === 0) continue

    lines.push(`  // ${group}`)
    for (const [modelPath, scale] of nonDefault.sort()) {
      const escapedPath = modelPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
      lines.push(`  '${escapedPath}': ${scale},`)
    }
  }

  lines.push('}')
  lines.push('')

  const tsContent = lines.join('\n')
  fs.writeFileSync(OUTPUT_PATH, tsContent)

  console.log(`\nGenerated: ${OUTPUT_PATH}`)
  console.log(`File size: ${(tsContent.length / 1024).toFixed(1)} KB`)
  console.log(`Entries (non-1.0): ${Object.values(scales).filter(s => s !== 1.0).length}`)
}

run().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
