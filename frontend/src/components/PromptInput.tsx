import { useRef, useEffect, useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useTTS } from '../hooks/useTTS';
import { WORLDS } from '../data/worlds';
import { BADGES } from '../services/badge-system';
import VoiceButton from './VoiceButton';

const MAX_INPUT_LENGTH = 300;

const LOADING_MESSAGES = [
  'The adventurers are getting ready\u2026',
  'Setting up the scene\u2026',
  'This is gonna be good\u2026',
  'Hold on, something\u2019s happening\u2026',
  'Mixing up some magic\u2026',
  'Loading the props\u2026',
  'Something awesome is coming\u2026',
];

const SUCCESS_STYLES = {
  FULL_SUCCESS: {
    bg: 'bg-quest-success/10 border-quest-success/40',
    text: 'text-quest-text-dark',
    badge: 'bg-quest-success/20 text-quest-success',
    label: 'Awesome!',
    icon: '\u{1F31F}',
  },
  PARTIAL_SUCCESS: {
    bg: 'bg-quest-yellow/10 border-quest-yellow/40',
    text: 'text-quest-text-dark',
    badge: 'bg-quest-yellow/20 text-amber-600',
    label: 'Nice!',
    icon: '\u{1F4A1}',
  },
  FUNNY_FAIL: {
    bg: 'bg-quest-orange/10 border-quest-orange/40',
    text: 'text-quest-text-dark',
    badge: 'bg-quest-orange/20 text-quest-orange',
    label: 'Ha!',
    icon: '\u{1F604}',
  },
} as const;

export default function PromptInput() {
  const {
    currentTask,
    userInput,
    setInput,
    submitInput,
    isLoading,
    lastScript,
    lastSource,
    error,
    clearError,
    badgeUnlocks,
    clearBadgeUnlocks,
  } = useGameStore();

  const { speak } = useTTS();
  const [showBadgeCelebration, setShowBadgeCelebration] = useState(false);

  const world = WORLDS[currentTask];

  // Badge celebration animation
  useEffect(() => {
    if (badgeUnlocks.length > 0) {
      setShowBadgeCelebration(true);
      const timer = setTimeout(() => {
        setShowBadgeCelebration(false);
        clearBadgeUnlocks();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [badgeUnlocks, clearBadgeUnlocks]);

  const loadingMsgRef = useRef(LOADING_MESSAGES[0]);
  if (isLoading && loadingMsgRef.current === LOADING_MESSAGES[0]) {
    loadingMsgRef.current = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
  } else if (!isLoading) {
    loadingMsgRef.current = LOADING_MESSAGES[0];
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitInput();
    }
  };

  // Read narration aloud when a new script arrives
  useEffect(() => {
    if (lastScript?.narration) {
      speak(lastScript.narration);
    }
  }, [lastScript, speak]);

  const style = lastScript ? SUCCESS_STYLES[lastScript.success_level] ?? SUCCESS_STYLES.FUNNY_FAIL : null;

  return (
    <div className="relative px-5 py-4 bg-quest-panel-bg/90 backdrop-blur-sm">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-quest-purple/30 to-transparent" />

      {/* Badge celebration popup */}
      {showBadgeCelebration && badgeUnlocks.length > 0 && (
        <div className="mb-4 bg-quest-purple/10 border-2 border-quest-purple/40 rounded-game-md p-4 animate-bounce-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg animate-sparkle">{'\u{1F3C6}'}</span>
            <span className="font-heading font-bold text-quest-purple">Badge{badgeUnlocks.length > 1 ? 's' : ''} Unlocked!</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {badgeUnlocks.map(id => {
              const badge = BADGES.find(b => b.id === id);
              if (!badge) return null;
              return (
                <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-quest-purple/20 text-quest-purple text-sm font-semibold animate-scale-in">
                  <span>{badge.emoji}</span> {badge.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Narration result */}
      {lastScript && style && (
        <div className={`bubble-result mb-4 animate-slide-up border rounded-game-md p-4 ${style.bg} ${style.text}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-semibold animate-bounce-in ${style.badge}`}>
              <span>{style.icon}</span> {style.label}
            </span>
            {lastSource && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-quest-purple/10 text-quest-text-muted">
                {lastSource}
              </span>
            )}
          </div>
          <p className="font-body font-bold text-lg leading-relaxed">{lastScript.narration}</p>
          {lastScript.prompt_feedback && (
            <p className="mt-3 text-sm text-quest-orange border-t border-quest-purple/10 pt-3 leading-relaxed font-semibold">
              {lastScript.prompt_feedback}
            </p>
          )}
          {/* Guide hint — friendly suggestion for what to try next */}
          {lastScript.guide_hint && (
            <p className="mt-2 text-sm text-quest-purple/80 italic leading-relaxed">
              {'\u{1F4AC}'} {lastScript.guide_hint}
            </p>
          )}
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="bubble-result mb-4 bg-quest-orange/10 border border-quest-orange/40 text-quest-text-dark rounded-game-md p-4 flex justify-between items-center">
          <p className="text-sm">The magic got a little tangled! Try again or try something different.</p>
          <button onClick={clearError} className="text-quest-orange hover:text-quest-text-dark ml-3 text-lg leading-none">&times;</button>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            value={userInput}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
            onKeyDown={handleKeyDown}
            placeholder={world?.placeholder ?? "What should happen? Be as specific as you can!"}
            disabled={isLoading}
            rows={2}
            maxLength={MAX_INPUT_LENGTH}
            className="input-magic pr-14"
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <VoiceButton onTranscript={setInput} disabled={isLoading} />
          </div>
          {userInput.length > MAX_INPUT_LENGTH * 0.8 && (
            <div className="absolute right-14 bottom-2.5 text-[10px] text-quest-text-muted font-mono">
              {userInput.length}/{MAX_INPUT_LENGTH}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          className="btn-primary text-lg px-8 py-4 min-w-[160px] whitespace-nowrap
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {loadingMsgRef.current}
            </span>
          ) : (
            'Try It!'
          )}
        </button>
      </form>
    </div>
  );
}
