/**
 * LoadingScreen Component Tests
 *
 * Tests the branded loading screen component (pure React, no R3F).
 * Validates rendering, progress bar states, and text content.
 */

import { render, screen, waitFor } from '@testing-library/react';
import LoadingScreen from '../LoadingScreen';

describe('LoadingScreen', () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // BASIC RENDERING
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Basic rendering', () => {
    it('should render the title "Quest AI"', () => {
      render(<LoadingScreen />);
      expect(screen.getByText('Quest AI')).toBeInTheDocument();
    });

    it('should render the subtitle "Your words are your superpower."', () => {
      render(<LoadingScreen />);
      expect(screen.getByText('Your words are your superpower.')).toBeInTheDocument();
    });

    it('should render a progress bar element', () => {
      const { container } = render(<LoadingScreen />);
      const progressBar = container.querySelector('.h-2.bg-white\\/10');
      expect(progressBar).toBeInTheDocument();
    });

    it('should render a loading message', () => {
      render(<LoadingScreen />);
      // Check for any of the expected loading messages
      const messageElement = screen.getByText(/Sharpening|Reassembling|Polishing|Warming|Tuning|Setting|Loading/i);
      expect(messageElement).toBeInTheDocument();
    });

    it('should render star decorations', () => {
      const { container } = render(<LoadingScreen />);
      const stars = container.querySelectorAll('.animate-pulse');
      expect(stars.length).toBeGreaterThan(0);
    });

    it('should render exactly 20 star decorations', () => {
      const { container } = render(<LoadingScreen />);
      // Stars are rendered in the overflow-hidden container
      const starsContainer = container.querySelector('.overflow-hidden.pointer-events-none');
      expect(starsContainer).toBeInTheDocument();
      const stars = starsContainer?.querySelectorAll('.animate-pulse');
      expect(stars?.length).toBe(20);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // PROGRESS BAR STATES
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Progress bar states', () => {
    it('should show indeterminate state (shimmer) when no progress prop is provided', () => {
      const { container } = render(<LoadingScreen />);
      const shimmer = container.querySelector('.animate-shimmer');
      expect(shimmer).toBeInTheDocument();
    });

    it('should show determinate progress when progress prop is provided', () => {
      const { container } = render(<LoadingScreen progress={50} />);
      const progressBar = container.querySelector('.h-full.rounded-full.transition-all');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveStyle({ width: '50%' });
    });

    it('should update progress bar width when progress changes', () => {
      const { container, rerender } = render(<LoadingScreen progress={25} />);
      let progressBar = container.querySelector('.h-full.rounded-full.transition-all');
      expect(progressBar).toHaveStyle({ width: '25%' });

      rerender(<LoadingScreen progress={75} />);
      progressBar = container.querySelector('.h-full.rounded-full.transition-all');
      expect(progressBar).toHaveStyle({ width: '75%' });
    });

    it('should handle 0% progress', () => {
      const { container } = render(<LoadingScreen progress={0} />);
      const progressBar = container.querySelector('.h-full.rounded-full.transition-all');
      expect(progressBar).toHaveStyle({ width: '0%' });
    });

    it('should handle 100% progress', () => {
      const { container } = render(<LoadingScreen progress={100} />);
      const progressBar = container.querySelector('.h-full.rounded-full.transition-all');
      expect(progressBar).toHaveStyle({ width: '100%' });
    });

    it('should not show shimmer animation when progress is defined', () => {
      const { container } = render(<LoadingScreen progress={50} />);
      const shimmer = container.querySelector('.animate-shimmer');
      expect(shimmer).not.toBeInTheDocument();
    });

    it('should have gradient background on determinate progress bar', () => {
      const { container } = render(<LoadingScreen progress={60} />);
      const progressBar = container.querySelector('.h-full.rounded-full.transition-all');
      expect(progressBar).toHaveStyle({
        background: 'linear-gradient(90deg, #7C3AED 0%, #FF8C42 100%)',
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEXT CONTENT AND CYCLING
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Loading messages', () => {
    it('should display one of the expected loading messages', () => {
      render(<LoadingScreen />);

      const expectedMessages = [
        "Sharpening the Knight's sword...",
        "Reassembling the Skeleton...",
        "Polishing the Mage's wand...",
        "Warming up the kitchen...",
        "Tuning the instruments...",
        "Setting up the picnic blanket...",
        "Loading 3D models...",
      ];

      // At least one of these messages should be visible
      const visibleMessage = expectedMessages.find((msg) => {
        try {
          screen.getByText(msg);
          return true;
        } catch {
          return false;
        }
      });

      expect(visibleMessage).toBeDefined();
    });

    it('should cycle through loading messages over time', async () => {
      render(<LoadingScreen />);

      // Get the initial message
      const messageElement = screen.getByText(/Sharpening|Reassembling|Polishing|Warming|Tuning|Setting|Loading/i);
      const initialMessage = messageElement.textContent;

      // Wait for 2.5 seconds (longer than the 2-second interval)
      await waitFor(
        () => {
          const currentMessage = messageElement.textContent;
          expect(currentMessage).not.toBe(initialMessage);
        },
        { timeout: 3000 },
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // STYLING AND BRANDING
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Styling and branding', () => {
    it('should have the correct background color', () => {
      const { container } = render(<LoadingScreen />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ backgroundColor: '#0F0A1A' });
    });

    it('should have gradient text on title', () => {
      render(<LoadingScreen />);
      const title = screen.getByText('Quest AI');

      // Check that gradient is applied (jsdom may not fully support all webkit properties)
      expect(title).toHaveStyle({
        background: 'linear-gradient(135deg, #7C3AED 0%, #FF8C42 100%)',
      });

      // Verify webkit properties are set (even if jsdom doesn't compute them)
      const computedStyle = window.getComputedStyle(title);
      expect(computedStyle.background).toContain('linear-gradient');
    });

    it('should apply fade-in effect on mount', () => {
      const { container } = render(<LoadingScreen />);
      const wrapper = container.firstChild as HTMLElement;

      // Initially should have opacity-0 (before fade-in completes)
      // After mount effect, should transition to opacity-100
      expect(wrapper.className).toContain('transition-all');
    });

    it('should have fixed positioning covering the full screen', () => {
      const { container } = render(<LoadingScreen />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('fixed');
      expect(wrapper.className).toContain('inset-0');
    });

    it('should have high z-index to overlay other content', () => {
      const { container } = render(<LoadingScreen />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('z-50');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // ACCESSIBILITY
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Accessibility', () => {
    it('should have star decorations with pointer-events-none', () => {
      const { container } = render(<LoadingScreen />);
      const starsContainer = container.querySelector('.pointer-events-none');
      expect(starsContainer).toBeInTheDocument();
    });

    it('should render title with semantic heading element', () => {
      render(<LoadingScreen />);
      const title = screen.getByText('Quest AI');
      expect(title.tagName).toBe('H1');
    });

    it('should render subtitle and message with paragraph elements', () => {
      render(<LoadingScreen />);
      const subtitle = screen.getByText('Your words are your superpower.');
      expect(subtitle.tagName).toBe('P');

      const message = screen.getByText(/Sharpening|Reassembling|Polishing|Warming|Tuning|Setting|Loading/i);
      expect(message.tagName).toBe('P');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // EDGE CASES
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Edge cases', () => {
    it('should handle undefined progress gracefully', () => {
      const { container } = render(<LoadingScreen progress={undefined} />);
      const shimmer = container.querySelector('.animate-shimmer');
      expect(shimmer).toBeInTheDocument();
    });

    it('should handle negative progress values (should still render)', () => {
      const { container } = render(<LoadingScreen progress={-10} />);
      const progressBar = container.querySelector('.h-full.rounded-full.transition-all');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveStyle({ width: '-10%' });
    });

    it('should handle progress values over 100 (should still render)', () => {
      const { container } = render(<LoadingScreen progress={150} />);
      const progressBar = container.querySelector('.h-full.rounded-full.transition-all');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveStyle({ width: '150%' });
    });

    it('should render correctly when remounted', () => {
      const { unmount, container } = render(<LoadingScreen progress={50} />);
      unmount();

      const { container: newContainer } = render(<LoadingScreen progress={75} />);
      const progressBar = newContainer.querySelector('.h-full.rounded-full.transition-all');
      expect(progressBar).toHaveStyle({ width: '75%' });
    });
  });
});
