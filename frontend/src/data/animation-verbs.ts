/**
 * Animation Verb Mapping — gameplay verbs → actual animation clip names.
 *
 * Every vignette step references a verb (e.g. 'celebrate', 'throw'),
 * and the engine resolves it to the actual clip name (e.g. 'Cheering', 'Throw').
 *
 * All clip names verified against ANIMATION_CLIPS in asset-manifest.ts.
 */

export const ANIMATION_VERBS: Record<string, string> = {
  // === EXPRESSIVE (the money animations — use these the MOST) ===
  celebrate:    'Cheering',
  wave:         'Waving',
  taunt:        'Skeletons_Taunt',
  taunt_long:   'Skeletons_Taunt_Longer',
  die_dramatic: 'Death_A',
  die_flop:     'Death_B',
  get_hit:      'Hit_A',
  get_bonked:   'Hit_B',
  awaken:       'Skeletons_Awaken_Floor',
  awaken_long:  'Skeletons_Awaken_Floor_Long',
  awaken_stand: 'Skeletons_Awaken_Standing',
  resurrect:    'Skeletons_Death_Resurrect',

  // === INTERACTIONS (object-oriented actions) ===
  grab:         'PickUp',
  throw:        'Throw',
  use:          'Use_Item',
  interact:     'Interact',

  // === MOVEMENT (getting around the scene) ===
  walk:         'Walking_A',
  walk_goofy:   'Walking_B',
  walk_swagger: 'Walking_C',
  run:          'Running_A',
  run_panic:    'Running_B',
  jump_big:     'Jump_Full_Long',
  jump_small:   'Jump_Full_Short',
  jump_idle:    'Jump_Idle',
  dodge_back:   'Dodge_Backward',
  dodge_side:   'Dodge_Left',
  sneak:        'Sneaking',
  crawl:        'Crawling',

  // === SITTING/LYING (scene-setting, aftermath) ===
  sit_down:     'Sit_Chair_Down',
  sit_idle:     'Sit_Chair_Idle',
  sit_floor:    'Sit_Floor_Down',
  lie_down:     'Lie_Down',
  lie_idle:     'Lie_Idle',
  stand_up:     'Lie_StandUp',
  pushups:      'Push_Ups',
  situps:       'Sit_Ups',

  // === WORK/TOOLS (activity-based comedy) ===
  chop:         'Chop',
  chopping:     'Chopping',
  dig:          'Dig',
  digging:      'Digging',
  hammer:       'Hammer',
  hammering:    'Hammering',
  saw:          'Saw',
  fish_cast:    'Fishing_Cast',
  fish_idle:    'Fishing_Idle',
  fish_struggle:'Fishing_Struggling',
  fish_catch:   'Fishing_Catch',
  lockpick:     'Lockpicking',
  hold:         'Holding_A',
  work:         'Working_A',

  // === COMBAT (for slapstick, NOT violence) ===
  punch:        'Melee_Unarmed_Attack_Punch_A',
  kick:         'Melee_Unarmed_Attack_Kick',
  sword_slash:  'Melee_1H_Attack_Slice_Horizontal',
  sword_chop:   'Melee_1H_Attack_Chop',
  spin_attack:  'Melee_2H_Attack_Spin',
  block:        'Melee_Block',
  block_hit:    'Melee_Block_Hit',

  // === MAGIC (spectacle animations) ===
  cast_spell:   'Ranged_Magic_Spellcasting',
  cast_long:    'Ranged_Magic_Spellcasting_Long',
  summon:       'Ranged_Magic_Summon',
  magic_shoot:  'Ranged_Magic_Shoot',
  magic_raise:  'Ranged_Magic_Raise',
  bow_draw:     'Ranged_Bow_Draw',
  bow_release:  'Ranged_Bow_Release',

  // === ENTRANCES (how characters appear) ===
  spawn_air:    'Spawn_Air',
  spawn_ground: 'Spawn_Ground',
  skel_spawn:   'Skeletons_Spawn_Ground',
  skel_inactive:'Skeletons_Inactive_Floor_Pose',

  // === IDLE VARIANTS (for background characters) ===
  idle:         'Idle_A',
  idle_alt:     'Idle_B',
  skel_idle:    'Skeletons_Idle',
  skel_walk:    'Skeletons_Walking',
  crouch:       'Crouching',
};

/**
 * Resolve a gameplay verb to the actual animation clip name.
 * If the verb is already a clip name (e.g. 'Cheering'), pass it through.
 */
export function resolveAnimationVerb(verb: string): string {
  return ANIMATION_VERBS[verb] ?? verb;
}
