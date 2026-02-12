import { useRef, useEffect, useState, useMemo } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useTTS } from '../hooks/useTTS';
import { getStoryById } from '../data/stories/index';
import VoiceButton from './VoiceButton';

const MAX_INPUT_LENGTH = 300;

const LOADING_MESSAGES = [
  'The adventurers are getting ready\u2026',
  'Setting up the scene\u2026',
  'This is gonna be good\u2026',
  'Hold on, something\u2019s happening\u2026',
  'Mixing up some magic\u2026',
  'The skeleton is warming up\u2026',
  'Loading the props\u2026',
];

const TASK_PLACEHOLDERS: Record<string, string> = {
  // 3D tasks
  'skeleton-birthday': "Plan the skeleton's birthday! Who comes, what decorations, and what cake?",
  'knight-space': "The knight is lost in space! How does he survive and what does he do?",
  'mage-kitchen': "The kitchen is alive! How does the mage tame the stove, pot, and fridge?",
  'barbarian-school': "The barbarian is at school! How does he fit in, make friends, and learn?",
  'dungeon-concert': "Start a rock band! Who plays what instrument? What song do they play?",
  'skeleton-pizza': "Deliver the pizza! How does the skeleton get there without falling apart?",
  'adventurers-picnic': "Plan the perfect picnic! What food, where to sit, and what activities?",
  // Legacy 2D tasks
  'monster-party': "How would you plan the monster's birthday party? Be specific!",
  'robot-pizza': 'How should the robot deliver the pizza? Describe the route and obstacles!',
  'wizard-kitchen': 'The kitchen is chaos! How do you fix the plates, soup, toaster, and fridge?',
  'dinosaur-school': 'The T-Rex is too big for school! How can you solve each problem?',
  'dog-space': "Plan the dog's space mission! What does the dog need to reach the moon?",
  'octopus-band': 'Help the octopus start a rock band! What instruments, stage, and audience?',
};

const SUCCESS_STYLES = {
  FULL_SUCCESS: {
    bg: 'bg-quest-success/10 border-quest-success/40',
    text: 'text-quest-text-dark',
    badge: 'bg-quest-success/20 text-quest-success',
    label: 'Amazing!',
    icon: '\u{1F31F}',
  },
  PARTIAL_SUCCESS: {
    bg: 'bg-quest-yellow/10 border-quest-yellow/40',
    text: 'text-quest-text-dark',
    badge: 'bg-quest-yellow/20 text-amber-600',
    label: 'Almost!',
    icon: '\u{1F4A1}',
  },
  FUNNY_FAIL: {
    bg: 'bg-quest-orange/10 border-quest-orange/40',
    text: 'text-quest-text-dark',
    badge: 'bg-quest-orange/20 text-quest-orange',
    label: 'Oops!',
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
    currentStageIndex,
    stageComplete,
    hintsUsed,
    advanceStage,
    getHint,
  } = useGameStore();

  const { speak } = useTTS();
  const [currentHint, setCurrentHint] = useState<string | null>(null);

  // Get story data for current zone (memoized — only recomputes when task changes)
  const story = useMemo(() => getStoryById(currentTask), [currentTask]);
  const stage = story?.stages[currentStageIndex];
  const totalStages = story?.stages.length ?? 0;

  // Clear hint when stage changes
  useEffect(() => {
    setCurrentHint(null);
  }, [currentStageIndex]);

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
          {lastScript.missing_elements && lastScript.missing_elements.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-quest-text-light">Try adding:</span>
              {lastScript.missing_elements.map((el: string) => (
                <span key={el} className="text-xs px-2 py-0.5 rounded-full bg-quest-purple/10 text-quest-purple font-medium animate-scale-in">
                  {el}
                </span>
              ))}
            </div>
          )}
          {lastScript.success_level === 'FUNNY_FAIL' && (
            <p className="mt-2 text-xs text-quest-text-muted italic">That was funny! Try being more specific this time.</p>
          )}
        </div>
      )}

      {/* Stage progress + actions */}
      {stage && (
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-xs font-heading font-bold text-quest-text-mid bg-quest-purple/10 px-3 py-1.5 rounded-full">
            Stage {currentStageIndex + 1} of {totalStages}: {stage.title}
          </span>
          <div className="flex items-center gap-2">
            {/* Hint button — visible when there's a result and not yet complete */}
            {lastScript && !stageComplete && hintsUsed < 3 && (
              <button
                onClick={() => {
                  const hint = getHint();
                  if (hint) setCurrentHint(hint);
                }}
                className="btn-game text-xs px-3 py-1.5 rounded-xl border-2
                  bg-quest-yellow/10 text-amber-600 border-quest-yellow/30 hover:border-quest-yellow/60 hover:bg-quest-yellow/20"
              >
                💡 Hint ({3 - hintsUsed} left)
              </button>
            )}
            {/* Next stage button — visible on completion */}
            {stageComplete && (
              <button
                onClick={advanceStage}
                className="btn-game text-xs px-4 py-1.5 rounded-xl border-2
                  bg-quest-success/10 text-quest-success border-quest-success/30 hover:border-quest-success/60 hover:bg-quest-success/20 animate-bounce-in font-bold"
              >
                {currentStageIndex + 1 < totalStages ? '⭐ Next Stage →' : '🏆 Complete!'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active hint display */}
      {currentHint && (
        <div className="mb-3 bg-quest-yellow/10 border border-quest-yellow/30 rounded-game-md px-4 py-3 animate-slide-up">
          <p className="text-sm text-amber-700 font-semibold">💡 {currentHint}</p>
        </div>
      )}

      {/* Error display — kid-friendly message, never raw technical errors */}
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
            placeholder={stage?.question ?? TASK_PLACEHOLDERS[currentTask] ?? TASK_PLACEHOLDERS['skeleton-birthday']}
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
