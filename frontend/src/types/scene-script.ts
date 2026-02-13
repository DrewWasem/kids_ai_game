export type SuccessLevel = 'FULL_SUCCESS' | 'PARTIAL_SUCCESS' | 'FUNNY_FAIL';

export type ActionType =
  | 'spawn' | 'move' | 'animate' | 'react' | 'emote' | 'sfx' | 'wait' | 'remove'
  | 'camera_shake' | 'camera_zoom' | 'text_popup' | 'screen_flash'
  | 'crowd_react' | 'spawn_rain' | 'grow' | 'shrink_pop' | 'delay';

export type Position = 'left' | 'center' | 'right' | 'top' | 'bottom' | 'off-left' | 'off-right' | 'off-top';

export type MoveStyle = 'linear' | 'arc' | 'bounce' | 'float' | 'shake' | 'spin-in' | 'drop-in';

export type ActorKey =
  // Legacy 2D actors (kept for cache compatibility)
  | 'monster' | 'dog' | 'trex' | 'octopus' | 'robot'
  | 'wizard' | 'kid' | 'fish' | 'squirrel'
  // 3D KayKit characters
  | 'knight' | 'barbarian' | 'mage' | 'ranger' | 'rogue' | 'druid' | 'engineer'
  | 'skeleton_warrior' | 'skeleton_mage' | 'skeleton_rogue' | 'skeleton_minion' | 'skeleton_golem' | 'necromancer'
  | 'space_ranger' | 'ninja' | 'clown' | 'witch' | 'vampire' | 'black_knight' | 'superhero' | 'caveman' | 'frost_golem' | 'survivalist';

export type PropKey =
  // Legacy 2D props
  | 'cake' | 'cake-giant' | 'cake-tiny' | 'rocket' | 'spacesuit'
  | 'moon' | 'flag' | 'plates' | 'soup-bowl' | 'toaster'
  | 'fridge' | 'desk' | 'pencil' | 'chair' | 'lunchbox'
  | 'guitar' | 'drums' | 'keyboard' | 'microphone'
  | 'pizza' | 'pizza-soggy' | 'river' | 'pillow-fort'
  | 'bone' | 'balloon' | 'present' | 'stars' | 'fire-extinguisher'
  // 3D props (generic names — resolved to GLTF paths by ScenePlayer3D)
  | 'torch' | 'barrel' | 'crate' | 'chest' | 'table' | 'bench'
  | 'tree' | 'rock' | 'bush' | 'fence' | 'sign' | 'lamp'
  | 'sword' | 'shield' | 'bow' | 'potion' | 'scroll'
  | 'cake-3d' | 'cupcake' | 'bread' | 'pie'
  | 'blanket' | 'basket' | 'plate' | 'cup' | 'bottle'
  | 'candle' | 'book' | 'clock' | 'rug'
  | 'slide' | 'swing' | 'sandbox' | 'seesaw' | 'merry_go_round'
  | 'sink' | 'oven' | 'stove' | 'fridge' | 'pan' | 'pot'
  | 'pizza' | 'pizza_pepperoni' | 'apple'
  | 'picnic_blanket'
  | 'present_A_red' | 'present_B_blue'
  | 'banner_blue' | 'banner_red'
  | 'table_long' | 'chair_A';

export type ReactionKey =
  | 'confetti-burst' | 'explosion-cartoon' | 'hearts-float'
  | 'stars-spin' | 'question-marks' | 'laugh-tears'
  | 'fire-sneeze' | 'splash' | 'sparkle-magic' | 'sad-cloud';

export type BackdropKey =
  // Legacy 2D
  | 'party-room' | 'space' | 'wizard-kitchen'
  | 'classroom' | 'underwater-stage' | 'city-street'
  // 3D environments
  | 'dungeon' | 'space-base' | 'kitchen' | 'playground'
  | 'park' | 'picnic' | 'restaurant' | 'forest';

export type AnimationName =
  // General
  | 'Idle_A' | 'Idle_B' | 'Death_A' | 'Hit_A' | 'Hit_B' | 'Interact' | 'PickUp' | 'Spawn_Ground' | 'Throw'
  // Movement
  | 'Walking_A' | 'Walking_B' | 'Walking_C' | 'Walking_Backwards'
  | 'Running_A' | 'Running_B'
  | 'Jump_Start' | 'Jump_Idle' | 'Jump_Land' | 'Jump_Full_Short' | 'Jump_Full_Long'
  // Combat
  | 'Melee_1H_Attack_Chop' | 'Melee_1H_Attack_Spin'
  // Simulation
  | 'Cheering' | 'Waving' | 'Sit_Chair_Down' | 'Sit_Chair_Idle' | 'Lie_Down' | 'Lie_Idle'
  | 'Push_Ups' | 'Headbutt'
  // Special
  | 'Skeletons_Awaken_Floor' | 'Skeletons_Taunt' | 'Skeletons_Death_Resurrect'
  // Tools
  | 'Chop' | 'Dig' | 'Hammer' | 'Fishing_Cast' | 'Fishing_Idle'
  // Generic string fallback for custom anims
  | string;

export interface SpawnAction {
  type: 'spawn';
  target: ActorKey | PropKey;
  position: Position;
  delay_ms?: number;
  resolvedPosition?: [number, number, number];
}

export interface MoveAction {
  type: 'move';
  target: ActorKey | PropKey;
  to: Position;
  style?: MoveStyle;
  delay_ms?: number;
  duration_ms?: number;
  resolvedPosition?: [number, number, number];
}

export interface AnimateAction {
  type: 'animate';
  target: ActorKey;
  anim: AnimationName;
  delay_ms?: number;
  duration_ms?: number;
}

export interface ReactAction {
  type: 'react';
  effect: ReactionKey;
  position: Position;
  delay_ms?: number;
  resolvedPosition?: [number, number, number];
}

export interface EmoteAction {
  type: 'emote';
  target: ActorKey;
  emoji?: string;
  text?: string;
  delay_ms?: number;
}

export interface SfxAction {
  type: 'sfx';
  sound: string;
  delay_ms?: number;
  volume?: number;
}

export interface WaitAction {
  type: 'wait';
  duration_ms: number;
  delay_ms?: number;
}

export interface RemoveAction {
  type: 'remove';
  target: ActorKey | PropKey;
  delay_ms?: number;
}

export interface SpawnGroupAction {
  type: 'spawn_group';
  targets: Array<{
    id: string;       // unique instance id: "cat-0", "cat-1"
    target: string;   // actor key: "cat"
    position: Position;
    offset?: [number, number, number];
  }>;
  stagger_ms?: number; // default 150ms between spawns
  delay_ms?: number;
}

// ─── New Mad Libs Action Types ───────────────────────────────────────────────

export interface CameraShakeAction {
  type: 'camera_shake';
  intensity: number;     // 0.0 - 1.0
  duration: number;      // seconds
  delay_ms?: number;
}

export interface CameraZoomAction {
  type: 'camera_zoom';
  target: string;        // 'center', 'left', 'right', 'out_wide'
  speed: 'fast' | 'slow' | 'medium';
  delay_ms?: number;
}

export interface TextPopupAction {
  type: 'text_popup';
  text: string;
  position: 'top' | 'center' | 'bottom';
  size: 'small' | 'large' | 'huge';
  delay_ms?: number;
  duration_ms?: number;
}

export interface ScreenFlashAction {
  type: 'screen_flash';
  color: string;         // 'white', 'gold', 'orange', etc.
  duration: number;      // seconds
  delay_ms?: number;
}

export interface CrowdReactAction {
  type: 'crowd_react';
  characters: string[] | 'all' | 'all_background' | 'all_others';
  anim: AnimationName;
  delay_ms?: number;
}

export interface SpawnRainAction {
  type: 'spawn_rain';
  asset: string;
  count: number;
  area: 'wide' | 'center' | 'left' | 'right';
  delay_ms?: number;
  duration_ms?: number;
}

export interface GrowAction {
  type: 'grow';
  target: string;
  scale: number;
  duration_ms?: number;
  delay_ms?: number;
}

export interface ShrinkPopAction {
  type: 'shrink_pop';
  target: string;
  effect?: ReactionKey;
  delay_ms?: number;
  duration_ms?: number;
}

export interface DelayAction {
  type: 'delay';
  duration_ms: number;
  delay_ms?: number;
}

export type Action =
  | SpawnAction | MoveAction | AnimateAction | ReactAction
  | EmoteAction | SfxAction | WaitAction | RemoveAction | SpawnGroupAction
  | CameraShakeAction | CameraZoomAction | TextPopupAction | ScreenFlashAction
  | CrowdReactAction | SpawnRainAction | GrowAction | ShrinkPopAction | DelayAction;

export interface PromptAnalysis {
  has_character: boolean;
  has_action: boolean;
  has_sequence: boolean;
  has_detail: boolean;
  has_multi_char: boolean;
  has_environment: boolean;
}

export interface SceneScript {
  success_level: SuccessLevel;
  narration: string;
  actions: Action[];
  missing_elements?: string[];
  prompt_feedback: string;
  guide_hint?: string;
  prompt_analysis?: PromptAnalysis;
}
