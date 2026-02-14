import { create } from 'zustand';
import type { SceneScript } from '../types/scene-script';
import type { VignetteStep } from '../types/madlibs';
import type { ResponseSource } from '../services/resolver';
import type { CharacterKey } from '../data/asset-manifest';
import { resolveResponse } from '../services/resolver';
import { WORLDS } from '../data/worlds';
import { checkBadges, loadBadges, saveBadges, countSkills } from '../services/badge-system';
import { getQuestStages } from '../data/quest-stages';

// ─── LEVEL PERSISTENCE ──────────────────────────────────────────────────────

const LEVELS_KEY = 'quest-ai-levels';

interface LevelData {
  stageNumbers: Record<string, number>;
  stageCompleted: Record<string, number[]>;
  discoveredVignettes: Record<string, string[]>;
}

function loadLevels(): LevelData {
  try {
    const raw = localStorage.getItem(LEVELS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* corrupt data, start fresh */ }
  return { stageNumbers: {}, stageCompleted: {}, discoveredVignettes: {} };
}

function saveLevels(data: LevelData): void {
  try {
    localStorage.setItem(LEVELS_KEY, JSON.stringify(data));
  } catch { /* storage full, best-effort */ }
}

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

  // Mad Libs state
  vignetteSteps: VignetteStep[] | null;

  // Badge system
  badges: Record<string, boolean>;
  badgeUnlocks: string[]; // newly unlocked badges to animate

  // Level progression (per-zone)
  stageNumbers: Record<string, number>;    // { 'mage-kitchen': 1, 'skeleton-birthday': 2, ... }
  stageCompleted: Record<string, number[]>; // { 'mage-kitchen': [1], ... } — which stages are done
  discoveredVignettes: Record<string, string[]>; // { 'mage-kitchen-2': ['id1','id2'], ... }

  // Village navigation
  currentZone: string | null;
  cameraTarget: [number, number, number];
  isTransitioning: boolean;
  playerPosition: [number, number, number];
  cameraYaw: number;
  cameraZoom: number;

  // Character selection
  selectedCharacter: CharacterKey;

  // Cinematic intro animation override for the player character
  introAnimation: string | null;
  introPlayerYaw: number | null;
  introPlayerPosition: [number, number, number] | null;

  // Actions
  setInput: (input: string) => void;
  submitInput: () => Promise<void>;
  setLastScript: (script: SceneScript) => void;
  setVignetteSteps: (steps: VignetteStep[] | null) => void;
  clearScript: () => void;
  clearError: () => void;
  toggleMute: () => void;
  enterZone: (zoneId: string) => void;
  exitZone: () => void;
  updatePlayerPosition: (pos: [number, number, number]) => void;
  rotateCameraYaw: (deltaYaw: number) => void;
  adjustCameraZoom: (delta: number) => void;
  clearBadgeUnlocks: () => void;
  setSelectedCharacter: (id: CharacterKey) => void;
  setIntroAnimation: (anim: string | null, yaw?: number | null) => void;
  setIntroPlayerPosition: (pos: [number, number, number] | null) => void;
  advanceStage: (zoneId: string) => void;
  completeStage: (zoneId: string, stageNumber: number) => void;
  recordDiscovery: (stageKey: string, vignetteId: string) => void;
}

// Zone center positions in world space — ring at R~48-53, dungeon at Z=-70
export const ZONE_CENTERS: Record<string, [number, number, number]> = {
  'skeleton-birthday': [0, 0, -70],
  'knight-space':      [38, 0, -38],
  'barbarian-school':  [48, 0, 5],
  'skeleton-pizza':    [38, 0, 38],
  'adventurers-picnic':[0, 0, 48],
  'dungeon-concert':   [-35, 0, 35],
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

const _savedLevels = loadLevels();

export const useGameStore = create<GameState>((set, get) => ({
  currentTask: 'skeleton-birthday',
  userInput: '',
  isLoading: false,
  lastScript: null,
  lastSource: null,
  error: null,
  history: [],
  isMuted: false,
  vignetteSteps: null,
  badges: loadBadges(),
  badgeUnlocks: [],
  stageNumbers: _savedLevels.stageNumbers,
  stageCompleted: _savedLevels.stageCompleted,
  discoveredVignettes: _savedLevels.discoveredVignettes,
  currentZone: null,
  cameraTarget: VILLAGE_CENTER,
  isTransitioning: false,
  playerPosition: [0, 0, 5],
  cameraYaw: 0,
  cameraZoom: 12,
  selectedCharacter: 'knight',
  introAnimation: null,
  introPlayerYaw: null,
  introPlayerPosition: null,

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

  setLastScript: (script: SceneScript) => set({ lastScript: script }),
  setVignetteSteps: (steps: VignetteStep[] | null) => set({ vignetteSteps: steps }),
  clearScript: () => set({ lastScript: null, lastSource: null, vignetteSteps: null }),
  clearError: () => set({ error: null }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  clearBadgeUnlocks: () => set({ badgeUnlocks: [] }),
  setSelectedCharacter: (id: CharacterKey) => set({ selectedCharacter: id }),
  setIntroAnimation: (anim, yaw) => set({ introAnimation: anim, introPlayerYaw: yaw ?? null }),
  setIntroPlayerPosition: (pos) => set({ introPlayerPosition: pos }),

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

  adjustCameraZoom: (delta: number) => {
    set((s) => ({
      cameraZoom: Math.max(5, Math.min(60, s.cameraZoom * (1 + delta * 0.08))),
    }));
  },

  advanceStage: (zoneId: string) => {
    const { stageNumbers, stageCompleted, discoveredVignettes } = get();
    const maxStages = getQuestStages(zoneId).length;
    const current = stageNumbers[zoneId] ?? 1;
    if (current >= maxStages) return; // already at max

    const next = current + 1;
    const updated = {
      stageNumbers: { ...stageNumbers, [zoneId]: next },
      stageCompleted,
      discoveredVignettes,
    };
    saveLevels(updated);

    // Show a "Level Up!" intro script via the scene engine
    const nextStage = getQuestStages(zoneId).find(s => s.stageNumber === next);
    const levelUpScript: SceneScript = {
      success_level: 'FULL_SUCCESS',
      narration: `Level ${next}: ${nextStage?.title ?? 'Next Level'}!`,
      actions: [
        { type: 'text_popup' as any, text: `Level ${next}!`, position: 'center', size: 'huge', delay_ms: 0, duration_ms: 2000 },
      ],
      prompt_feedback: nextStage?.intro ?? 'New challenge unlocked!',
      guide_hint: 'Try the new options!',
    };

    set({
      stageNumbers: updated.stageNumbers,
      lastScript: levelUpScript,
      vignetteSteps: null,
    });
  },

  completeStage: (zoneId: string, stageNumber: number) => {
    const { stageCompleted, stageNumbers, discoveredVignettes } = get();
    const existing = stageCompleted[zoneId] ?? [];
    if (existing.includes(stageNumber)) return; // already completed

    const updatedCompleted = { ...stageCompleted, [zoneId]: [...existing, stageNumber] };
    const data = { stageNumbers, stageCompleted: updatedCompleted, discoveredVignettes };
    saveLevels(data);
    set({ stageCompleted: updatedCompleted });
  },

  recordDiscovery: (stageKey: string, vignetteId: string) => {
    const { discoveredVignettes, stageNumbers, stageCompleted } = get();
    const existing = discoveredVignettes[stageKey] ?? [];
    if (existing.includes(vignetteId)) return;

    const updated = { ...discoveredVignettes, [stageKey]: [...existing, vignetteId] };
    const data = { stageNumbers, stageCompleted, discoveredVignettes: updated };
    saveLevels(data);
    set({ discoveredVignettes: updated });
  },
}));

// Expose store to window in dev mode for E2E testing (Puppeteer)
if (import.meta.env.DEV) {
  (window as any).__gameStore = useGameStore;
}
