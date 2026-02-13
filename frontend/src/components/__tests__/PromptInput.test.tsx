import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from '../../stores/gameStore';
import type { SceneScript } from '../../types/scene-script';

// ---------------------------------------------------------------------------
// Module mocks — prevent network/3D imports from blowing up in jsdom
// ---------------------------------------------------------------------------

vi.mock('../../data/worlds', () => ({
  WORLDS: {
    'skeleton-birthday': {
      label: 'Birthday Bash',
      emoji: '💀',
      color: '#8B5CF6',
      hook: 'Test hook',
      placeholder: 'What should happen at the party?',
    },
  },
  getWorldPrompt: vi.fn(() => 'mock prompt'),
}));

vi.mock('../../services/badge-system', () => ({
  loadBadges: vi.fn(() => ({})),
  saveBadges: vi.fn(),
  checkBadges: vi.fn(() => []),
  countSkills: vi.fn(() => 0),
  BADGES: [
    { id: 'commander', label: 'Commander', emoji: '🎯', description: 'Named a character' },
  ],
}));

vi.mock('../../hooks/useTTS', () => ({
  useTTS: () => ({ speak: vi.fn(), stop: vi.fn() }),
}));

vi.mock('../VoiceButton', () => ({
  default: () => <button>Voice</button>,
}));

// ---------------------------------------------------------------------------
// Lazy-import the component AFTER mocks are registered
// ---------------------------------------------------------------------------

import PromptInput from '../PromptInput';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeScript(overrides: Partial<SceneScript> = {}): SceneScript {
  return {
    success_level: 'FULL_SUCCESS',
    narration: 'The skeleton loved the giant cake!',
    actions: [
      { type: 'spawn', target: 'cake-giant', position: 'center' },
    ],
    prompt_feedback: 'Nice work being specific about cake size!',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('PromptInput', () => {
  beforeEach(() => {
    useGameStore.setState({
      currentTask: 'skeleton-birthday',
      userInput: '',
      isLoading: false,
      lastScript: null,
      lastSource: null,
      error: null,
      history: [],
      badgeUnlocks: [],
      badges: {},
    });
  });

  // 1. Renders textarea and button
  it('renders a textarea with placeholder and a "Try It!" button', () => {
    render(<PromptInput />);

    const textarea = screen.getByPlaceholderText(
      /what should happen at the party/i,
    );
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');

    const button = screen.getByRole('button', { name: /try it/i });
    expect(button).toBeInTheDocument();
  });

  // 2. Button disabled when input is empty
  it('disables the submit button when userInput is empty', () => {
    render(<PromptInput />);

    const button = screen.getByRole('button', { name: /try it/i });
    expect(button).toBeDisabled();
  });

  // 3. Button enabled when input has text
  it('enables the submit button when userInput has text', () => {
    useGameStore.setState({ userInput: 'Give the skeleton a huge cake' });

    render(<PromptInput />);

    const button = screen.getByRole('button', { name: /try it/i });
    expect(button).not.toBeDisabled();
  });

  // 4. Shows loading state
  it('shows a loading message and disables textarea when isLoading is true', () => {
    useGameStore.setState({
      userInput: 'some prompt',
      isLoading: true,
    });

    render(<PromptInput />);

    // Loading message appears in the button
    expect(screen.queryByRole('button', { name: /try it/i })).not.toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/what should happen at the party/i);
    expect(textarea).toBeDisabled();
  });

  // 5. Shows FULL_SUCCESS narration
  it('renders narration for FULL_SUCCESS', () => {
    const script = makeScript({
      success_level: 'FULL_SUCCESS',
      narration: 'Party was a smash hit!',
    });
    useGameStore.setState({ lastScript: script });

    render(<PromptInput />);

    const narration = screen.getByText('Party was a smash hit!');
    expect(narration).toBeInTheDocument();
  });

  // 6. Shows PARTIAL_SUCCESS narration
  it('renders narration for PARTIAL_SUCCESS', () => {
    const script = makeScript({
      success_level: 'PARTIAL_SUCCESS',
      narration: 'The cake was okay but small.',
    });
    useGameStore.setState({ lastScript: script });

    render(<PromptInput />);

    const narration = screen.getByText('The cake was okay but small.');
    expect(narration).toBeInTheDocument();
  });

  // 7. Shows FUNNY_FAIL narration
  it('renders narration for FUNNY_FAIL', () => {
    const script = makeScript({
      success_level: 'FUNNY_FAIL',
      narration: 'The skeleton sneezed fire on the cake!',
    });
    useGameStore.setState({ lastScript: script });

    render(<PromptInput />);

    const narration = screen.getByText('The skeleton sneezed fire on the cake!');
    expect(narration).toBeInTheDocument();
  });

  // 8. Shows error message
  it('displays an error banner when error is set', () => {
    useGameStore.setState({ error: 'Something went wrong' });

    render(<PromptInput />);

    // Error shows a generic kid-friendly message
    expect(screen.getByText(/magic got a little tangled/i)).toBeInTheDocument();
  });

  // 9. Dismiss error
  it('clears the error when the dismiss button is clicked', async () => {
    const user = userEvent.setup();

    useGameStore.setState({ error: 'Oh no, an error!' });

    render(<PromptInput />);

    // Verify the error is visible
    expect(screen.getByText(/magic got a little tangled/i)).toBeInTheDocument();

    // Click the dismiss button (the "×" character from &times;)
    const dismissButton = screen.getByRole('button', { name: /×/ });
    await user.click(dismissButton);

    // After clearError runs, the error should be removed from the store
    expect(useGameStore.getState().error).toBeNull();
  });
});
