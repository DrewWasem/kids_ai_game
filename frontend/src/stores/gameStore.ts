import { create } from 'zustand';
import type { SceneScript } from '../types/scene-script';
import type { ResponseSource } from '../services/resolver';
import { resolveResponse } from '../services/resolver';
import { MONSTER_PARTY_PROMPT } from '../prompts/monster-party';
import { ROBOT_PIZZA_PROMPT } from '../prompts/robot-pizza';
import EventBus from '../game/EventBus';

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

  // Actions
  setInput: (input: string) => void;
  submitInput: () => Promise<void>;
  clearScript: () => void;
  clearError: () => void;
}

const SYSTEM_PROMPTS: Record<string, string> = {
  'monster-party': MONSTER_PARTY_PROMPT,
  'robot-pizza': ROBOT_PIZZA_PROMPT,
};

export const useGameStore = create<GameState>((set, get) => ({
  currentTask: 'monster-party',
  userInput: '',
  isLoading: false,
  lastScript: null,
  lastSource: null,
  error: null,
  history: [],

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

      // Send to Phaser
      EventBus.emit('play-script', script);
      console.log(`[GameStore] Script sent to Phaser (${source}, ${latencyMs.toFixed(0)}ms):`, script);
    } catch (err) {
      // This should never happen — resolver always returns fallback
      const message = err instanceof Error ? err.message : 'Something went wrong';
      console.error('[GameStore] Error:', message);
      set({ error: message, isLoading: false });
    }
  },

  clearScript: () => set({ lastScript: null, lastSource: null }),
  clearError: () => set({ error: null }),
}));
