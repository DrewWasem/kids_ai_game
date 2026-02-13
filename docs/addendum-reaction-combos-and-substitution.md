# Addendum: Reaction Combo System & Asset Substitution Engine

**Add this to the main Claude Code prompt as Section 2B — between the Mad Libs UI (Section 1) and the Vignette System (Section 2).**

---

## 2B. Pre-Built Action Combos, Substitution Engine & Dense Reactions

### The Animation Vocabulary

Every reaction is built from these 139 real animations. Here's how they map to **gameplay verbs** — the building blocks of every vignette:

```typescript
// ANIMATION → GAMEPLAY VERB MAPPING
// This is the rosetta stone. Every vignette step references a verb,
// and the engine resolves it to the actual animation clip.

const ANIMATION_VERBS = {
  // === EXPRESSIVE (the money animations — use these the MOST) ===
  celebrate:    'Cheering',           // Arms up, jumping — SUCCESS moment
  wave:         'Waving',             // Greeting, calling attention
  taunt:        'Skeletons_Taunt',    // Playful provocation, showing off
  taunt_long:   'Skeletons_Taunt_Longer', // Extended showboating
  die_dramatic: 'Death_A',           // Over-the-top pratfall — COMEDY GOLD
  die_flop:     'Death_B',           // Different death — variety in fails
  get_hit:      'Hit_A',             // React to impact — chain reactions
  get_bonked:   'Hit_B',             // Different hit react
  awaken:       'Skeletons_Awaken_Floor', // Surprise reveal from ground
  awaken_long:  'Skeletons_Awaken_Floor_Long', // Slow dramatic rise
  awaken_stand: 'Skeletons_Awaken_Standing', // Snap to attention
  resurrect:    'Skeletons_Death_Resurrect', // Come back from "death"
  
  // === INTERACTIONS (object-oriented actions) ===
  grab:         'PickUp',            // Pick something up
  throw:        'Throw',             // Throw something — PAIR with spawn
  use:          'Use_Item',          // Generic "use this thing"
  interact:     'Interact',          // Touch/activate something
  
  // === MOVEMENT (getting around the scene) ===
  walk:         'Walking_A',         // Normal walk
  walk_goofy:   'Walking_B',        // Different gait — comedy walks
  walk_swagger: 'Walking_C',        // Confident strut
  run:          'Running_A',         // Fast movement
  run_panic:    'Running_B',        // Different run — fleeing
  jump_big:     'Jump_Full_Long',    // Dramatic leap
  jump_small:   'Jump_Full_Short',   // Little hop
  jump_idle:    'Jump_Idle',         // Bouncing in place — excitement
  dodge_back:   'Dodge_Backward',    // Dodge away — reaction to chaos
  dodge_side:   'Dodge_Left',        // Sidestep — near miss comedy
  sneak:        'Sneaking',          // Tiptoeing — stealth comedy
  crawl:        'Crawling',          // On the ground — aftermath of chaos
  
  // === SITTING/LYING (scene-setting, aftermath) ===
  sit_down:     'Sit_Chair_Down',    // Take a seat
  sit_idle:     'Sit_Chair_Idle',    // Sitting calmly — contrast to chaos
  sit_floor:    'Sit_Floor_Down',    // Plop on ground — defeated
  lie_down:     'Lie_Down',          // Fall over — exhaustion/comedy
  lie_idle:     'Lie_Idle',          // Lying there — aftermath
  stand_up:     'Lie_StandUp',       // Get back up — recovery
  pushups:      'Push_Ups',          // Exercise — unexpected comedy
  situps:       'Sit_Ups',           // More exercise — absurdity
  
  // === WORK/TOOLS (activity-based comedy) ===
  chop:         'Chop',              // Single chop — food prep, destruction
  chopping:     'Chopping',          // Repeated chopping — frenzy
  dig:          'Dig',               // Single dig
  digging:      'Digging',           // Repeated digging — treasure, escape
  hammer:       'Hammer',            // Single hammer hit
  hammering:    'Hammering',         // Building frenzy
  saw:          'Saw',               // Cutting something
  fish_cast:    'Fishing_Cast',      // Cast a line — unexpected fishing
  fish_idle:    'Fishing_Idle',      // Waiting... comedy pause
  fish_struggle:'Fishing_Struggling',// Something BIG on the line
  fish_catch:   'Fishing_Catch',     // Reel it in — reveal moment
  lockpick:     'Lockpicking',       // Sneaky activity
  hold:         'Holding_A',         // Carrying something
  work:         'Working_A',         // Generic activity
  
  // === COMBAT (for slapstick, NOT violence) ===
  punch:        'Melee_Unarmed_Attack_Punch_A', // Slapstick punch
  kick:         'Melee_Unarmed_Attack_Kick',     // Slapstick kick
  sword_slash:  'Melee_1H_Attack_Slice_Horizontal', // Dramatic sword swing
  sword_chop:   'Melee_1H_Attack_Chop',   // Overhead dramatic chop
  spin_attack:  'Melee_2H_Attack_Spin',    // Spinning — comedy tornado
  block:        'Melee_Block',              // Shield up — defensive comedy
  block_hit:    'Melee_Block_Hit',          // Blocked! — deflection comedy
  
  // === MAGIC (spectacle animations) ===
  cast_spell:   'Ranged_Magic_Spellcasting',      // Magic casting — pair with particles
  cast_long:    'Ranged_Magic_Spellcasting_Long',  // Extended casting — buildup
  summon:       'Ranged_Magic_Summon',              // Summon something — BIG reveal
  magic_shoot:  'Ranged_Magic_Shoot',               // Projectile — pair with spawn
  magic_raise:  'Ranged_Magic_Raise',               // Raise hands — lifting objects
  bow_draw:     'Ranged_Bow_Draw',                  // Aiming — tension building
  bow_release:  'Ranged_Bow_Release',               // Release — launch moment
  
  // === ENTRANCES (how characters appear) ===
  spawn_air:    'Spawn_Air',         // Drop from sky
  spawn_ground: 'Spawn_Ground',      // Rise from ground
  skel_spawn:   'Skeletons_Spawn_Ground', // Skeleton-specific emerge
  skel_inactive:'Skeletons_Inactive_Floor_Pose', // Lying "dead" — pre-reveal
  
  // === IDLE VARIANTS (for background characters) ===
  idle:         'Idle_A',            // Default standing
  idle_alt:     'Idle_B',            // Slightly different standing
  skel_idle:    'Skeletons_Idle',    // Skeleton-specific idle
  skel_walk:    'Skeletons_Walking', // Skeleton-specific walk
  crouch:       'Crouching',         // Hiding/watching
} as const;
```

### Reaction Intensity Tiers

Every vignette has an **intensity tier** that determines density. This is NOT the prompt score — it's about spectacle:

```typescript
type ReactionTier = 'subtle' | 'moderate' | 'spectacular' | 'absolute_chaos';

const TIER_SPECS = {
  subtle: {
    // For "partial success" — things kinda work
    actorCount: [2, 4],        // 2-4 characters on screen
    propCount: [3, 6],         // 3-6 props spawned
    particleBursts: [1, 2],    // 1-2 particle effects
    cameraShakes: 0,           // No screen shake
    duration: [4, 6],          // 4-6 seconds
    chainReactions: 0,         // No chain reactions
  },
  moderate: {
    // For "success" — things work well
    actorCount: [3, 6],
    propCount: [6, 12],
    particleBursts: [2, 4],
    cameraShakes: [0, 1],
    duration: [6, 9],
    chainReactions: [1, 2],
  },
  spectacular: {
    // For "perfect" — nailed it
    actorCount: [5, 8],
    propCount: [10, 20],
    particleBursts: [4, 8],
    cameraShakes: [1, 3],
    duration: [8, 12],
    chainReactions: [2, 4],
  },
  absolute_chaos: {
    // For deliberately absurd combos — the FUNNIEST reactions
    actorCount: [6, 12],
    propCount: [15, 30],
    particleBursts: [6, 12],
    cameraShakes: [3, 6],
    duration: [10, 15],
    chainReactions: [4, 8],
  },
};
```

### The Asset Substitution Engine

This is critical. Claude generates creative option labels like "a burrito the size of a horse" but your library has medieval props. The substitution engine maps ANY concept to your actual assets.

```typescript
// ASSET SUBSTITUTION MAP
// Left side: semantic tags that Claude's options map to
// Right side: actual assets in your library + how to present them

interface AssetSub {
  primaryAsset: string;      // The main 3D model file to use
  fallbackAsset: string;     // If primary missing, use this
  scale?: number;            // Size multiplier (1.0 = normal)
  quantity?: number;         // Spawn multiple for "lots of X"
  spawnStyle: 'place' | 'drop' | 'rain' | 'explode_outward' | 'stack' | 'circle';
  particleOnSpawn?: string;  // Particle effect when it appears
}

const ASSET_SUBSTITUTIONS: Record<string, AssetSub> = {
  
  // ========== FOOD CATEGORY ==========
  // KayKit Restaurant Bits has: plates, bowls, pots, pans, cutting boards,
  // ingredients, cooked dishes, kitchen tools, counters, stoves
  // Quaternius has: bread, cheese, meat, vegetables, fruit, pies
  
  'cake': {
    primaryAsset: 'food_cake',           // If you have it
    fallbackAsset: 'food_pie',           // Quaternius pie as fallback
    scale: 1.2,
    spawnStyle: 'place',
    particleOnSpawn: 'sparkle',
  },
  'cake_giant': {
    primaryAsset: 'food_cake',
    fallbackAsset: 'food_pie',
    scale: 4.0,                          // HUGE version — comedy scale
    spawnStyle: 'drop',
    particleOnSpawn: 'explosion',
  },
  'pizza': {
    primaryAsset: 'food_pizza',
    fallbackAsset: 'food_plate_full',    // Plate of food as sub
    spawnStyle: 'place',
  },
  'pizza_rain': {
    primaryAsset: 'food_pizza',
    fallbackAsset: 'food_plate_full',
    quantity: 12,
    spawnStyle: 'rain',
    particleOnSpawn: 'confetti',
  },
  'feast': {
    primaryAsset: 'food_table_set',      // Table with food
    fallbackAsset: 'table_with_props',
    quantity: 4,
    spawnStyle: 'circle',
  },
  'soup': {
    primaryAsset: 'food_pot_full',       // KayKit pot
    fallbackAsset: 'food_bowl',
    spawnStyle: 'place',
    particleOnSpawn: 'steam',            // Steam particles
  },
  'bread': {
    primaryAsset: 'food_bread',          // Quaternius bread
    fallbackAsset: 'food_generic',
    spawnStyle: 'place',
  },
  'fruit': {
    primaryAsset: 'food_apple',
    fallbackAsset: 'food_generic',
    quantity: 6,
    spawnStyle: 'explode_outward',       // Fruit flies everywhere
  },

  // ========== FURNITURE / SCENE DRESSING ==========
  // KayKit Furniture Bits: chairs, tables, beds, shelves, barrels, crates
  // Quaternius Medieval Village: market stalls, wells, fences, wagons
  
  'table': {
    primaryAsset: 'furniture_table',
    fallbackAsset: 'crate_large',        // Crate as makeshift table
    spawnStyle: 'place',
  },
  'chair': {
    primaryAsset: 'furniture_chair',
    fallbackAsset: 'barrel',
    spawnStyle: 'place',
  },
  'throne': {
    primaryAsset: 'furniture_throne',
    fallbackAsset: 'furniture_chair',
    scale: 1.5,
    spawnStyle: 'drop',
    particleOnSpawn: 'sparkle',
  },
  'bed': {
    primaryAsset: 'furniture_bed',
    fallbackAsset: 'hay_pile',
    spawnStyle: 'place',
  },
  'barrel': {
    primaryAsset: 'barrel',
    fallbackAsset: 'crate',
    spawnStyle: 'place',
  },
  'barrel_stack': {
    primaryAsset: 'barrel',
    fallbackAsset: 'crate',
    quantity: 8,
    spawnStyle: 'stack',
  },
  'market_stall': {
    primaryAsset: 'market_stall',
    fallbackAsset: 'table_with_canopy',
    spawnStyle: 'place',
  },
  
  // ========== DECORATIONS / PARTY ==========
  // KayKit Holiday Bits: presents, trees, ornaments, lights
  // KayKit Halloween: pumpkins, gravestones, cobwebs, candles
  
  'banner': {
    primaryAsset: 'decoration_banner',
    fallbackAsset: 'flag',
    spawnStyle: 'drop',
  },
  'balloons': {
    primaryAsset: 'decoration_balloon',
    fallbackAsset: 'lantern',            // Floating lantern as sub
    quantity: 8,
    spawnStyle: 'explode_outward',
    particleOnSpawn: 'confetti',
  },
  'presents': {
    primaryAsset: 'holiday_present',     // KayKit Holiday
    fallbackAsset: 'crate_small',        // Small crate as wrapped box
    quantity: 6,
    spawnStyle: 'rain',
    particleOnSpawn: 'sparkle',
  },
  'candles': {
    primaryAsset: 'candle',
    fallbackAsset: 'torch',
    quantity: 10,
    spawnStyle: 'circle',
    particleOnSpawn: 'fire',
  },
  'pumpkins': {
    primaryAsset: 'halloween_pumpkin',
    fallbackAsset: 'barrel_small',       // Round barrel = pumpkin-ish
    quantity: 5,
    spawnStyle: 'place',
  },
  'confetti': {
    primaryAsset: null,                  // Pure particle effect, no model
    fallbackAsset: null,
    spawnStyle: 'rain',
    particleOnSpawn: 'confetti',
  },
  
  // ========== WEAPONS / TOOLS (for slapstick, not violence) ==========
  // Quaternius Fantasy Props: swords, shields, axes, staffs, bows
  // KayKit RPG Tools: pickaxes, shovels, hammers, fishing rods
  
  'sword': {
    primaryAsset: 'weapon_sword',
    fallbackAsset: 'tool_stick',
    spawnStyle: 'drop',
    particleOnSpawn: 'sparkle',
  },
  'magic_staff': {
    primaryAsset: 'weapon_staff',
    fallbackAsset: 'tool_stick',
    spawnStyle: 'place',
    particleOnSpawn: 'magic',
  },
  'shield': {
    primaryAsset: 'weapon_shield',
    fallbackAsset: 'lid_pot',            // Pot lid = comedy shield
    spawnStyle: 'place',
  },
  'potion': {
    primaryAsset: 'potion_bottle',       // Quaternius potions
    fallbackAsset: 'bottle',
    spawnStyle: 'place',
    particleOnSpawn: 'magic',
  },
  'potion_explosion': {
    primaryAsset: 'potion_bottle',
    fallbackAsset: 'bottle',
    spawnStyle: 'place',
    particleOnSpawn: 'explosion',
  },
  
  // ========== NATURE / OUTDOOR ==========
  // KayKit Forest Nature: trees, bushes, rocks, mushrooms, flowers, logs
  // Quaternius Stylized Nature: more trees, grass, water features
  
  'tree': {
    primaryAsset: 'nature_tree',
    fallbackAsset: 'nature_bush_large',
    spawnStyle: 'place',
  },
  'flowers': {
    primaryAsset: 'nature_flower',
    fallbackAsset: 'nature_bush_small',
    quantity: 8,
    spawnStyle: 'circle',
    particleOnSpawn: 'hearts',
  },
  'mushroom': {
    primaryAsset: 'nature_mushroom',
    fallbackAsset: 'nature_rock_small',
    spawnStyle: 'place',
  },
  'mushroom_giant': {
    primaryAsset: 'nature_mushroom',
    fallbackAsset: 'nature_rock_small',
    scale: 5.0,
    spawnStyle: 'drop',
    particleOnSpawn: 'explosion',
  },
  'rock': {
    primaryAsset: 'nature_rock',
    fallbackAsset: 'crate',
    spawnStyle: 'drop',
  },
  'boulder_rain': {
    primaryAsset: 'nature_rock',
    fallbackAsset: 'barrel',
    quantity: 6,
    spawnStyle: 'rain',
    particleOnSpawn: 'dust',
  },

  // ========== TREASURE / MAGIC ==========
  // Quaternius: chests, coins, gems, crystal balls, scrolls, books
  
  'treasure_chest': {
    primaryAsset: 'chest',
    fallbackAsset: 'crate',
    spawnStyle: 'place',
    particleOnSpawn: 'sparkle',
  },
  'gold_coins': {
    primaryAsset: 'coins',
    fallbackAsset: 'gem',
    quantity: 20,
    spawnStyle: 'explode_outward',
    particleOnSpawn: 'sparkle',
  },
  'crystal_ball': {
    primaryAsset: 'magic_orb',
    fallbackAsset: 'potion_bottle',
    spawnStyle: 'place',
    particleOnSpawn: 'magic',
  },
  'spell_circle': {
    primaryAsset: null,                  // Pure effect
    fallbackAsset: null,
    spawnStyle: 'place',
    particleOnSpawn: 'magic_circle',
  },
  'books': {
    primaryAsset: 'book',
    fallbackAsset: 'scroll',
    quantity: 6,
    spawnStyle: 'rain',
  },

  // ========== DUNGEON ==========
  // KayKit Dungeon: torches, chains, gates, pillars, skulls, bones, cobwebs
  
  'bones': {
    primaryAsset: 'dungeon_bones',
    fallbackAsset: 'tool_stick',
    quantity: 8,
    spawnStyle: 'explode_outward',
  },
  'skull': {
    primaryAsset: 'dungeon_skull',
    fallbackAsset: 'nature_rock_small',
    spawnStyle: 'place',
  },
  'torch': {
    primaryAsset: 'dungeon_torch',
    fallbackAsset: 'candle',
    spawnStyle: 'place',
    particleOnSpawn: 'fire',
  },
  'cobweb': {
    primaryAsset: 'dungeon_cobweb',
    fallbackAsset: null,                 // Skip if missing — decorative only
    spawnStyle: 'place',
  },

  // ========== WILDCARD / ABSURD (for chaotic combos) ==========
  // When Claude generates something not in any category, use these
  
  'mystery_box': {
    primaryAsset: 'crate',
    fallbackAsset: 'barrel',
    spawnStyle: 'drop',
    particleOnSpawn: 'sparkle',
  },
  'explosion': {
    primaryAsset: null,
    fallbackAsset: null,
    spawnStyle: 'place',
    particleOnSpawn: 'explosion',
  },
  'question_mark': {
    primaryAsset: null,
    fallbackAsset: null,
    spawnStyle: 'place',
    particleOnSpawn: 'sparkle',
  },
};
```

### The Substitution Resolution Function

```typescript
/**
 * Resolves a semantic asset tag to an actual spawnable asset.
 * CRITICAL: This must NEVER fail. Every tag must produce SOMETHING.
 */
function resolveAsset(tag: string): ResolvedAsset {
  // 1. Direct match
  if (ASSET_SUBSTITUTIONS[tag]) {
    const sub = ASSET_SUBSTITUTIONS[tag];
    const asset = assetExists(sub.primaryAsset) 
      ? sub.primaryAsset 
      : sub.fallbackAsset;
    
    // If even the fallback doesn't exist, use mystery_box
    if (!asset || !assetExists(asset)) {
      return resolveAsset('mystery_box');
    }
    return { ...sub, resolvedAsset: asset };
  }
  
  // 2. Fuzzy match — check if tag contains a known category word
  const FUZZY_MAP: Record<string, string> = {
    'food': 'feast',
    'eat': 'bread', 
    'drink': 'potion',
    'weapon': 'sword',
    'magic': 'spell_circle',
    'nature': 'tree',
    'plant': 'flowers',
    'animal': 'mystery_box',     // No animals in library — use crate + emote
    'music': 'mystery_box',      // No instruments — use crate + sound effect
    'fire': 'torch',
    'water': 'potion',           // Potion bottle = water container
    'treasure': 'treasure_chest',
    'scary': 'skull',
    'party': 'balloons',
    'gift': 'presents',
    'light': 'candles',
    'dark': 'cobweb',
    'build': 'crate',
    'destroy': 'explosion',
    'fly': 'mystery_box',        // Can't fly — use spawn_air entrance
  };
  
  for (const [keyword, mappedTag] of Object.entries(FUZZY_MAP)) {
    if (tag.toLowerCase().includes(keyword)) {
      return resolveAsset(mappedTag);
    }
  }
  
  // 3. Ultimate fallback — a crate with sparkle (works for literally anything)
  console.warn(`No asset match for tag: "${tag}", using mystery_box`);
  return resolveAsset('mystery_box');
}
```

### Pre-Built Vignette Combos — Skeleton Birthday Quest

Here are **complete, authored vignettes** for Stage 1 of Skeleton Birthday. These use the real animation names and real asset tags.

**Template:** `"Plan a party with ___(FOOD) and ___(ENTERTAINMENT) for a ___(VIBE) birthday"`

**Slot definitions:**
```typescript
const SKELETON_BIRTHDAY_STAGE_1 = {
  slots: [
    {
      id: 'FOOD',
      allowedTags: ['cake', 'pizza', 'feast', 'soup', 'fruit', 'bread'],
    },
    {
      id: 'ENTERTAINMENT', 
      allowedTags: ['magic_show', 'music', 'combat_show', 'dance', 'game', 'fireworks'],
    },
    {
      id: 'VIBE',
      allowedTags: ['spooky', 'fancy', 'wild', 'chill', 'epic', 'silly'],
    },
  ],
};
```

#### VIGNETTE 1: cake + magic_show + spooky (PERFECT — teaches specificity)

```typescript
{
  id: 'skel_bday_1_perfect_a',
  trigger: { food: 'cake', entertainment: 'magic_show', vibe: 'spooky' },
  tier: 'spectacular',
  promptScore: 'perfect',
  steps: [
    // --- SCENE SETUP (0-2s) ---
    {
      parallel: [
        { action: 'spawn', asset: 'table', position: 'center', anim: null },
        { action: 'spawn', asset: 'candles', position: 'around_center', anim: null },
        { action: 'sfx', sound: 'ambient_spooky' },
      ],
      delayAfter: 0.5,
    },
    {
      parallel: [
        { action: 'spawn_character', character: 'skeleton', position: 'center', anim: 'skel_spawn' },
        { action: 'react', effect: 'dust', position: 'center' },
        { action: 'sfx', sound: 'bone_rattle' },
      ],
      delayAfter: 0.8,
    },
    // Skeleton looks around excitedly
    {
      parallel: [
        { action: 'animate', character: 'skeleton', anim: 'taunt' }, // Showing off
        { action: 'emote', character: 'skeleton', text: '🎂 !!!' },
      ],
      delayAfter: 0.5,
    },
    
    // --- GUESTS ARRIVE (2-4s) ---
    {
      parallel: [
        { action: 'spawn_character', character: 'skeleton_2', position: 'left_far', anim: 'spawn_air' },
        { action: 'spawn_character', character: 'skeleton_3', position: 'right_far', anim: 'spawn_air' },
        { action: 'spawn_character', character: 'skeleton_4', position: 'left_mid', anim: 'spawn_ground' },
        { action: 'sfx', sound: 'pop_multi' },
        { action: 'react', effect: 'sparkle', position: 'wide' },
      ],
      delayAfter: 0.5,
    },
    // Guests wave
    {
      parallel: [
        { action: 'animate', character: 'skeleton_2', anim: 'wave' },
        { action: 'animate', character: 'skeleton_3', anim: 'wave' },
        { action: 'animate', character: 'skeleton_4', anim: 'celebrate' },
        { action: 'emote', character: 'skeleton_2', text: '👋' },
      ],
      delayAfter: 0.6,
    },
    
    // --- WIZARD ENTERS (4-6s) ---
    {
      parallel: [
        { action: 'spawn_character', character: 'mage', position: 'right_far', anim: 'spawn_air' },
        { action: 'react', effect: 'magic', position: 'right_far' },
        { action: 'sfx', sound: 'magic_whoosh' },
        { action: 'camera_zoom', target: 'right', speed: 'fast' },
      ],
      delayAfter: 0.4,
    },
    // Wizard walks dramatically to center
    {
      parallel: [
        { action: 'move', character: 'mage', to: 'center_front', style: 'walk_swagger' },
        { action: 'spawn', asset: 'magic_staff', attachTo: 'mage' },
      ],
      delayAfter: 1.0,
    },
    // THE MAGIC SHOW
    {
      parallel: [
        { action: 'animate', character: 'mage', anim: 'cast_long' },
        { action: 'react', effect: 'magic_circle', position: 'center' },
        { action: 'sfx', sound: 'magic_charge' },
        { action: 'camera_shake', intensity: 0.3, duration: 1.5 },
      ],
      delayAfter: 1.5,
    },
    
    // --- CAKE APPEARS (6-8s) --- THE BIG MOMENT
    {
      parallel: [
        { action: 'spawn', asset: 'cake_giant', position: 'center_table', },
        { action: 'react', effect: 'explosion', position: 'center' },
        { action: 'react', effect: 'sparkle', position: 'wide' },
        { action: 'sfx', sound: 'magic_reveal' },
        { action: 'camera_shake', intensity: 0.6, duration: 0.5 },
        { action: 'screen_flash', color: 'white', duration: 0.2 },
        { action: 'text_popup', text: '✨ MAGIC CAKE! ✨', position: 'top', size: 'large' },
      ],
      delayAfter: 0.3,
    },
    // Everyone reacts
    {
      parallel: [
        { action: 'crowd_react', characters: ['skeleton', 'skeleton_2', 'skeleton_3', 'skeleton_4'], anim: 'celebrate' },
        { action: 'animate', character: 'mage', anim: 'taunt' }, // Takes a bow
        { action: 'sfx', sound: 'crowd_cheer' },
        { action: 'react', effect: 'confetti', position: 'wide' },
      ],
      delayAfter: 0.8,
    },
    
    // --- SPOOKY FINALE (8-10s) ---
    // Candles flare up
    {
      parallel: [
        { action: 'react', effect: 'fire', position: 'around_center' },
        { action: 'sfx', sound: 'fire_whoosh' },
        { action: 'spawn', asset: 'skull', position: 'on_cake', scale: 0.5 }, // Skull cake topper!
      ],
      delayAfter: 0.5,
    },
    // Ghost lights float up
    {
      parallel: [
        { action: 'spawn', asset: 'candles', position: 'sky', spawnStyle: 'float_up' },
        { action: 'react', effect: 'sparkle', position: 'wide' },
        { action: 'sfx', sound: 'ghost_whooo' },
      ],
      delayAfter: 0.5,
    },
    // Birthday skeleton blows out candles (interact animation)
    {
      parallel: [
        { action: 'animate', character: 'skeleton', anim: 'interact' }, // "Blowing out"
        { action: 'react', effect: 'smoke', position: 'center' },
        { action: 'sfx', sound: 'blow_candles' },
      ],
      delayAfter: 0.5,
    },
    // FINAL MOMENT — everyone cheers, confetti, banner
    {
      parallel: [
        { action: 'spawn', asset: 'banner', position: 'top_center' },
        { action: 'text_popup', text: '🎉 HAPPY BONE-DAY! 🎉', position: 'center', size: 'huge' },
        { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
        { action: 'react', effect: 'confetti', position: 'wide' },
        { action: 'react', effect: 'hearts', position: 'wide' },
        { action: 'react', effect: 'stars', position: 'wide' },
        { action: 'sfx', sound: 'victory_fanfare' },
        { action: 'camera_zoom', target: 'out_wide', speed: 'slow' },
      ],
      delayAfter: 2.0,
    },
  ],
  feedback: {
    title: '🌟 PERFECT PARTY!',
    message: "You planned an amazing spooky birthday! You said WHAT food (magic cake), WHAT entertainment (a magic show), and WHAT vibe (spooky). When you're specific about all the details, everything comes together perfectly!",
    skillTaught: 'Specificity',
    tip: "Great prompts answer WHO, WHAT, WHERE, and HOW — you nailed it!",
  },
}
```

#### VIGNETTE 2: pizza + music + wild (CHAOTIC — absurd combo, funniest reaction)

```typescript
{
  id: 'skel_bday_1_chaos_a',
  trigger: { food: 'pizza', entertainment: 'music', vibe: 'wild' },
  tier: 'absolute_chaos',
  promptScore: 'chaotic',
  steps: [
    // Skeleton spawns already mid-party
    {
      parallel: [
        { action: 'spawn_character', character: 'skeleton', position: 'center', anim: 'jump_idle' },
        { action: 'sfx', sound: 'party_horn' },
        { action: 'emote', character: 'skeleton', text: '🤘 PARTY!!!' },
      ],
      delayAfter: 0.3,
    },
    // PIZZA RAIN IMMEDIATELY
    {
      parallel: [
        { action: 'spawn', asset: 'pizza_rain', position: 'sky_wide' },
        { action: 'sfx', sound: 'whoosh_multi' },
        { action: 'camera_shake', intensity: 0.4, duration: 2.0 },
        { action: 'text_popup', text: '🍕 PIZZA STORM! 🍕', position: 'top', size: 'huge' },
      ],
      delayAfter: 0.5,
    },
    // Skeleton gets bonked by pizza
    {
      parallel: [
        { action: 'animate', character: 'skeleton', anim: 'get_hit' },
        { action: 'sfx', sound: 'splat' },
        { action: 'react', effect: 'stars', position: 'center' },
        { action: 'emote', character: 'skeleton', text: '😵' },
      ],
      delayAfter: 0.4,
    },
    // MORE skeletons spawn, already in chaos
    {
      parallel: [
        { action: 'spawn_character', character: 'skeleton_2', position: 'left', anim: 'spawn_air' },
        { action: 'spawn_character', character: 'skeleton_3', position: 'right', anim: 'spawn_air' },
        { action: 'spawn_character', character: 'skeleton_4', position: 'back_left', anim: 'skel_spawn' },
        { action: 'spawn_character', character: 'skeleton_5', position: 'back_right', anim: 'skel_spawn' },
        { action: 'sfx', sound: 'bone_rattle_multi' },
      ],
      delayAfter: 0.3,
    },
    // They all start "dancing" (using combat animations as dance = FUNNY)
    {
      parallel: [
        { action: 'animate', character: 'skeleton', anim: 'spin_attack' },  // Spinning = dancing
        { action: 'animate', character: 'skeleton_2', anim: 'kick' },       // Kick dancing
        { action: 'animate', character: 'skeleton_3', anim: 'jump_idle' },  // Bouncing
        { action: 'animate', character: 'skeleton_4', anim: 'pushups' },    // Breakdancing??
        { action: 'animate', character: 'skeleton_5', anim: 'dodge_side' }, // Side-to-side
        { action: 'sfx', sound: 'music_wild' },
        { action: 'react', effect: 'confetti', position: 'wide' },
      ],
      delayAfter: 1.5,
    },
    // Someone throws a barrel
    {
      parallel: [
        { action: 'animate', character: 'skeleton_2', anim: 'throw' },
        { action: 'spawn', asset: 'barrel', position: 'center', spawnStyle: 'drop' },
        { action: 'sfx', sound: 'whoosh' },
      ],
      delayAfter: 0.3,
    },
    // Barrel crashes, everything scatters
    {
      parallel: [
        { action: 'react', effect: 'explosion', position: 'center' },
        { action: 'camera_shake', intensity: 0.8, duration: 0.5 },
        { action: 'sfx', sound: 'crash' },
        { action: 'spawn', asset: 'bones', position: 'center' }, // Bones fly everywhere
        { action: 'crowd_react', characters: ['skeleton_3', 'skeleton_4', 'skeleton_5'], anim: 'dodge_back' },
        { action: 'screen_flash', color: 'orange', duration: 0.15 },
      ],
      delayAfter: 0.3,
    },
    // Table gets flipped
    {
      parallel: [
        { action: 'spawn', asset: 'table', position: 'center', rotation: 'flipped' },
        { action: 'animate', character: 'skeleton', anim: 'kick' }, // KICKED the table
        { action: 'spawn', asset: 'pizza', position: 'scatter_wide', quantity: 5 },
        { action: 'sfx', sound: 'crash_wood' },
      ],
      delayAfter: 0.5,
    },
    // DRAMATIC PAUSE — skeleton stands amid chaos
    {
      parallel: [
        { action: 'animate', character: 'skeleton', anim: 'taunt_long' }, // Proud of the mess
        { action: 'animate', character: 'skeleton_2', anim: 'lie_idle' }, // On the ground
        { action: 'animate', character: 'skeleton_3', anim: 'crawl' },   // Crawling away
        { action: 'animate', character: 'skeleton_4', anim: 'sit_floor' }, // Sitting dazed
        { action: 'animate', character: 'skeleton_5', anim: 'die_dramatic' }, // Playing dead
        { action: 'sfx', sound: 'cricket' }, // Silence...
      ],
      delayAfter: 1.0, // THE COMEDY BEAT — let it sit
    },
    // Then one more pizza falls from the sky and bonks the last standing skeleton
    {
      parallel: [
        { action: 'spawn', asset: 'pizza', position: 'on_skeleton', spawnStyle: 'drop' },
        { action: 'animate', character: 'skeleton', anim: 'die_flop' },
        { action: 'sfx', sound: 'splat' },
        { action: 'camera_shake', intensity: 0.3, duration: 0.3 },
      ],
      delayAfter: 0.5,
    },
    // FINAL: text popup over the wreckage
    {
      parallel: [
        { action: 'text_popup', text: '🍕 BEST. PARTY. EVER. 🍕', position: 'center', size: 'huge' },
        { action: 'react', effect: 'confetti', position: 'wide' },
        { action: 'sfx', sound: 'party_horn' },
        { action: 'camera_zoom', target: 'out_wide', speed: 'slow' },
      ],
      delayAfter: 2.0,
    },
  ],
  feedback: {
    title: '🌪️ TOTAL CHAOS!',
    message: "Well... that was WILD! Pizza rain + wild music = absolute madness. Your choices were fun but didn't work TOGETHER — that's why the party went bonkers! Great prompts pick details that match each other.",
    skillTaught: 'Specificity',
    tip: "Try picking a food and entertainment that go together — like cake + magic show. Matching details = better results!",
  },
}
```

#### VIGNETTE 3: [any food] + [any entertainment] + [missing/default vibe] (PARTIAL — missing detail)

```typescript
{
  id: 'skel_bday_1_partial_no_vibe',
  // Matches when vibe slot is left on default or is generic
  trigger: { food: '*', entertainment: '*', vibe: 'default' },
  tier: 'subtle',
  promptScore: 'partial',
  steps: [
    // Skeleton appears, looks around confused
    {
      parallel: [
        { action: 'spawn_character', character: 'skeleton', position: 'center', anim: 'skel_spawn' },
        { action: 'sfx', sound: 'bone_rattle' },
      ],
      delayAfter: 0.8,
    },
    // Food shows up (whatever they picked)
    {
      parallel: [
        { action: 'spawn', asset: '{FOOD_TAG}', position: 'center_table' }, // Dynamic from selection
        { action: 'spawn', asset: 'table', position: 'center' },
        { action: 'sfx', sound: 'pop' },
      ],
      delayAfter: 0.5,
    },
    // Entertainment shows up but... it's awkward
    {
      parallel: [
        { action: 'spawn_character', character: 'entertainer', position: 'right', anim: 'idle' },
        { action: 'emote', character: 'entertainer', text: '🤷' },
        { action: 'sfx', sound: 'cricket' },
      ],
      delayAfter: 1.0,
    },
    // Skeleton looks at food, looks at entertainer, shrugs
    {
      parallel: [
        { action: 'animate', character: 'skeleton', anim: 'idle_alt' },
        { action: 'emote', character: 'skeleton', text: 'What kind of party is this...?' },
      ],
      delayAfter: 1.5,
    },
    // One sad balloon
    {
      parallel: [
        { action: 'spawn', asset: 'balloons', position: 'center', quantity: 1 },
        { action: 'sfx', sound: 'deflate' },
        { action: 'text_popup', text: '🎈 ...', position: 'top', size: 'small' },
      ],
      delayAfter: 1.0,
    },
    // Skeleton sits down, mildly content
    {
      parallel: [
        { action: 'animate', character: 'skeleton', anim: 'sit_down' },
        { action: 'emote', character: 'skeleton', text: "It's... fine I guess 💀" },
        { action: 'react', effect: 'sparkle', position: 'center' }, // Small sparkle
      ],
      delayAfter: 2.0,
    },
  ],
  feedback: {
    title: '😐 Almost a Party...',
    message: "The food and entertainment showed up, but without a VIBE, nobody knew how to act! Was it supposed to be spooky? Fancy? Wild? The missing detail made the whole party feel confused.",
    skillTaught: 'Specificity',
    tip: "Every detail matters! Try filling in ALL the blanks — especially the vibe. It ties everything together!",
  },
}
```

### Tag-Based Vignette Matching (Combo Resolution)

You don't need a unique vignette for every possible combination. Here's the priority system:

```typescript
function resolveVignette(
  selectedTags: { food: string; entertainment: string; vibe: string },
  stageVignettes: Vignette[]
): Vignette {
  
  // Priority 1: EXACT match (all 3 tags) — best, most specific reaction
  const exact = stageVignettes.find(v => 
    v.trigger.food === selectedTags.food &&
    v.trigger.entertainment === selectedTags.entertainment &&
    v.trigger.vibe === selectedTags.vibe
  );
  if (exact) return exact;
  
  // Priority 2: PAIR match (2 of 3 tags match) — good, semi-specific
  const pairMatches = stageVignettes.filter(v => {
    let matchCount = 0;
    if (v.trigger.food === selectedTags.food || v.trigger.food === '*') matchCount++;
    if (v.trigger.entertainment === selectedTags.entertainment || v.trigger.entertainment === '*') matchCount++;
    if (v.trigger.vibe === selectedTags.vibe || v.trigger.vibe === '*') matchCount++;
    return matchCount >= 2;
  });
  if (pairMatches.length > 0) return pickRandom(pairMatches);
  
  // Priority 3: VIBE match — at minimum, match the overall energy
  const vibeMatch = stageVignettes.find(v => 
    v.trigger.vibe === selectedTags.vibe && v.trigger.food === '*' && v.trigger.entertainment === '*'
  );
  if (vibeMatch) return vibeMatch;
  
  // Priority 4: CATEGORY match — "any food + magic + any vibe"
  const categoryMatch = stageVignettes.find(v =>
    (v.trigger.food === '*' || v.trigger.food === selectedTags.food) &&
    (v.trigger.entertainment === '*' || v.trigger.entertainment === selectedTags.entertainment)
  );
  if (categoryMatch) return categoryMatch;
  
  // Priority 5: DEFAULT — always exists, always works
  return stageVignettes.find(v => v.id.includes('default'))!;
}
```

### How Many Vignettes Per Stage?

With this matching system, here's the efficient coverage:

```
Per quest stage (3 slots × ~5 tags each = ~125 possible combos):

  4-6 EXACT match vignettes  — The "golden path" combos (spectacular/perfect)
  3-4 PAIR match vignettes   — Common fun combos (moderate/chaotic)
  2-3 VIBE match vignettes   — Catch-all per vibe (spooky, wild, chill, etc.)
  1-2 CATEGORY match vignettes — "any + magic + any", "any + music + any"
  1   DEFAULT vignette        — Funny fallback that works for everything
  ─────────────────────────
  ~12-16 vignettes per stage
  ~36-48 vignettes per quest (3 stages)
  
  For MVP (hackathon): 
  - 2-3 quests fully authored = ~100-150 total vignettes
  - Remaining quests get 5-6 each with heavy wildcard use = ~30 more
  - Grand total: ~130-180 vignettes
```

### Comedy Animation Combos (Reusable Micro-Sequences)

These are **pre-built 2-4 step sequences** that can be dropped into any vignette as building blocks. Think of them as comedy "words" you assemble into "sentences":

```typescript
const COMEDY_COMBOS = {
  
  // --- SLAPSTICK ---
  'bonk_and_fall': [
    { action: 'animate', character: '{TARGET}', anim: 'get_hit' },
    { action: 'sfx', sound: 'bonk' },
    { action: 'react', effect: 'stars', position: '{TARGET}' },
    // beat
    { action: 'animate', character: '{TARGET}', anim: 'die_dramatic' },
    { action: 'sfx', sound: 'slide_whistle_down' },
  ],
  
  'throw_and_miss': [
    { action: 'animate', character: '{THROWER}', anim: 'throw' },
    { action: 'spawn', asset: '{PROJECTILE}', position: '{THROWER}', moveTo: 'offscreen_right' },
    { action: 'sfx', sound: 'whoosh' },
    // beat
    { action: 'sfx', sound: 'crash_offscreen' },
    { action: 'emote', character: '{THROWER}', text: '😬' },
  ],
  
  'throw_and_hit': [
    { action: 'animate', character: '{THROWER}', anim: 'throw' },
    { action: 'spawn', asset: '{PROJECTILE}', position: '{THROWER}', moveTo: '{TARGET}' },
    { action: 'sfx', sound: 'whoosh' },
    { action: 'animate', character: '{TARGET}', anim: 'get_bonked' },
    { action: 'sfx', sound: 'splat' },
    { action: 'react', effect: 'stars', position: '{TARGET}' },
  ],

  'pratfall': [
    { action: 'animate', character: '{TARGET}', anim: 'walk' },
    // trips
    { action: 'animate', character: '{TARGET}', anim: 'die_flop' },
    { action: 'sfx', sound: 'trip_and_fall' },
    { action: 'react', effect: 'dust', position: '{TARGET}' },
    // beat
    { action: 'emote', character: '{TARGET}', text: '😵‍💫' },
  ],
  
  'dramatic_entrance': [
    { action: 'sfx', sound: 'dramatic_sting' },
    { action: 'screen_flash', color: 'white', duration: 0.15 },
    { action: 'spawn_character', character: '{CHARACTER}', position: '{POSITION}', anim: 'spawn_air' },
    { action: 'camera_zoom', target: '{POSITION}', speed: 'fast' },
    { action: 'react', effect: 'sparkle', position: '{POSITION}' },
    { action: 'animate', character: '{CHARACTER}', anim: 'taunt' },
  ],

  // --- MAGIC MISHAPS ---
  'spell_backfire': [
    { action: 'animate', character: '{CASTER}', anim: 'cast_long' },
    { action: 'react', effect: 'magic_circle', position: '{CASTER}' },
    { action: 'sfx', sound: 'magic_charge' },
    // beat — building tension
    { action: 'react', effect: 'explosion', position: '{CASTER}' },
    { action: 'animate', character: '{CASTER}', anim: 'get_hit' },
    { action: 'camera_shake', intensity: 0.5, duration: 0.5 },
    { action: 'sfx', sound: 'explosion_comedy' },
    { action: 'emote', character: '{CASTER}', text: '💫' },
  ],
  
  'spell_success': [
    { action: 'animate', character: '{CASTER}', anim: 'cast_long' },
    { action: 'react', effect: 'magic_circle', position: 'center' },
    { action: 'sfx', sound: 'magic_charge' },
    { action: 'animate', character: '{CASTER}', anim: 'summon' },
    { action: 'spawn', asset: '{SUMMONED}', position: 'center' },
    { action: 'react', effect: 'sparkle', position: 'center' },
    { action: 'sfx', sound: 'magic_reveal' },
    { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
  ],
  
  'potion_drink': [
    { action: 'spawn', asset: 'potion', position: '{CHARACTER}' },
    { action: 'animate', character: '{CHARACTER}', anim: 'use' },
    { action: 'sfx', sound: 'gulp' },
    // beat — what will happen?
    { action: 'animate', character: '{CHARACTER}', anim: '{RESULT_ANIM}' }, // grow, shrink, spin, etc
    { action: 'react', effect: '{RESULT_EFFECT}', position: '{CHARACTER}' },
  ],

  // --- CROWD REACTIONS (use for background characters) ---
  'crowd_cheer': [
    { action: 'crowd_react', characters: 'all_background', anim: 'celebrate' },
    { action: 'sfx', sound: 'crowd_cheer' },
    { action: 'react', effect: 'confetti', position: 'wide' },
  ],
  
  'crowd_gasp': [
    { action: 'crowd_react', characters: 'all_background', anim: 'dodge_back' },
    { action: 'sfx', sound: 'crowd_gasp' },
  ],
  
  'crowd_scatter': [
    { action: 'crowd_react', characters: 'all_background', anim: 'run_panic' },
    { action: 'sfx', sound: 'scramble' },
  ],
  
  'crowd_faint': [
    { action: 'crowd_react', characters: 'all_background', anim: 'die_dramatic' },
    { action: 'sfx', sound: 'thud_multi' },
  ],

  // --- OBJECT COMEDY ---
  'object_rain': [
    { action: 'spawn', asset: '{OBJECT}', position: 'sky_wide', spawnStyle: 'rain', quantity: '{COUNT}' },
    { action: 'sfx', sound: 'whoosh_multi' },
    { action: 'camera_shake', intensity: 0.4, duration: 2.0 },
    { action: 'text_popup', text: '{RAIN_TEXT}', position: 'top', size: 'huge' },
  ],
  
  'object_tower': [
    { action: 'spawn', asset: '{OBJECT}', position: 'center', spawnStyle: 'stack', quantity: '{COUNT}' },
    { action: 'sfx', sound: 'stack_build' },
    // beat — tower wobbles
    { action: 'camera_shake', intensity: 0.2, duration: 0.5 },
    // CRASH
    { action: 'spawn', asset: '{OBJECT}', position: 'scatter_wide', quantity: '{COUNT}' },
    { action: 'react', effect: 'dust', position: 'center' },
    { action: 'sfx', sound: 'crash_big' },
    { action: 'camera_shake', intensity: 0.7, duration: 0.5 },
  ],

  'surprise_in_chest': [
    { action: 'spawn', asset: 'treasure_chest', position: '{POSITION}' },
    { action: 'sfx', sound: 'creak' },
    // beat
    { action: 'animate', character: '{CHARACTER}', anim: 'interact' },
    { action: 'react', effect: 'sparkle', position: '{POSITION}' },
    // REVEAL
    { action: 'spawn', asset: '{SURPRISE}', position: '{POSITION}', spawnStyle: 'explode_outward' },
    { action: 'sfx', sound: 'surprise_reveal' },
    { action: 'screen_flash', color: 'gold', duration: 0.2 },
  ],

  // --- FINALES (end-of-vignette cappers) ---
  'victory_celebration': [
    { action: 'crowd_react', characters: 'all', anim: 'celebrate' },
    { action: 'react', effect: 'confetti', position: 'wide' },
    { action: 'react', effect: 'stars', position: 'wide' },
    { action: 'sfx', sound: 'victory_fanfare' },
    { action: 'text_popup', text: '{VICTORY_TEXT}', position: 'center', size: 'huge' },
    { action: 'camera_zoom', target: 'out_wide', speed: 'slow' },
  ],
  
  'chaos_aftermath': [
    { action: 'animate', character: '{SURVIVOR}', anim: 'taunt' }, // Standing proud
    { action: 'crowd_react', characters: 'all_others', anim: 'lie_idle' }, // Everyone else down
    { action: 'sfx', sound: 'cricket' },
    // beat
    { action: 'spawn', asset: '{LAST_OBJECT}', position: 'on_{SURVIVOR}', spawnStyle: 'drop' },
    { action: 'animate', character: '{SURVIVOR}', anim: 'die_flop' },
    { action: 'sfx', sound: 'bonk' },
    { action: 'text_popup', text: '{CHAOS_TEXT}', position: 'center', size: 'huge' },
  ],
  
  'awkward_silence': [
    { action: 'crowd_react', characters: 'all', anim: 'idle' },
    { action: 'sfx', sound: 'cricket' },
    // beat — long pause
    { action: 'emote', character: '{MAIN}', text: '😐' },
    // single sad confetti
    { action: 'react', effect: 'confetti', position: 'center', intensity: 'minimal' },
    { action: 'sfx', sound: 'party_horn_sad' },
  ],
};
```

### How to Compose Vignettes from Combos

Vignettes should be ASSEMBLED from these combos, not written from scratch each time:

```typescript
// EXAMPLE: Building a vignette by composing comedy combos

function buildVignette_FeastMagicEpic(): Vignette {
  return {
    id: 'skel_bday_feast_magic_epic',
    trigger: { food: 'feast', entertainment: 'magic_show', vibe: 'epic' },
    tier: 'spectacular',
    steps: [
      // Open with dramatic entrance for the wizard
      ...expandCombo('dramatic_entrance', { CHARACTER: 'mage', POSITION: 'right' }),
      
      // Wizard casts spell to create the feast
      ...expandCombo('spell_success', { CASTER: 'mage', SUMMONED: 'feast' }),
      
      // Crowd goes wild
      ...expandCombo('crowd_cheer', {}),
      
      // But then... potion mishap
      ...expandCombo('potion_drink', { 
        CHARACTER: 'skeleton', 
        RESULT_ANIM: 'jump_big', 
        RESULT_EFFECT: 'explosion' 
      }),
      
      // Food goes everywhere
      ...expandCombo('object_rain', { OBJECT: 'fruit', COUNT: 8, RAIN_TEXT: '🍎 FRUIT STORM!' }),
      
      // Everyone gets bonked
      ...expandCombo('bonk_and_fall', { TARGET: 'skeleton_2' }),
      
      // Epic finale
      ...expandCombo('victory_celebration', { VICTORY_TEXT: '⚔️ LEGENDARY FEAST! ⚔️' }),
    ],
  };
}
```

This composable approach means you can author a new vignette in **5-10 minutes** instead of an hour, because you're snapping together pre-tested comedy sequences.

### Implementation Checklist

```
[ ] Create ANIMATION_VERBS mapping (copy from above, verify against actual clip names)
[ ] Create ASSET_SUBSTITUTIONS map (start with 30 most-used, expand)
[ ] Implement resolveAsset() with 3-tier fallback (direct → fuzzy → mystery_box)
[ ] Implement resolveVignette() with 5-priority matching
[ ] Build expandCombo() function to assemble vignettes from COMEDY_COMBOS
[ ] Add parallel execution to playback engine
[ ] Add new action types: camera_shake, camera_zoom, screen_flash, text_popup, 
    crowd_react, spawn with quantity/spawnStyle variants
[ ] Author 12-16 vignettes for Skeleton Birthday Stage 1
[ ] Author 8-10 vignettes for Skeleton Birthday Stages 2-3
[ ] Author 10-15 vignettes for 2 additional quests
[ ] Create DEFAULT vignette for every stage (funny, never broken)
[ ] Playtest and tune comedy timing (delay values between steps)
```
