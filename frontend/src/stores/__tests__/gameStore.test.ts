import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import type { SceneScript } from '../../types/scene-script';
import type { ResolvedResponse } from '../../services/resolver';

vi.mock('../../services/resolver', () => ({
  resolveResponse: vi.fn(),
}));

vi.mock('../../game/EventBus', () => ({
  default: { emit: vi.fn(), on: vi.fn(), off: vi.fn() },
}));

// Import after mocks are declared so the module picks up mocked dependencies
import { useGameStore } from '../gameStore';
import { resolveResponse } from '../../services/resolver';
import EventBus from '../../game/EventBus';

const mockResolveResponse = vi.mocked(resolveResponse);
const mockEmit = vi.mocked(EventBus.emit);

const MOCK_SCRIPT: SceneScript = {
  success_level: 'FULL_SUCCESS',
  narration: 'The monster loves the giant cake!',
  actions: [
    { type: 'spawn', target: 'cake-giant', position: 'left' },
    { type: 'move', target: 'cake-giant', to: 'center', style: 'arc' },
    { type: 'animate', target: 'monster', anim: 'eat' },
    { type: 'react', effect: 'confetti-burst', position: 'center' },
  ],
  prompt_feedback: 'Great job describing the cake!',
};

const MOCK_RESOLVED: ResolvedResponse = {
  script: MOCK_SCRIPT,
  source: 'live',
  latencyMs: 42,
};

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.setState({
      currentTask: 'monster-party',
      userInput: '',
      isLoading: false,
      lastScript: null,
      lastSource: null,
      error: null,
      history: [],
    });
    vi.clearAllMocks();
  });

  // ---- 1. Initial state ----
  it('has correct initial state', () => {
    const state = useGameStore.getState();
    expect(state.currentTask).toBe('monster-party');
    expect(state.userInput).toBe('');
    expect(state.isLoading).toBe(false);
    expect(state.lastScript).toBeNull();
    expect(state.lastSource).toBeNull();
    expect(state.error).toBeNull();
    expect(state.history).toEqual([]);
  });

  // ---- 2. setInput ----
  it('setInput updates userInput', () => {
    act(() => {
      useGameStore.getState().setInput('Bake a giant cake');
    });
    expect(useGameStore.getState().userInput).toBe('Bake a giant cake');
  });

  // ---- 3. clearScript ----
  it('clearScript sets lastScript and lastSource to null', () => {
    useGameStore.setState({ lastScript: MOCK_SCRIPT, lastSource: 'live' });
    expect(useGameStore.getState().lastScript).not.toBeNull();

    act(() => {
      useGameStore.getState().clearScript();
    });
    expect(useGameStore.getState().lastScript).toBeNull();
    expect(useGameStore.getState().lastSource).toBeNull();
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
  it('submitInput calls resolveResponse, sets lastScript/lastSource, adds to history, emits play-script', async () => {
    mockResolveResponse.mockResolvedValueOnce(MOCK_RESOLVED);
    useGameStore.setState({ userInput: 'Bake a giant cake for the monster' });

    await act(async () => {
      await useGameStore.getState().submitInput();
    });

    const state = useGameStore.getState();

    // resolveResponse was called with the task, system prompt, and trimmed user input
    expect(mockResolveResponse).toHaveBeenCalledOnce();
    expect(mockResolveResponse).toHaveBeenCalledWith(
      'monster-party',
      expect.any(String),
      'Bake a giant cake for the monster',
    );

    // State updated correctly
    expect(state.isLoading).toBe(false);
    expect(state.lastScript).toEqual(MOCK_SCRIPT);
    expect(state.lastSource).toBe('live');
    expect(state.error).toBeNull();

    // History appended with source and latency
    expect(state.history).toHaveLength(1);
    expect(state.history[0]).toEqual({
      input: 'Bake a giant cake for the monster',
      script: MOCK_SCRIPT,
      source: 'live',
      latencyMs: 42,
    });

    // EventBus emitted the script to Phaser
    expect(mockEmit).toHaveBeenCalledWith('play-script', MOCK_SCRIPT);
  });

  // ---- 7. submitInput with cache hit ----
  it('submitInput with cache source tracks source correctly', async () => {
    const cachedResponse: ResolvedResponse = {
      script: MOCK_SCRIPT,
      source: 'cache',
      latencyMs: 1,
    };
    mockResolveResponse.mockResolvedValueOnce(cachedResponse);
    useGameStore.setState({ userInput: 'throw a huge cake' });

    await act(async () => {
      await useGameStore.getState().submitInput();
    });

    const state = useGameStore.getState();
    expect(state.lastSource).toBe('cache');
    expect(state.history[0].source).toBe('cache');
    expect(state.history[0].latencyMs).toBe(1);
  });

  // ---- 8. submitInput with resolver error (should never happen, but handled) ----
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

  // ---- 9. submitInput with unknown task ----
  it('submitInput with unknown task sets error', async () => {
    useGameStore.setState({ userInput: 'Build a rocket', currentTask: 'rocket-launch' });

    await act(async () => {
      await useGameStore.getState().submitInput();
    });

    const state = useGameStore.getState();
    expect(state.error).toBe('Unknown task: rocket-launch');
    expect(state.isLoading).toBe(false);
    expect(mockResolveResponse).not.toHaveBeenCalled();
  });
});
