import { create } from 'zustand';
import type { SceneScript } from '../types/scene-script';
import type { ResponseSource } from '../services/resolver';
import { resolveResponse } from '../services/resolver';

// Legacy 2D prompts (kept for fallback)
import { MONSTER_PARTY_PROMPT } from '../prompts/monster-party';
import { ROBOT_PIZZA_PROMPT } from '../prompts/robot-pizza';
import { WIZARD_KITCHEN_PROMPT } from '../prompts/wizard-kitchen';
import { DINOSAUR_SCHOOL_PROMPT } from '../prompts/dinosaur-school';
import { DOG_SPACE_PROMPT } from '../prompts/dog-space';
import { OCTOPUS_BAND_PROMPT } from '../prompts/octopus-band';

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

  // Actions
  setInput: (input: string) => void;
  submitInput: () => Promise<void>;
  clearScript: () => void;
  clearError: () => void;
  toggleMute: () => void;
  enterZone: (zoneId: string) => void;
  exitZone: () => void;
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
  // Legacy 2D tasks (kept for fallback)
  'monster-party': MONSTER_PARTY_PROMPT,
  'robot-pizza': ROBOT_PIZZA_PROMPT,
  'wizard-kitchen': WIZARD_KITCHEN_PROMPT,
  'dinosaur-school': DINOSAUR_SCHOOL_PROMPT,
  'dog-space': DOG_SPACE_PROMPT,
  'octopus-band': OCTOPUS_BAND_PROMPT,
};

// Zone center positions in world space (expanded for 7x building scale)
export const ZONE_CENTERS: Record<string, [number, number, number]> = {
  'skeleton-birthday': [0, 0, -35],
  'adventurers-picnic': [0, 0, 35],
};

// Village center camera position
export const VILLAGE_CENTER: [number, number, number] = [0, 0, 0];

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
    set({
      currentZone: zoneId,
      currentTask: zoneId,
      cameraTarget: center,
      isTransitioning: true,
      lastScript: null,
      lastSource: null,
      error: null,
      userInput: '',
    });
    // Transition completes after camera arrives (VillageCamera sets isTransitioning=false)
  },

  exitZone: () => {
    set({
      currentZone: null,
      cameraTarget: VILLAGE_CENTER,
      isTransitioning: true,
      lastScript: null,
      lastSource: null,
      userInput: '',
    });
  },
}));
