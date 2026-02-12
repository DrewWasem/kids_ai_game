import { create } from 'zustand';
import type { SceneScript } from '../types/scene-script';
import type { ResponseSource } from '../services/resolver';
import { resolveResponse } from '../services/resolver';
import { getStoryById } from '../data/stories/index';
import { matchStoryInput } from '../services/story-matcher';
import { resolveStoryResponse } from '../services/story-resolver';

// 3D prompts (legacy scene-script format)
import { SKELETON_BIRTHDAY_PROMPT } from '../prompts/skeleton-birthday';
import { KNIGHT_SPACE_PROMPT } from '../prompts/knight-space';
import { MAGE_KITCHEN_PROMPT } from '../prompts/mage-kitchen';
import { BARBARIAN_SCHOOL_PROMPT } from '../prompts/barbarian-school';
import { DUNGEON_CONCERT_PROMPT } from '../prompts/dungeon-concert';
import { SKELETON_PIZZA_PROMPT } from '../prompts/skeleton-pizza';
import { ADVENTURERS_PICNIC_PROMPT } from '../prompts/adventurers-picnic';

// Block-format prompts (lightweight, resolved client-side)
import { SKELETON_BIRTHDAY_BLOCK_PROMPT } from '../prompts/block/skeleton-birthday-block';
import { KNIGHT_SPACE_BLOCK_PROMPT } from '../prompts/block/knight-space-block';
import { MAGE_KITCHEN_BLOCK_PROMPT } from '../prompts/block/mage-kitchen-block';
import { BARBARIAN_SCHOOL_BLOCK_PROMPT } from '../prompts/block/barbarian-school-block';
import { DUNGEON_CONCERT_BLOCK_PROMPT } from '../prompts/block/dungeon-concert-block';
import { SKELETON_PIZZA_BLOCK_PROMPT } from '../prompts/block/skeleton-pizza-block';
import { ADVENTURERS_PICNIC_BLOCK_PROMPT } from '../prompts/block/adventurers-picnic-block';

interface HistoryEntry {
  input: string;
  script: SceneScript;
  source: ResponseSource;
  latencyMs: number;
}

interface GameState {
  // State
  currentTask: string;
  userInput: string;
  isLoading: boolean;
  lastScript: SceneScript | null;
  lastSource: ResponseSource | null;
  error: string | null;
  history: HistoryEntry[];
  isMuted: boolean;

  // Story curriculum progression
  currentStageIndex: number;        // 0-based index into story stages
  hintsUsed: number;                // 0-3, tracks hint progression
  stageComplete: boolean;           // true after FULL_SUCCESS
  storyProgress: Record<string, number>; // storyId → highest completed stage index

  // Village navigation
  currentZone: string | null; // null = village center, taskId = in zone
  cameraTarget: [number, number, number]; // where camera should look
  isTransitioning: boolean; // true during camera fly
  playerPosition: [number, number, number]; // player world position
  cameraYaw: number; // horizontal camera rotation in radians (0 = behind player)

  // Actions
  setInput: (input: string) => void;
  submitInput: () => Promise<void>;
  clearScript: () => void;
  clearError: () => void;
  toggleMute: () => void;
  enterZone: (zoneId: string) => void;
  exitZone: () => void;
  updatePlayerPosition: (pos: [number, number, number]) => void;
  rotateCameraYaw: (deltaYaw: number) => void;
  advanceStage: () => void;
  getHint: () => string | null;
  completeStory: () => void;
}

const SYSTEM_PROMPTS: Record<string, string> = {
  // 3D tasks (primary — legacy scene-script format)
  'skeleton-birthday': SKELETON_BIRTHDAY_PROMPT,
  'knight-space': KNIGHT_SPACE_PROMPT,
  'mage-kitchen': MAGE_KITCHEN_PROMPT,
  'barbarian-school': BARBARIAN_SCHOOL_PROMPT,
  'dungeon-concert': DUNGEON_CONCERT_PROMPT,
  'skeleton-pizza': SKELETON_PIZZA_PROMPT,
  'adventurers-picnic': ADVENTURERS_PICNIC_PROMPT,
};

// Block-format prompts — preferred over legacy when available
const BLOCK_PROMPTS: Record<string, string> = {
  'skeleton-birthday': SKELETON_BIRTHDAY_BLOCK_PROMPT,
  'knight-space': KNIGHT_SPACE_BLOCK_PROMPT,
  'mage-kitchen': MAGE_KITCHEN_BLOCK_PROMPT,
  'barbarian-school': BARBARIAN_SCHOOL_BLOCK_PROMPT,
  'dungeon-concert': DUNGEON_CONCERT_BLOCK_PROMPT,
  'skeleton-pizza': SKELETON_PIZZA_BLOCK_PROMPT,
  'adventurers-picnic': ADVENTURERS_PICNIC_BLOCK_PROMPT,
};

/** Get the best available prompt for a task. Prefers block format when available. */
function getSystemPrompt(taskId: string): { prompt: string; isBlock: boolean } {
  if (BLOCK_PROMPTS[taskId]) {
    return { prompt: BLOCK_PROMPTS[taskId], isBlock: true };
  }
  if (SYSTEM_PROMPTS[taskId]) {
    return { prompt: SYSTEM_PROMPTS[taskId], isBlock: false };
  }
  // Fallback: use skeleton-birthday prompt as generic fallback — demo never errors
  console.warn(`[GameStore] Unknown task "${taskId}" — using fallback prompt`);
  return { prompt: BLOCK_PROMPTS['skeleton-birthday'], isBlock: true };
}

// Zone center positions in world space — circular ring at radius ~35
export const ZONE_CENTERS: Record<string, [number, number, number]> = {
  'skeleton-birthday': [0, 0, -55],       // north — reached via canyon pass
  'knight-space':      [25, 0, -25],      // northeast
  'barbarian-school':  [35, 0, 0],        // east
  'skeleton-pizza':    [25, 0, 25],       // southeast
  'adventurers-picnic':[0, 0, 35],        // south
  'dungeon-concert':   [-25, 0, 25],      // southwest
  'mage-kitchen':      [-35, 0, 0],       // west
};

export const ZONE_META: Record<string, { label: string; emoji: string; color: string }> = {
  'skeleton-birthday': { label: 'Skeleton Birthday', emoji: '💀', color: '#7C3AED' },
  'adventurers-picnic': { label: 'Adventurer Picnic', emoji: '🧺', color: '#22C55E' },
  'knight-space': { label: 'Space Mission', emoji: '🚀', color: '#3B82F6' },
  'mage-kitchen': { label: 'Magic Kitchen', emoji: '🧙', color: '#A855F7' },
  'barbarian-school': { label: 'School Day', emoji: '📚', color: '#EF4444' },
  'dungeon-concert': { label: 'Rock Concert', emoji: '🎸', color: '#F97316' },
  'skeleton-pizza': { label: 'Pizza Delivery', emoji: '🍕', color: '#FBBF24' },
};

// Village center camera position
export const VILLAGE_CENTER: [number, number, number] = [0, 0, 0];

// Intro scripts shown (and read aloud) when first entering a zone
const ZONE_INTROS: Record<string, SceneScript> = {
  'skeleton-birthday': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "A skeleton warrior is having its first ever birthday party in the dungeon! Help plan the party!",
    actions: [],
    prompt_feedback: "Tell me who's invited, what decorations to set up, and what kind of cake to bring!",
    missing_elements: ['guest list', 'decorations', 'cake'],
  },
  'adventurers-picnic': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The adventurers want the perfect picnic in the park! What could go wrong?",
    actions: [],
    prompt_feedback: "Describe the food, where everyone sits, and what fun activities to do!",
    missing_elements: ['food', 'seating', 'activities'],
  },
  'knight-space': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "A knight accidentally launched himself into space! He has no idea what he's doing!",
    actions: [],
    prompt_feedback: "How does the knight survive in space? What does he find up there?",
    missing_elements: ['survival plan', 'space discovery'],
  },
  'mage-kitchen': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The mage tried a cooking spell and now the whole kitchen is alive and fighting back!",
    actions: [],
    prompt_feedback: "How does the mage tame the angry stove, flying pots, and rebellious fridge?",
    missing_elements: ['kitchen chaos', 'magical solution'],
  },
  'barbarian-school': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "It's the barbarian's first day of school and everything is way too small for him!",
    actions: [],
    prompt_feedback: "How does the barbarian fit in, make friends, and learn something new?",
    missing_elements: ['fitting in', 'making friends', 'learning'],
  },
  'dungeon-concert': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The dungeon creatures want to start a rock band! But nobody knows how to play!",
    actions: [],
    prompt_feedback: "Who plays what instrument? What's their band name? What song do they play?",
    missing_elements: ['instruments', 'band setup', 'performance'],
  },
  'skeleton-pizza': {
    success_level: 'PARTIAL_SUCCESS',
    narration: "The skeleton has to deliver a pizza but keeps falling apart on the way!",
    actions: [],
    prompt_feedback: "How does the skeleton keep it together and deliver the pizza on time?",
    missing_elements: ['delivery route', 'staying assembled'],
  },
};

// Cooldown: prevent re-entering a zone immediately after exiting
let lastExitTime = 0;
const ZONE_REENTRY_COOLDOWN = 1500; // ms
const ZONE_TRIGGER_DISTANCE = 3.0;

export const useGameStore = create<GameState>((set, get) => ({
  currentTask: 'skeleton-birthday',
  userInput: '',
  isLoading: false,
  lastScript: null,
  lastSource: null,
  error: null,
  history: [],
  isMuted: false,
  currentStageIndex: 0,
  hintsUsed: 0,
  stageComplete: false,
  storyProgress: {},
  currentZone: null,
  cameraTarget: VILLAGE_CENTER,
  isTransitioning: false,
  playerPosition: [0, 0, 0],
  cameraYaw: 0,

  setInput: (input: string) => set({ userInput: input }),

  submitInput: async () => {
    const { userInput, currentTask, currentStageIndex } = get();
    const trimmed = userInput.trim();
    if (!trimmed) return;

    set({ isLoading: true, error: null });

    // Try story matcher first (Tier 0: pre-rendered responses)
    const story = getStoryById(currentTask);
    if (story && currentStageIndex < story.stages.length) {
      const stage = story.stages[currentStageIndex];
      const match = matchStoryInput(trimmed, stage.responses);
      if (match) {
        const script = resolveStoryResponse(match.response);
        const isComplete = match.response.successLevel === 'FULL_SUCCESS';
        set((state) => ({
          lastScript: script,
          lastSource: 'cache' as ResponseSource, // story match is effectively cached
          isLoading: false,
          stageComplete: isComplete,
          history: [...state.history, { input: trimmed, script, source: 'cache' as ResponseSource, latencyMs: 0 }],
        }));
        console.log(`[GameStore] Story match (score=${match.score.toFixed(2)}, complete=${isComplete}):`, script);
        return;
      }
    }

    // Fall through to three-tier resolver: cache → live API → fallback
    const { prompt: systemPrompt, isBlock } = getSystemPrompt(currentTask);

    try {
      const { script, source, latencyMs } = await resolveResponse(
        currentTask,
        systemPrompt,
        trimmed,
        isBlock,
      );

      set((state) => ({
        lastScript: script,
        lastSource: source,
        isLoading: false,
        stageComplete: script.success_level === 'FULL_SUCCESS',
        history: [...state.history, { input: trimmed, script, source, latencyMs }],
      }));

      console.log(`[GameStore] Script resolved (${source}, ${latencyMs.toFixed(0)}ms):`, script);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      console.error('[GameStore] Error:', message);
      set({ error: message, isLoading: false });
    }
  },

  clearScript: () => set({ lastScript: null, lastSource: null }),
  clearError: () => set({ error: null }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),

  enterZone: (zoneId: string) => {
    const center = ZONE_CENTERS[zoneId];
    if (!center) return;

    // Try story-based intro first, fall back to legacy ZONE_INTROS
    const story = getStoryById(zoneId);
    const { storyProgress } = get();
    const resumeStage = storyProgress[zoneId] ?? 0;
    let intro: SceneScript | null = null;

    if (story && resumeStage < story.stages.length) {
      const stage = story.stages[resumeStage];
      intro = {
        success_level: 'PARTIAL_SUCCESS',
        narration: stage.narration,
        actions: [],
        prompt_feedback: stage.question,
        missing_elements: [],
      };
    } else {
      intro = ZONE_INTROS[zoneId] || null;
    }

    set({
      currentZone: zoneId,
      currentTask: zoneId,
      cameraTarget: center,
      isTransitioning: true,
      lastScript: intro,
      lastSource: null,
      error: null,
      userInput: '',
      currentStageIndex: resumeStage,
      hintsUsed: 0,
      stageComplete: false,
    });
  },

  exitZone: () => {
    lastExitTime = Date.now();
    const { playerPosition } = get();
    set({
      currentZone: null,
      cameraTarget: playerPosition,
      isTransitioning: true,
      lastScript: null,
      lastSource: null,
      userInput: '',
      stageComplete: false,
      hintsUsed: 0,
    });
  },

  advanceStage: () => {
    const { currentTask, currentStageIndex, storyProgress } = get();
    const story = getStoryById(currentTask);
    if (!story) return;

    const nextIndex = currentStageIndex + 1;
    if (nextIndex >= story.stages.length) {
      // Story complete — call completeStory
      get().completeStory();
      return;
    }

    const nextStage = story.stages[nextIndex];
    const intro: SceneScript = {
      success_level: 'PARTIAL_SUCCESS',
      narration: nextStage.narration,
      actions: [],
      prompt_feedback: nextStage.question,
      missing_elements: [],
    };

    set({
      currentStageIndex: nextIndex,
      hintsUsed: 0,
      stageComplete: false,
      lastScript: intro,
      lastSource: null,
      userInput: '',
      storyProgress: { ...storyProgress, [currentTask]: nextIndex },
    });
    console.log(`[GameStore] Advanced to stage ${nextIndex + 1}/${story.stages.length}: "${nextStage.title}"`);
  },

  getHint: () => {
    const { currentTask, currentStageIndex, hintsUsed } = get();
    const story = getStoryById(currentTask);
    if (!story || currentStageIndex >= story.stages.length) return null;

    const stage = story.stages[currentStageIndex];
    if (hintsUsed >= stage.hints.length) return null;

    const hint = stage.hints[hintsUsed];
    set({ hintsUsed: hintsUsed + 1 });
    console.log(`[GameStore] Hint ${hintsUsed + 1}/3: "${hint}"`);
    return hint;
  },

  completeStory: () => {
    const { currentTask, storyProgress } = get();
    const story = getStoryById(currentTask);
    if (!story) return;

    // Mark story as fully complete
    set({
      storyProgress: { ...storyProgress, [currentTask]: story.stages.length },
    });
    console.log(`[GameStore] Story "${story.title}" complete!`);
    // Exit zone after a brief delay
    setTimeout(() => get().exitZone(), 2000);
  },

  updatePlayerPosition: (pos: [number, number, number]) => {
    const { currentZone, isTransitioning } = get();
    // Don't trigger zone entry while in a zone or transitioning
    if (currentZone || isTransitioning) return;
    // Cooldown after exiting
    if (Date.now() - lastExitTime < ZONE_REENTRY_COOLDOWN) return;

    set({ playerPosition: pos });

    // Check proximity to each zone center
    for (const [zoneId, center] of Object.entries(ZONE_CENTERS)) {
      const dx = pos[0] - center[0];
      const dz = pos[2] - center[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < ZONE_TRIGGER_DISTANCE) {
        get().enterZone(zoneId);
        return;
      }
    }
  },

  rotateCameraYaw: (deltaYaw: number) => {
    set((s) => ({ cameraYaw: s.cameraYaw + deltaYaw }));
  },
}));

// Expose store to window in dev mode for E2E testing (Puppeteer)
if (import.meta.env.DEV) {
  (window as any).__gameStore = useGameStore;
}
