import type {
  SuccessLevel,
  ActionType,
  Position,
  MoveStyle,
  ActorKey,
  PropKey,
  ReactionKey,
  BackdropKey,
  SpawnAction,
  MoveAction,
  AnimateAction,
  ReactAction,
  EmoteAction,
  SfxAction,
  WaitAction,
  RemoveAction,
  Action,
  SceneScript,
} from '../scene-script';

// ---------------------------------------------------------------------------
// Runtime validation helpers
// ---------------------------------------------------------------------------

const VALID_SUCCESS_LEVELS: string[] = ['FULL_SUCCESS', 'PARTIAL_SUCCESS', 'FUNNY_FAIL'];

const VALID_ACTION_TYPES: string[] = [
  'spawn', 'move', 'animate', 'react', 'emote', 'sfx', 'wait', 'remove',
];

const VALID_POSITIONS: string[] = [
  'left', 'center', 'right', 'top', 'bottom', 'off-left', 'off-right', 'off-top',
];

const VALID_MOVE_STYLES: string[] = [
  'linear', 'arc', 'bounce', 'float', 'shake', 'spin-in', 'drop-in',
];

const VALID_ACTOR_KEYS: string[] = [
  'monster', 'dog', 'trex', 'octopus', 'robot',
  'wizard', 'kid', 'fish', 'squirrel',
];

const VALID_PROP_KEYS: string[] = [
  'cake', 'cake-giant', 'cake-tiny', 'rocket', 'spacesuit',
  'moon', 'flag', 'plates', 'soup-bowl', 'toaster',
  'fridge', 'desk', 'pencil', 'chair', 'lunchbox',
  'guitar', 'drums', 'keyboard', 'microphone',
  'pizza', 'pizza-soggy', 'river', 'pillow-fort',
  'bone', 'balloon', 'present', 'stars', 'fire-extinguisher',
];

const VALID_REACTION_KEYS: string[] = [
  'confetti-burst', 'explosion-cartoon', 'hearts-float',
  'stars-spin', 'question-marks', 'laugh-tears',
  'fire-sneeze', 'splash', 'sparkle-magic', 'sad-cloud',
];

const VALID_BACKDROP_KEYS: string[] = [
  'party-room', 'space', 'wizard-kitchen',
  'classroom', 'underwater-stage', 'city-street',
];

function isValidSuccessLevel(level: string): level is SuccessLevel {
  return VALID_SUCCESS_LEVELS.includes(level);
}

function isValidActionType(type: string): type is ActionType {
  return VALID_ACTION_TYPES.includes(type);
}

function isValidPosition(pos: string): pos is Position {
  return VALID_POSITIONS.includes(pos);
}

function isValidMoveStyle(style: string): style is MoveStyle {
  return VALID_MOVE_STYLES.includes(style);
}

function isValidActorKey(key: string): key is ActorKey {
  return VALID_ACTOR_KEYS.includes(key);
}

function isValidPropKey(key: string): key is PropKey {
  return VALID_PROP_KEYS.includes(key);
}

function isValidReactionKey(key: string): key is ReactionKey {
  return VALID_REACTION_KEYS.includes(key);
}

function isValidBackdropKey(key: string): key is BackdropKey {
  return VALID_BACKDROP_KEYS.includes(key);
}

function isValidTarget(key: string): key is ActorKey | PropKey {
  return isValidActorKey(key) || isValidPropKey(key);
}

function isValidAction(action: Record<string, unknown>): action is Action {
  const type = action.type as string;
  if (!isValidActionType(type)) return false;

  switch (type) {
    case 'spawn':
      return (
        isValidTarget(action.target as string) &&
        isValidPosition(action.position as string)
      );
    case 'move':
      return (
        isValidTarget(action.target as string) &&
        isValidPosition(action.to as string) &&
        (action.style === undefined || isValidMoveStyle(action.style as string))
      );
    case 'animate':
      return (
        isValidActorKey(action.target as string) &&
        typeof action.anim === 'string'
      );
    case 'react':
      return (
        isValidReactionKey(action.effect as string) &&
        isValidPosition(action.position as string)
      );
    case 'emote':
      return isValidActorKey(action.target as string);
    case 'sfx':
      return typeof action.sound === 'string';
    case 'wait':
      return typeof action.duration_ms === 'number';
    case 'remove':
      return isValidTarget(action.target as string);
    default:
      return false;
  }
}

function isValidSceneScript(obj: Record<string, unknown>): obj is SceneScript {
  if (!isValidSuccessLevel(obj.success_level as string)) return false;
  if (typeof obj.narration !== 'string') return false;
  if (!Array.isArray(obj.actions)) return false;
  if (typeof obj.prompt_feedback !== 'string') return false;

  for (const action of obj.actions) {
    if (!isValidAction(action as Record<string, unknown>)) return false;
  }

  if (obj.missing_elements !== undefined) {
    if (!Array.isArray(obj.missing_elements)) return false;
    for (const el of obj.missing_elements) {
      if (typeof el !== 'string') return false;
    }
  }

  return true;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Scene Script type validation', () => {
  // ---- 1. Valid SceneScript object ----
  describe('valid SceneScript object', () => {
    it('should validate a script with required fields: success_level, narration, actions, prompt_feedback', () => {
      const script: SceneScript = {
        success_level: 'PARTIAL_SUCCESS',
        narration: 'The monster grabs the cake!',
        actions: [
          { type: 'spawn', target: 'cake', position: 'center' },
        ],
        prompt_feedback: 'Try adding a bigger cake next time.',
      };

      expect(isValidSceneScript(script as unknown as Record<string, unknown>)).toBe(true);
    });
  });

  // ---- 2. Valid spawn action ----
  describe('valid spawn action', () => {
    it('should validate a spawn action with target and position', () => {
      const action: SpawnAction = {
        type: 'spawn',
        target: 'cake-giant',
        position: 'left',
      };

      expect(isValidAction(action as unknown as Record<string, unknown>)).toBe(true);
      expect(action.type).toBe('spawn');
      expect(isValidTarget(action.target)).toBe(true);
      expect(isValidPosition(action.position)).toBe(true);
    });

    it('should validate a spawn action with optional delay_ms', () => {
      const action: SpawnAction = {
        type: 'spawn',
        target: 'monster',
        position: 'right',
        delay_ms: 500,
      };

      expect(isValidAction(action as unknown as Record<string, unknown>)).toBe(true);
    });

    it('should reject a spawn action with an invalid target', () => {
      const action = {
        type: 'spawn',
        target: 'unicorn',
        position: 'center',
      };

      expect(isValidAction(action)).toBe(false);
    });

    it('should reject a spawn action with an invalid position', () => {
      const action = {
        type: 'spawn',
        target: 'monster',
        position: 'middle',
      };

      expect(isValidAction(action)).toBe(false);
    });
  });

  // ---- 3. Valid move action ----
  describe('valid move action', () => {
    it('should validate a move action with target, to, style, and duration_ms', () => {
      const action: MoveAction = {
        type: 'move',
        target: 'cake-giant',
        to: 'center',
        style: 'arc',
        duration_ms: 800,
      };

      expect(isValidAction(action as unknown as Record<string, unknown>)).toBe(true);
      expect(action.type).toBe('move');
      expect(isValidTarget(action.target)).toBe(true);
      expect(isValidPosition(action.to)).toBe(true);
      expect(isValidMoveStyle(action.style!)).toBe(true);
    });

    it('should validate a move action without optional fields', () => {
      const action: MoveAction = {
        type: 'move',
        target: 'robot',
        to: 'right',
      };

      expect(isValidAction(action as unknown as Record<string, unknown>)).toBe(true);
    });

    it('should reject a move action with an invalid style', () => {
      const action = {
        type: 'move',
        target: 'monster',
        to: 'center',
        style: 'teleport',
      };

      expect(isValidAction(action)).toBe(false);
    });

    it('should validate all move styles', () => {
      const styles = ['linear', 'arc', 'bounce', 'float', 'shake', 'spin-in', 'drop-in'];
      for (const style of styles) {
        expect(isValidMoveStyle(style)).toBe(true);
      }
    });
  });

  // ---- 4. Valid animate action ----
  describe('valid animate action', () => {
    it('should validate an animate action with target and anim', () => {
      const action: AnimateAction = {
        type: 'animate',
        target: 'monster',
        anim: 'eat',
      };

      expect(isValidAction(action as unknown as Record<string, unknown>)).toBe(true);
      expect(action.type).toBe('animate');
      expect(isValidActorKey(action.target)).toBe(true);
    });

    it('should validate an animate action with optional delay_ms and duration_ms', () => {
      const action: AnimateAction = {
        type: 'animate',
        target: 'dog',
        anim: 'wag',
        delay_ms: 200,
        duration_ms: 1000,
      };

      expect(isValidAction(action as unknown as Record<string, unknown>)).toBe(true);
    });

    it('should reject an animate action targeting a prop (props cannot animate)', () => {
      const action = {
        type: 'animate',
        target: 'cake',
        anim: 'spin',
      };

      expect(isValidAction(action)).toBe(false);
    });
  });

  // ---- 5. Valid react action ----
  describe('valid react action', () => {
    it('should validate a react action with effect and position', () => {
      const action: ReactAction = {
        type: 'react',
        effect: 'confetti-burst',
        position: 'center',
      };

      expect(isValidAction(action as unknown as Record<string, unknown>)).toBe(true);
      expect(action.type).toBe('react');
      expect(isValidReactionKey(action.effect)).toBe(true);
      expect(isValidPosition(action.position)).toBe(true);
    });

    it('should validate a react action with optional delay_ms', () => {
      const action: ReactAction = {
        type: 'react',
        effect: 'explosion-cartoon',
        position: 'left',
        delay_ms: 300,
      };

      expect(isValidAction(action as unknown as Record<string, unknown>)).toBe(true);
    });

    it('should reject a react action with an invalid effect', () => {
      const action = {
        type: 'react',
        effect: 'rainbow-beam',
        position: 'center',
      };

      expect(isValidAction(action)).toBe(false);
    });

    it('should validate all reaction keys', () => {
      const reactions = [
        'confetti-burst', 'explosion-cartoon', 'hearts-float',
        'stars-spin', 'question-marks', 'laugh-tears',
        'fire-sneeze', 'splash', 'sparkle-magic', 'sad-cloud',
      ];
      for (const key of reactions) {
        expect(isValidReactionKey(key)).toBe(true);
      }
    });
  });

  // ---- 6. SceneScript with all optional fields ----
  describe('SceneScript with optional fields', () => {
    it('should validate a script that includes missing_elements', () => {
      const script: SceneScript = {
        success_level: 'PARTIAL_SUCCESS',
        narration: 'Almost there, but the plates are missing!',
        actions: [
          { type: 'spawn', target: 'cake', position: 'center' },
          { type: 'react', effect: 'question-marks', position: 'right' },
        ],
        missing_elements: ['plates', 'balloon'],
        prompt_feedback: 'You forgot to mention plates and balloons for the party.',
      };

      expect(isValidSceneScript(script as unknown as Record<string, unknown>)).toBe(true);
      expect(script.missing_elements).toEqual(['plates', 'balloon']);
    });
  });

  // ---- 7. SceneScript with empty actions ----
  describe('SceneScript with empty actions', () => {
    it('should validate a script with an empty actions array', () => {
      const script: SceneScript = {
        success_level: 'FUNNY_FAIL',
        narration: 'Nothing happened at all!',
        actions: [],
        prompt_feedback: 'Try describing what you want to happen at the party.',
      };

      expect(isValidSceneScript(script as unknown as Record<string, unknown>)).toBe(true);
      expect(script.actions).toHaveLength(0);
    });
  });

  // ---- 8. Full success script ----
  describe('full FULL_SUCCESS script', () => {
    it('should validate a complete FULL_SUCCESS scene script', () => {
      const script: SceneScript = {
        success_level: 'FULL_SUCCESS',
        narration: 'The monster eats the giant cake and confetti flies everywhere!',
        actions: [
          { type: 'spawn', target: 'cake-giant', position: 'left' },
          { type: 'move', target: 'cake-giant', to: 'center', style: 'arc', duration_ms: 600 },
          { type: 'spawn', target: 'monster', position: 'right' },
          { type: 'move', target: 'monster', to: 'center', style: 'bounce', duration_ms: 400 },
          { type: 'animate', target: 'monster', anim: 'eat', delay_ms: 500 },
          { type: 'react', effect: 'confetti-burst', position: 'center', delay_ms: 800 },
        ],
        prompt_feedback: 'Great job! You described a full party scene with a cake and a happy monster.',
      };

      expect(isValidSceneScript(script as unknown as Record<string, unknown>)).toBe(true);
      expect(script.success_level).toBe('FULL_SUCCESS');
      expect(script.actions).toHaveLength(6);
    });
  });

  // ---- 9. Funny fail script ----
  describe('full FUNNY_FAIL script', () => {
    it('should validate a complete FUNNY_FAIL scene script', () => {
      const script: SceneScript = {
        success_level: 'FUNNY_FAIL',
        narration: 'The robot trips and the pizza goes flying into the river!',
        actions: [
          { type: 'spawn', target: 'robot', position: 'left' },
          { type: 'spawn', target: 'pizza', position: 'left', delay_ms: 200 },
          { type: 'move', target: 'robot', to: 'center', style: 'shake', duration_ms: 500 },
          { type: 'move', target: 'pizza', to: 'off-top', style: 'arc', duration_ms: 300, delay_ms: 500 },
          { type: 'react', effect: 'splash', position: 'right', delay_ms: 700 },
          { type: 'react', effect: 'laugh-tears', position: 'center', delay_ms: 900 },
        ],
        missing_elements: ['proper delivery instructions'],
        prompt_feedback: 'The robot did not know where to deliver the pizza. Try telling it the address!',
      };

      expect(isValidSceneScript(script as unknown as Record<string, unknown>)).toBe(true);
      expect(script.success_level).toBe('FUNNY_FAIL');
      expect(script.actions).toHaveLength(6);
      expect(script.missing_elements).toBeDefined();
    });
  });

  // ---- Additional validation edge cases ----
  describe('type guard edge cases', () => {
    it('should reject an invalid success_level', () => {
      expect(isValidSuccessLevel('WIN')).toBe(false);
      expect(isValidSuccessLevel('')).toBe(false);
      expect(isValidSuccessLevel('full_success')).toBe(false);
    });

    it('should accept all valid success levels', () => {
      expect(isValidSuccessLevel('FULL_SUCCESS')).toBe(true);
      expect(isValidSuccessLevel('PARTIAL_SUCCESS')).toBe(true);
      expect(isValidSuccessLevel('FUNNY_FAIL')).toBe(true);
    });

    it('should reject an invalid action type', () => {
      expect(isValidActionType('explode')).toBe(false);
      expect(isValidActionType('')).toBe(false);
    });

    it('should accept all valid action types', () => {
      for (const type of VALID_ACTION_TYPES) {
        expect(isValidActionType(type)).toBe(true);
      }
    });

    it('should reject an invalid position', () => {
      expect(isValidPosition('middle')).toBe(false);
      expect(isValidPosition('above')).toBe(false);
    });

    it('should accept all valid positions', () => {
      for (const pos of VALID_POSITIONS) {
        expect(isValidPosition(pos)).toBe(true);
      }
    });

    it('should accept all valid actor keys', () => {
      for (const key of VALID_ACTOR_KEYS) {
        expect(isValidActorKey(key)).toBe(true);
      }
    });

    it('should accept all valid prop keys', () => {
      for (const key of VALID_PROP_KEYS) {
        expect(isValidPropKey(key)).toBe(true);
      }
    });

    it('should accept all valid backdrop keys', () => {
      for (const key of VALID_BACKDROP_KEYS) {
        expect(isValidBackdropKey(key)).toBe(true);
      }
    });

    it('should reject a script missing required fields', () => {
      const incomplete = {
        success_level: 'FULL_SUCCESS',
        narration: 'Hello',
        actions: [],
        // prompt_feedback is missing
      };

      expect(isValidSceneScript(incomplete as Record<string, unknown>)).toBe(false);
    });

    it('should reject a script with an invalid action in the array', () => {
      const script = {
        success_level: 'FULL_SUCCESS',
        narration: 'Test narration',
        actions: [
          { type: 'spawn', target: 'monster', position: 'center' },
          { type: 'teleport', target: 'monster', to: 'left' }, // invalid action type
        ],
        prompt_feedback: 'Some feedback',
      };

      expect(isValidSceneScript(script as Record<string, unknown>)).toBe(false);
    });

    it('should reject a script where missing_elements is not an array of strings', () => {
      const script = {
        success_level: 'PARTIAL_SUCCESS',
        narration: 'Test',
        actions: [],
        prompt_feedback: 'Feedback',
        missing_elements: [42, null],
      };

      expect(isValidSceneScript(script as Record<string, unknown>)).toBe(false);
    });
  });
});
