import { useGameStore } from '../stores/gameStore';
import VoiceButton from './VoiceButton';

const MAX_INPUT_LENGTH = 300;

const TASK_PLACEHOLDERS: Record<string, string> = {
  'monster-party': "How would you plan the monster's birthday party? Be specific!",
  'robot-pizza': 'How should the robot deliver the pizza? Describe the route and obstacles!',
};

const SUCCESS_STYLES = {
  FULL_SUCCESS: {
    bg: 'bg-emerald-900/40 border-emerald-500/50',
    text: 'text-emerald-100',
    badge: 'bg-emerald-500/20 text-emerald-300',
    label: 'Amazing!',
    icon: '🌟',
  },
  PARTIAL_SUCCESS: {
    bg: 'bg-amber-900/40 border-amber-500/50',
    text: 'text-amber-100',
    badge: 'bg-amber-500/20 text-amber-300',
    label: 'Almost!',
    icon: '💡',
  },
  FUNNY_FAIL: {
    bg: 'bg-quest-card border-quest-accent/50',
    text: 'text-purple-100',
    badge: 'bg-quest-accent/20 text-purple-300',
    label: 'Oops!',
    icon: '😄',
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
  } = useGameStore();

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

  const style = lastScript ? SUCCESS_STYLES[lastScript.success_level] ?? SUCCESS_STYLES.FUNNY_FAIL : null;

  return (
    <div className="relative px-5 py-4 bg-quest-panel/90 backdrop-blur-sm">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-quest-border to-transparent" />

      {/* Narration result */}
      {lastScript && style && (
        <div className={`bubble-result mb-4 ${style.bg} ${style.text}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-semibold ${style.badge}`}>
              <span>{style.icon}</span> {style.label}
            </span>
            {lastSource && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-white/30">
                {lastSource}
              </span>
            )}
          </div>
          <p className="font-heading font-medium text-base leading-relaxed">{lastScript.narration}</p>
          {lastScript.prompt_feedback && (
            <p className="mt-3 text-xs opacity-80 border-t border-white/10 pt-3 leading-relaxed">
              {lastScript.prompt_feedback}
            </p>
          )}
          {lastScript.missing_elements && lastScript.missing_elements.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold opacity-70">Try adding:</span>
              {lastScript.missing_elements.map((el: string) => (
                <span key={el} className="text-xs px-2 py-0.5 rounded-full bg-white/10 font-medium">
                  {el}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="bubble-result mb-4 bg-red-900/30 border-red-500/40 text-red-200 flex justify-between items-center">
          <p className="text-sm">{error}</p>
          <button onClick={clearError} className="text-red-400 hover:text-red-200 ml-3 text-lg leading-none">&times;</button>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            value={userInput}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
            onKeyDown={handleKeyDown}
            placeholder={TASK_PLACEHOLDERS[currentTask] ?? TASK_PLACEHOLDERS['monster-party']}
            disabled={isLoading}
            rows={2}
            maxLength={MAX_INPUT_LENGTH}
            className="input-magic pr-14"
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <VoiceButton onTranscript={setInput} disabled={isLoading} />
          </div>
          {userInput.length > MAX_INPUT_LENGTH * 0.8 && (
            <div className="absolute right-14 bottom-2.5 text-[10px] text-purple-300/50 font-mono">
              {userInput.length}/{MAX_INPUT_LENGTH}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          className="btn-game bg-gradient-to-b from-quest-gold to-amber-600 text-quest-bg
                     border-2 border-yellow-400/50 shadow-glow-gold
                     hover:from-yellow-300 hover:to-amber-500
                     disabled:from-gray-600 disabled:to-gray-700 disabled:border-gray-600 disabled:text-gray-400
                     disabled:shadow-none
                     text-base px-7 py-4 whitespace-nowrap"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Thinking...
            </span>
          ) : (
            'Try It!'
          )}
        </button>
      </form>
    </div>
  );
}
