import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from '../../stores/gameStore';
import type { SceneScript } from '../../types/scene-script';

// ---------------------------------------------------------------------------
// Module mocks — prevent Phaser / network imports from blowing up in jsdom
// ---------------------------------------------------------------------------

vi.mock('../../game/EventBus', () => ({
  default: { emit: vi.fn(), on: vi.fn(), off: vi.fn() },
}));

vi.mock('../../services/claude', () => ({
  evaluateInput: vi.fn(),
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
    narration: 'The monster loved the giant cake!',
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
      currentTask: 'monster-party',
      userInput: '',
      isLoading: false,
      lastScript: null,
      error: null,
      history: [],
    });
  });

  // 1. Renders textarea and button
  it('renders a textarea with placeholder and a "Try It!" button', () => {
    render(<PromptInput />);

    const textarea = screen.getByPlaceholderText(
      /how would you plan the monster/i,
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
    useGameStore.setState({ userInput: 'Give the monster a huge cake' });

    render(<PromptInput />);

    const button = screen.getByRole('button', { name: /try it/i });
    expect(button).not.toBeDisabled();
  });

  // 4. Shows loading state
  it('shows "Thinking..." and disables textarea when isLoading is true', () => {
    useGameStore.setState({
      userInput: 'some prompt',
      isLoading: true,
    });

    render(<PromptInput />);

    expect(screen.getByText(/thinking\.\.\./i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /try it/i })).not.toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(
      /how would you plan the monster/i,
    );
    expect(textarea).toBeDisabled();
  });

  // 5. Shows FULL_SUCCESS narration with green styling
  it('renders green-styled narration for FULL_SUCCESS', () => {
    const script = makeScript({
      success_level: 'FULL_SUCCESS',
      narration: 'Party was a smash hit!',
    });
    useGameStore.setState({ lastScript: script });

    render(<PromptInput />);

    const narration = screen.getByText('Party was a smash hit!');
    expect(narration).toBeInTheDocument();

    // The container div should carry the green class names
    const container = narration.closest('div');
    expect(container?.className).toMatch(/emerald/);
  });

  // 6. Shows PARTIAL_SUCCESS narration with yellow styling
  it('renders yellow-styled narration for PARTIAL_SUCCESS', () => {
    const script = makeScript({
      success_level: 'PARTIAL_SUCCESS',
      narration: 'The cake was okay but small.',
    });
    useGameStore.setState({ lastScript: script });

    render(<PromptInput />);

    const narration = screen.getByText('The cake was okay but small.');
    expect(narration).toBeInTheDocument();

    const container = narration.closest('div');
    expect(container?.className).toMatch(/amber/);
  });

  // 7. Shows FUNNY_FAIL narration with purple styling
  it('renders purple-styled narration for FUNNY_FAIL', () => {
    const script = makeScript({
      success_level: 'FUNNY_FAIL',
      narration: 'The monster sneezed fire on the cake!',
    });
    useGameStore.setState({ lastScript: script });

    render(<PromptInput />);

    const narration = screen.getByText('The monster sneezed fire on the cake!');
    expect(narration).toBeInTheDocument();

    const container = narration.closest('div');
    expect(container?.className).toMatch(/purple/);
  });

  // 8. Shows error message with red styling
  it('displays a red error banner when error is set', () => {
    useGameStore.setState({ error: 'Something went wrong' });

    render(<PromptInput />);

    const errorText = screen.getByText('Something went wrong');
    expect(errorText).toBeInTheDocument();

    const container = errorText.closest('div');
    expect(container?.className).toMatch(/red/);
  });

  // 9. Dismiss error — clicking the close button calls clearError
  it('clears the error when the dismiss button is clicked', async () => {
    const user = userEvent.setup();

    useGameStore.setState({ error: 'Oh no, an error!' });

    render(<PromptInput />);

    // Verify the error is visible
    expect(screen.getByText('Oh no, an error!')).toBeInTheDocument();

    // Click the dismiss button (the "×" character from &times;)
    const dismissButton = screen.getByRole('button', { name: /×/ });
    await user.click(dismissButton);

    // After clearError runs, the error should be removed from the store
    expect(useGameStore.getState().error).toBeNull();

    // The error banner should no longer be in the document
    expect(screen.queryByText('Oh no, an error!')).not.toBeInTheDocument();
  });
});
