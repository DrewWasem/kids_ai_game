import { create } from 'zustand';
import type { SceneScript } from '../types/scene-script';
import type { ResponseSource } from '../services/resolver';
import { resolveResponse } from '../services/resolver';
import { WORLDS } from '../data/worlds';
import { checkBadges, loadBadges, saveBadges, countSkills } from '../services/badge-system';

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

  // Badge system
  badges: Record<string, boolean>;
  badgeUnlocks: string[]; // newly unlocked badges to animate

  // Village navigation
  currentZone: string | null;
  cameraTarget: [number, number, number];
  isTransitioning: boolean;
  playerPosition: [number, number, number];
  cameraYaw: number;

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
  clearBadgeUnlocks: () => void;
}

// Zone center positions in world space — ring at R~48-53, dungeon at Z=-70
export const ZONE_CENTERS: Record<string, [number, number, number]> = {
  'skeleton-birthday': [0, 0, -70],
  'knight-space':      [38, 0, -38],
  'barbarian-school':  [48, 0, 5],
  'skeleton-pizza':    [38, 0, 38],
  'adventurers-picnic':[0, 0, 48],
  'dungeon-concert':   [-38, 0, 38],
  'mage-kitchen':      [-48, 0, 5],
};

// Zone metadata derived from WORLDS config
export const ZONE_META: Record<string, { label: string; emoji: string; color: string }> = Object.fromEntries(
  Object.entries(WORLDS).map(([id, w]) => [id, { label: w.label, emoji: w.emoji, color: w.color }])
);

// Village center camera position
export const VILLAGE_CENTER: [number, number, number] = [0, 0, 0];

// Intro scripts shown (and read aloud) when first entering a zone — derived from WORLDS hook
function getZoneIntro(zoneId: string): SceneScript | null {
  const world = WORLDS[zoneId];
  if (!world) return null;
  return {
    success_level: 'PARTIAL_SUCCESS',
    narration: world.hook,
    actions: [],
    prompt_feedback: world.placeholder,
    guide_hint: `Try describing WHO should do something, WHAT they do, and HOW they do it!`,
  };
}

// Cooldown: prevent re-entering a zone immediately after exiting
let lastExitTime = 0;
const ZONE_REENTRY_COOLDOWN = 1500;
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
  badges: loadBadges(),
  badgeUnlocks: [],
  currentZone: null,
  cameraTarget: VILLAGE_CENTER,
  isTransitioning: false,
  playerPosition: [0, 0, 0],
  cameraYaw: 0,

  setInput: (input: string) => set({ userInput: input }),

  submitInput: async () => {
    const { userInput, currentTask } = get();
    const trimmed = userInput.trim();
    if (!trimmed) return;

    set({ isLoading: true, error: null });

    try {
      const { script, source, latencyMs } = await resolveResponse(
        currentTask,
        trimmed,
      );

      // Check for badge unlocks
      const { badges, history } = get();

      // Iterator badge: did they retry with more detail?
      let isRetryImproved = false;
      if (history.length > 0) {
        const prevAnalysis = history[history.length - 1].script.prompt_analysis;
        const prevSkills = countSkills(prevAnalysis);
        const newSkills = countSkills(script.prompt_analysis);
        if (newSkills > prevSkills) {
          isRetryImproved = true;
        }
      }

      const newBadgeIds = checkBadges(script.prompt_analysis, badges, isRetryImproved);
      const updatedBadges = { ...badges };
      for (const id of newBadgeIds) {
        updatedBadges[id] = true;
      }
      if (newBadgeIds.length > 0) {
        saveBadges(updatedBadges);
      }

      set((state) => ({
        lastScript: script,
        lastSource: source,
        isLoading: false,
        badges: newBadgeIds.length > 0 ? updatedBadges : state.badges,
        badgeUnlocks: newBadgeIds,
        history: [...state.history, { input: trimmed, script, source, latencyMs }],
      }));

      console.log(`[GameStore] Script resolved (${source}, ${latencyMs.toFixed(0)}ms):`, script);
      if (newBadgeIds.length > 0) {
        console.log(`[GameStore] Badges unlocked:`, newBadgeIds);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      console.error('[GameStore] Error:', message);
      set({ error: message, isLoading: false });
    }
  },

  clearScript: () => set({ lastScript: null, lastSource: null }),
  clearError: () => set({ error: null }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  clearBadgeUnlocks: () => set({ badgeUnlocks: [] }),

  enterZone: (zoneId: string) => {
    const center = ZONE_CENTERS[zoneId];
    if (!center) return;

    const intro = getZoneIntro(zoneId);

    set({
      currentZone: zoneId,
      currentTask: zoneId,
      cameraTarget: center,
      isTransitioning: true,
      lastScript: intro,
      lastSource: null,
      error: null,
      userInput: '',
      badgeUnlocks: [],
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
      badgeUnlocks: [],
    });
  },

  updatePlayerPosition: (pos: [number, number, number]) => {
    const { currentZone, isTransitioning } = get();
    if (currentZone || isTransitioning) return;
    if (Date.now() - lastExitTime < ZONE_REENTRY_COOLDOWN) return;

    set({ playerPosition: pos });

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
