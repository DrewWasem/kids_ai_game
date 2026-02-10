export type SuccessLevel = 'FULL_SUCCESS' | 'PARTIAL_SUCCESS' | 'FUNNY_FAIL';

export type ActionType = 'spawn' | 'move' | 'animate' | 'react' | 'emote' | 'sfx' | 'wait' | 'remove';

export type Position = 'left' | 'center' | 'right' | 'top' | 'bottom' | 'off-left' | 'off-right' | 'off-top';

export type MoveStyle = 'linear' | 'arc' | 'bounce' | 'float' | 'shake' | 'spin-in' | 'drop-in';

export type ActorKey =
  | 'monster' | 'dog' | 'trex' | 'octopus' | 'robot'
  | 'wizard' | 'kid' | 'fish' | 'squirrel';

export type PropKey =
  | 'cake' | 'cake-giant' | 'cake-tiny' | 'rocket' | 'spacesuit'
  | 'moon' | 'flag' | 'plates' | 'soup-bowl' | 'toaster'
  | 'fridge' | 'desk' | 'pencil' | 'chair' | 'lunchbox'
  | 'guitar' | 'drums' | 'keyboard' | 'microphone'
  | 'pizza' | 'pizza-soggy' | 'river' | 'pillow-fort'
  | 'bone' | 'balloon' | 'present' | 'stars' | 'fire-extinguisher';

export type ReactionKey =
  | 'confetti-burst' | 'explosion-cartoon' | 'hearts-float'
  | 'stars-spin' | 'question-marks' | 'laugh-tears'
  | 'fire-sneeze' | 'splash' | 'sparkle-magic' | 'sad-cloud';

export type BackdropKey =
  | 'party-room' | 'space' | 'wizard-kitchen'
  | 'classroom' | 'underwater-stage' | 'city-street';

export interface SpawnAction {
  type: 'spawn';
  target: ActorKey | PropKey;
  position: Position;
  delay_ms?: number;
}

export interface MoveAction {
  type: 'move';
  target: ActorKey | PropKey;
  to: Position;
  style?: MoveStyle;
  delay_ms?: number;
  duration_ms?: number;
}

export interface AnimateAction {
  type: 'animate';
  target: ActorKey;
  anim: string;
  delay_ms?: number;
  duration_ms?: number;
}

export interface ReactAction {
  type: 'react';
  effect: ReactionKey;
  position: Position;
  delay_ms?: number;
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

export type Action =
  | SpawnAction | MoveAction | AnimateAction | ReactAction
  | EmoteAction | SfxAction | WaitAction | RemoveAction;

export interface SceneScript {
  success_level: SuccessLevel;
  narration: string;
  actions: Action[];
  missing_elements?: string[];
  prompt_feedback: string;
}
