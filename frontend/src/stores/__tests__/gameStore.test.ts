import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import type { SceneScript } from '../../types/scene-script';
import type { ResolvedResponse } from '../../services/resolver';

vi.mock('../../services/resolver', () => ({
  resolveResponse: vi.fn(),
}));

vi.mock('../../data/worlds', () => ({
  WORLDS: {
    'skeleton-birthday': { label: 'Birthday Bash', emoji: '💀', color: '#8B5CF6', hook: 'Test', placeholder: 'Test' },
    'knight-space': { label: 'Space Station', emoji: '🚀', color: '#3B82F6', hook: 'Test', placeholder: 'Test' },
    'mage-kitchen': { label: 'Kitchen Chaos', emoji: '🧙', color: '#F59E0B', hook: 'Test', placeholder: 'Test' },
    'barbarian-school': { label: 'Monster Recess', emoji: '⚔️', color: '#EF4444', hook: 'Test', placeholder: 'Test' },
    'dungeon-concert': { label: 'Dungeon Escape', emoji: '🏰', color: '#6B7280', hook: 'Test', placeholder: 'Test' },
    'skeleton-pizza': { label: 'Pizza Pandemonium', emoji: '🍕', color: '#F97316', hook: 'Test', placeholder: 'Test' },
    'adventurers-picnic': { label: 'Forest Mystery', emoji: '🌳', color: '#10B981', hook: 'Test', placeholder: 'Test' },
  },
  getWorldPrompt: vi.fn(() => 'mock prompt'),
}));

vi.mock('../../services/badge-system', () => ({
  loadBadges: vi.fn(() => ({})),
  saveBadges: vi.fn(),
  checkBadges: vi.fn(() => []),
  countSkills: vi.fn(() => 0),
  BADGES: [],
}));

// Import after mocks are declared so the module picks up mocked dependencies
import { useGameStore } from '../gameStore';
import { resolveResponse } from '../../services/resolver';

const mockResolveResponse = vi.mocked(resolveResponse);

const MOCK_SCRIPT: SceneScript = {
  success_level: 'FULL_SUCCESS',
  narration: 'The skeleton loves the birthday cake!',
  actions: [
    { type: 'spawn', target: 'skeleton_warrior', position: 'center' },
    { type: 'spawn', target: 'cake-giant', position: 'left' },
    { type: 'move', target: 'cake-giant', to: 'center', style: 'arc' },
    { type: 'react', effect: 'confetti-burst', position: 'center' },
  ],
  prompt_feedback: 'Great job planning the party!',
};

const MOCK_RESOLVED: ResolvedResponse = {
  script: MOCK_SCRIPT,
  source: 'live',
  latencyMs: 42,
};

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.setState({
      currentTask: 'skeleton-birthday',
      userInput: '',
      isLoading: false,
      lastScript: null,
      lastSource: null,
      error: null,
      history: [],
      vignetteSteps: null,
      badges: {},
      badgeUnlocks: [],
    });
    vi.clearAllMocks();
  });

  // ---- 1. Initial state ----
  it('has correct initial state', () => {
    const state = useGameStore.getState();
    expect(state.currentTask).toBe('skeleton-birthday');
    expect(state.userInput).toBe('');
    expect(state.isLoading).toBe(false);
    expect(state.lastScript).toBeNull();
    expect(state.lastSource).toBeNull();
    expect(state.error).toBeNull();
    expect(state.history).toEqual([]);
    expect(state.vignetteSteps).toBeNull();
  });

  // ---- 2. setInput ----
  it('setInput updates userInput', () => {
    act(() => {
      useGameStore.getState().setInput('Invite the knight and mage to a party');
    });
    expect(useGameStore.getState().userInput).toBe('Invite the knight and mage to a party');
  });

  // ---- 3. clearScript ----
  it('clearScript sets lastScript, lastSource, and vignetteSteps to null', () => {
    useGameStore.setState({ lastScript: MOCK_SCRIPT, lastSource: 'live', vignetteSteps: [{ parallel: [], delayAfter: 0.5 }] });
    expect(useGameStore.getState().lastScript).not.toBeNull();

    act(() => {
      useGameStore.getState().clearScript();
    });
    expect(useGameStore.getState().lastScript).toBeNull();
    expect(useGameStore.getState().lastSource).toBeNull();
    expect(useGameStore.getState().vignetteSteps).toBeNull();
  });

  // ---- 4. clearError ----
  it('clearError sets error to null', () => {
    useGameStore.setState({ error: 'Something failed' });
    expect(useGameStore.getState().error).toBe('Something failed');

    act(() => {
      useGameStore.getState().clearError();
    });
    expect(useGameStore.getState().error).toBeNull();
  });

  // ---- 5. submitInput with empty input ----
  it('submitInput with empty input does nothing', async () => {
    useGameStore.setState({ userInput: '   ' });

    await act(async () => {
      await useGameStore.getState().submitInput();
    });

    expect(useGameStore.getState().isLoading).toBe(false);
    expect(mockResolveResponse).not.toHaveBeenCalled();
  });

  // ---- 6. submitInput with valid input ----
  it('submitInput calls resolveResponse, sets lastScript/lastSource, adds to history', async () => {
    mockResolveResponse.mockResolvedValueOnce(MOCK_RESOLVED);
    useGameStore.setState({ userInput: 'Invite knight and mage with cake and banners' });

    await act(async () => {
      await useGameStore.getState().submitInput();
    });

    const state = useGameStore.getState();

    // resolveResponse was called with 2 args: taskId and trimmed user input
    expect(mockResolveResponse).toHaveBeenCalledOnce();
    expect(mockResolveResponse).toHaveBeenCalledWith(
      'skeleton-birthday',
      'Invite knight and mage with cake and banners',
    );

    // State updated correctly
    expect(state.isLoading).toBe(false);
    expect(state.lastScript).toEqual(MOCK_SCRIPT);
    expect(state.lastSource).toBe('live');
    expect(state.error).toBeNull();

    // History appended with source and latency
    expect(state.history).toHaveLength(1);
    expect(state.history[0]).toEqual({
      input: 'Invite knight and mage with cake and banners',
      script: MOCK_SCRIPT,
      source: 'live',
      latencyMs: 42,
    });
  });

  // ---- 7. submitInput with resolver error ----
  it('submitInput sets error if resolver throws unexpectedly', async () => {
    mockResolveResponse.mockRejectedValueOnce(new Error('Unexpected resolver crash'));
    useGameStore.setState({ userInput: 'Do something cool' });

    await act(async () => {
      await useGameStore.getState().submitInput();
    });

    const state = useGameStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Unexpected resolver crash');
    expect(state.lastScript).toBeNull();
    expect(state.history).toEqual([]);
  });

  // ---- 8. setLastScript ----
  it('setLastScript updates lastScript directly', () => {
    act(() => {
      useGameStore.getState().setLastScript(MOCK_SCRIPT);
    });
    expect(useGameStore.getState().lastScript).toEqual(MOCK_SCRIPT);
  });

  // ---- 9. setVignetteSteps ----
  it('setVignetteSteps updates vignetteSteps', () => {
    const steps = [{ parallel: [{ action: 'spawn' as const, character: 'knight', position: 'center' }], delayAfter: 0.5 }];
    act(() => {
      useGameStore.getState().setVignetteSteps(steps);
    });
    expect(useGameStore.getState().vignetteSteps).toEqual(steps);
  });

  it('setVignetteSteps can be set to null', () => {
    useGameStore.setState({ vignetteSteps: [{ parallel: [], delayAfter: 0.5 }] });
    act(() => {
      useGameStore.getState().setVignetteSteps(null);
    });
    expect(useGameStore.getState().vignetteSteps).toBeNull();
  });

  // ---- 10. toggleMute ----
  it('toggleMute flips isMuted state', () => {
    expect(useGameStore.getState().isMuted).toBe(false);

    act(() => {
      useGameStore.getState().toggleMute();
    });
    expect(useGameStore.getState().isMuted).toBe(true);

    act(() => {
      useGameStore.getState().toggleMute();
    });
    expect(useGameStore.getState().isMuted).toBe(false);
  });

  // ---- 11. clearBadgeUnlocks ----
  it('clearBadgeUnlocks empties the badgeUnlocks array', () => {
    useGameStore.setState({ badgeUnlocks: ['commander', 'director'] });
    act(() => {
      useGameStore.getState().clearBadgeUnlocks();
    });
    expect(useGameStore.getState().badgeUnlocks).toEqual([]);
  });
});
