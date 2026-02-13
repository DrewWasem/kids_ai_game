/**
 * FeedbackCard — Post-vignette results card for Mad Libs mode.
 *
 * Shows prompt score, reconstructed sentence, skill taught, tip,
 * and action buttons (Try Again / Next Stage).
 */

import type { VignetteFeedback, PromptScore } from '../types/madlibs';

const SCORE_STYLES: Record<PromptScore, {
  bg: string;
  border: string;
  badge: string;
  label: string;
  icon: string;
}> = {
  perfect: {
    bg: 'bg-quest-success/10',
    border: 'border-quest-success/40',
    badge: 'bg-quest-success/20 text-quest-success',
    label: 'PERFECT!',
    icon: '\u{1F31F}',
  },
  partial: {
    bg: 'bg-quest-yellow/10',
    border: 'border-quest-yellow/40',
    badge: 'bg-quest-yellow/20 text-amber-600',
    label: 'Not Bad!',
    icon: '\u{1F4A1}',
  },
  chaotic: {
    bg: 'bg-quest-orange/10',
    border: 'border-quest-orange/40',
    badge: 'bg-quest-orange/20 text-quest-orange',
    label: 'CHAOS!',
    icon: '\u{1F525}',
  },
  funny_fail: {
    bg: 'bg-quest-purple/10',
    border: 'border-quest-purple/40',
    badge: 'bg-quest-purple/20 text-quest-purple',
    label: 'LOL!',
    icon: '\u{1F602}',
  },
};

interface FeedbackCardProps {
  feedback: VignetteFeedback;
  promptScore: PromptScore;
  filledSentence: string;
  discoveredCount: number;
  totalVignettes: number;
  onTryAgain: () => void;
  onNextStage?: () => void;
}

export default function FeedbackCard({
  feedback,
  promptScore,
  filledSentence,
  discoveredCount,
  totalVignettes,
  onTryAgain,
  onNextStage,
}: FeedbackCardProps) {
  const style = SCORE_STYLES[promptScore] ?? SCORE_STYLES.partial;

  return (
    <div className={`animate-slide-up border-2 rounded-game-md p-5 ${style.bg} ${style.border}`}>
      {/* Score badge + title */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-heading font-bold animate-bounce-in ${style.badge}`}>
            <span className="text-lg">{style.icon}</span> {style.label}
          </span>
          <span className="font-heading font-bold text-lg text-quest-text-dark">
            {feedback.title}
          </span>
        </div>
        <span className="text-xs text-quest-text-muted font-mono">
          {discoveredCount}/{totalVignettes} discovered
        </span>
      </div>

      {/* Filled sentence */}
      <p className="text-sm text-quest-text-mid italic mb-3 bg-white/50 rounded-lg px-3 py-2">
        {filledSentence}
      </p>

      {/* Feedback message */}
      <p className="font-body font-bold text-base text-quest-text-dark leading-relaxed mb-2">
        {feedback.message}
      </p>

      {/* Skill + Tip */}
      <div className="flex items-start gap-2 mt-3 pt-3 border-t border-quest-purple/10">
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-quest-purple/10 text-quest-purple whitespace-nowrap">
          {feedback.skillTaught}
        </span>
        <p className="text-sm text-quest-text-mid leading-relaxed">
          {feedback.tip}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={onTryAgain}
          className="btn-game text-sm px-5 py-2.5 rounded-xl border-2
            bg-white/60 text-quest-text-dark border-quest-border
            hover:border-quest-purple/50 hover:bg-quest-panel-bg font-heading font-bold"
        >
          {'\u{1F3B2}'} Try Again
        </button>
        {onNextStage && (
          <button
            onClick={onNextStage}
            className="btn-primary text-sm px-5 py-2.5 rounded-xl font-heading font-bold"
          >
            Next Stage {'\u{25B6}'}
          </button>
        )}
      </div>
    </div>
  );
}
