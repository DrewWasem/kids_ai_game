import { create } from 'zustand';
import type { SceneScript } from '../types/scene-script';
import type { ResponseSource } from '../services/resolver';
import { resolveResponse } from '../services/resolver';

// 3D prompts
import { SKELETON_BIRTHDAY_PROMPT } from '../prompts/skeleton-birthday';
import { KNIGHT_SPACE_PROMPT } from '../prompts/knight-space';
import { MAGE_KITCHEN_PROMPT } from '../prompts/mage-kitchen';
import { BARBARIAN_SCHOOL_PROMPT } from '../prompts/barbarian-school';
import { DUNGEON_CONCERT_PROMPT } from '../prompts/dungeon-concert';
import { SKELETON_PIZZA_PROMPT } from '../prompts/skeleton-pizza';
import { ADVENTURERS_PICNIC_PROMPT } from '../prompts/adventurers-picnic';

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

  // Village navigation
  currentZone: string | null; // null = village center, taskId = in zone
  cameraTarget: [number, number, number]; // where camera should look
  isTransitioning: boolean; // true during camera fly
  playerPosition: [number, number, number]; // player world position

  // Actions
  setInput: (input: string) => void;
  submitInput: () => Promise<void>;
  clearScript: () => void;
  clearError: () => void;
  toggleMute: () => void;
  enterZone: (zoneId: string) => void;
  exitZone: () => void;
  updatePlayerPosition: (pos: [number, number, number]) => void;
}

const SYSTEM_PROMPTS: Record<string, string> = {
  // 3D tasks (primary)
  'skeleton-birthday': SKELETON_BIRTHDAY_PROMPT,
  'knight-space': KNIGHT_SPACE_PROMPT,
  'mage-kitchen': MAGE_KITCHEN_PROMPT,
  'barbarian-school': BARBARIAN_SCHOOL_PROMPT,
  'dungeon-concert': DUNGEON_CONCERT_PROMPT,
  'skeleton-pizza': SKELETON_PIZZA_PROMPT,
  'adventurers-picnic': ADVENTURERS_PICNIC_PROMPT,
};

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
  currentZone: null,
  cameraTarget: VILLAGE_CENTER,
  isTransitioning: false,
  playerPosition: [0, 0, 0],

  setInput: (input: string) => set({ userInput: input }),

  submitInput: async () => {
    const { userInput, currentTask } = get();
    const trimmed = userInput.trim();
    if (!trimmed) return;

    const systemPrompt = SYSTEM_PROMPTS[currentTask];
    if (!systemPrompt) {
      set({ error: `Unknown task: ${currentTask}` });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // Three-tier resolver: cache → live API → fallback
      const { script, source, latencyMs } = await resolveResponse(
        currentTask,
        systemPrompt,
        trimmed,
      );

      set((state) => ({
        lastScript: script,
        lastSource: source,
        isLoading: false,
        history: [...state.history, { input: trimmed, script, source, latencyMs }],
      }));

      // ScenePlayer3D reads lastScript from Zustand directly — no EventBus needed
      console.log(`[GameStore] Script resolved (${source}, ${latencyMs.toFixed(0)}ms):`, script);
    } catch (err) {
      // This should never happen — resolver always returns fallback
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
    const intro = ZONE_INTROS[zoneId] || null;
    set({
      currentZone: zoneId,
      currentTask: zoneId,
      cameraTarget: center,
      isTransitioning: true,
      lastScript: intro,
      lastSource: null,
      error: null,
      userInput: '',
    });
    // Transition completes after camera arrives (VillageCamera sets isTransitioning=false)
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
    });
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
}));
