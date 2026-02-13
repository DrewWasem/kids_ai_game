/**
 * MadLibsInput — Fill-in-the-blank selector UI for the Mad Libs system.
 *
 * Replaces PromptInput when a quest stage uses the Mad Libs format.
 * Shows template sentence with clickable blanks, option grid pickers,
 * and GO/Randomize/New Words buttons.
 */

import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useTTS } from '../hooks/useTTS';
import type { QuestStage, SlotOption, Vignette } from '../types/madlibs';
import { resolveVignette, buildVignetteScript } from '../services/vignette-resolver';
import { generateOptions } from '../services/option-generator';
import FeedbackCard from './FeedbackCard';

interface MadLibsInputProps {
  stage: QuestStage;
}

export default function MadLibsInput({ stage }: MadLibsInputProps) {
  const {
    setLastScript,
    setVignetteSteps,
    isLoading,
  } = useGameStore();

  const { speak } = useTTS();

  // Per-slot options (may be default or Claude-generated)
  const [slotOptions, setSlotOptions] = useState<Record<string, SlotOption[]>>(() => {
    const initial: Record<string, SlotOption[]> = {};
    for (const slot of stage.template.slots) {
      initial[slot.id] = slot.defaultOptions;
    }
    return initial;
  });

  // Selected tag per slot
  const [selectedTags, setSelectedTags] = useState<Record<string, string>>({});

  // Which slot picker is currently open
  const [openSlot, setOpenSlot] = useState<string | null>(null);

  // Loading state for option generation
  const [isGenerating, setIsGenerating] = useState(false);

  // Feedback state after vignette plays
  const [feedback, setFeedback] = useState<{
    vignette: Vignette;
    filledSentence: string;
  } | null>(null);

  // Discovered vignettes tracking
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(new Set());

  // Playing state
  const [isPlaying, setIsPlaying] = useState(false);

  // Generate fresh options on mount (hidden behind intro text)
  useEffect(() => {
    let cancelled = false;
    setIsGenerating(true);

    generateOptions(stage, 0).then(options => {
      if (!cancelled) {
        setSlotOptions(options);
        setIsGenerating(false);
      }
    });

    return () => { cancelled = true; };
  }, [stage]);

  // Reset when stage changes
  useEffect(() => {
    setSelectedTags({});
    setFeedback(null);
    setOpenSlot(null);
    setIsPlaying(false);
  }, [stage.id]);

  const handleSelectTag = useCallback((slotId: string, tag: string) => {
    setSelectedTags(prev => ({ ...prev, [slotId]: tag }));
    setOpenSlot(null);
  }, []);

  const handleRandomize = useCallback(() => {
    const randomized: Record<string, string> = {};
    for (const slot of stage.template.slots) {
      const options = slotOptions[slot.id] ?? slot.defaultOptions;
      const pick = options[Math.floor(Math.random() * options.length)];
      randomized[slot.id] = pick.tag;
    }
    setSelectedTags(randomized);
    setOpenSlot(null);
  }, [stage, slotOptions]);

  const handleRefreshOptions = useCallback(async () => {
    setIsGenerating(true);
    try {
      const options = await generateOptions(stage, discoveredIds.size);
      setSlotOptions(options);
    } catch {
      // Keep current options
    }
    setIsGenerating(false);
  }, [stage, discoveredIds.size]);

  const handleGo = useCallback(() => {
    // Check all slots have a selection
    const allSelected = stage.template.slots.every(s => selectedTags[s.id]);
    if (!allSelected) return;

    setIsPlaying(true);
    setFeedback(null);

    // Resolve vignette from tags
    const vignette = resolveVignette(selectedTags, stage);
    const script = buildVignetteScript(vignette, selectedTags);

    // Track discovery
    setDiscoveredIds(prev => new Set([...prev, vignette.id]));

    // Build filled sentence for display
    let filledSentence = stage.template.sentence;
    for (const slot of stage.template.slots) {
      const tag = selectedTags[slot.id];
      const option = (slotOptions[slot.id] ?? slot.defaultOptions).find(o => o.tag === tag);
      const label = option?.label ?? tag;
      filledSentence = filledSentence.replace(`{${slot.id}}`, `**${label}**`);
    }

    // Send to playback engine
    setLastScript(script);
    setVignetteSteps(vignette.steps);

    // Read narration
    if (script.narration) {
      speak(script.narration);
    }

    // Show feedback after vignette duration (~3-5s)
    const totalDuration = vignette.steps.reduce(
      (sum, step) => sum + (step.delayAfter ?? 0.5) * 1000 + 800,
      0
    );
    setTimeout(() => {
      setFeedback({ vignette, filledSentence });
      setIsPlaying(false);
    }, Math.min(totalDuration + 500, 8000));
  }, [selectedTags, stage, slotOptions, setLastScript, setVignetteSteps, speak]);

  const handleTryAgain = useCallback(() => {
    setFeedback(null);
    setSelectedTags({});
    setVignetteSteps(null);
  }, [setVignetteSteps]);

  const allSelected = stage.template.slots.every(s => selectedTags[s.id]);

  return (
    <div className="relative px-5 py-4 bg-quest-panel-bg/90 backdrop-blur-sm">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-quest-purple/30 to-transparent" />

      {/* Feedback card (shown after vignette) */}
      {feedback && (
        <div className="mb-4">
          <FeedbackCard
            feedback={feedback.vignette.feedback}
            promptScore={feedback.vignette.promptScore}
            filledSentence={feedback.filledSentence}
            discoveredCount={discoveredIds.size}
            totalVignettes={stage.vignettes.length + 1}
            onTryAgain={handleTryAgain}
          />
        </div>
      )}

      {/* Template sentence with blanks */}
      {!feedback && (
        <>
          <div className="mb-4">
            <TemplateSentence
              sentence={stage.template.sentence}
              slots={stage.template.slots}
              selectedTags={selectedTags}
              slotOptions={slotOptions}
              openSlot={openSlot}
              onOpenSlot={setOpenSlot}
              isDisabled={isPlaying || isLoading}
            />
          </div>

          {/* Slot option pickers */}
          {openSlot && (
            <SlotPicker
              slot={stage.template.slots.find(s => s.id === openSlot)!}
              options={slotOptions[openSlot] ?? []}
              selectedTag={selectedTags[openSlot]}
              onSelect={(tag) => handleSelectTag(openSlot, tag)}
              onClose={() => setOpenSlot(null)}
              isGenerating={isGenerating}
            />
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleRandomize}
              disabled={isPlaying}
              className="btn-game text-sm px-4 py-2.5 rounded-xl border-2
                bg-white/60 text-quest-text-mid border-quest-border
                hover:border-quest-purple/50 hover:text-quest-text-dark
                disabled:opacity-50 disabled:cursor-not-allowed font-heading font-semibold"
            >
              {'\u{1F3B2}'} Randomize
            </button>

            <button
              onClick={handleRefreshOptions}
              disabled={isPlaying || isGenerating}
              className="btn-game text-sm px-4 py-2.5 rounded-xl border-2
                bg-white/60 text-quest-text-mid border-quest-border
                hover:border-quest-orange/50 hover:text-quest-text-dark
                disabled:opacity-50 disabled:cursor-not-allowed font-heading font-semibold"
            >
              {isGenerating ? (
                <span className="flex items-center gap-1.5">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading...
                </span>
              ) : (
                <>{'\u{1F504}'} New Words!</>
              )}
            </button>

            <div className="flex-1" />

            <button
              onClick={handleGo}
              disabled={!allSelected || isPlaying}
              className="btn-primary text-lg px-8 py-3 min-w-[140px] rounded-xl font-heading font-bold
                disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isPlaying ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Playing...
                </span>
              ) : (
                <>{'\u{25B6}\u{FE0F}'} GO!</>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── TEMPLATE SENTENCE ──────────────────────────────────────────────────────

function TemplateSentence({
  sentence,
  slots,
  selectedTags,
  slotOptions,
  openSlot,
  onOpenSlot,
  isDisabled,
}: {
  sentence: string;
  slots: import('../types/madlibs').TemplateSlot[];
  selectedTags: Record<string, string>;
  slotOptions: Record<string, SlotOption[]>;
  openSlot: string | null;
  onOpenSlot: (id: string | null) => void;
  isDisabled: boolean;
}) {
  // Split sentence by {SLOT_ID} placeholders
  const parts = sentence.split(/\{(\w+)\}/g);

  return (
    <div className="text-lg font-body font-bold text-quest-text-dark leading-relaxed flex flex-wrap items-baseline gap-1">
      {parts.map((part, i) => {
        // Odd indices are slot IDs from the regex capture group
        if (i % 2 === 1) {
          const slot = slots.find(s => s.id === part);
          if (!slot) return <span key={i}>{part}</span>;

          const tag = selectedTags[slot.id];
          const options = slotOptions[slot.id] ?? slot.defaultOptions;
          const selected = tag ? options.find(o => o.tag === tag) : null;
          const isOpen = openSlot === slot.id;

          return (
            <button
              key={i}
              onClick={() => !isDisabled && onOpenSlot(isOpen ? null : slot.id)}
              disabled={isDisabled}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg border-2 border-dashed
                transition-all duration-200 font-heading font-bold
                ${selected
                  ? 'bg-quest-purple/15 border-quest-purple/50 text-quest-purple'
                  : 'bg-white/60 border-quest-border text-quest-text-muted hover:border-quest-purple/40'
                }
                ${isOpen ? 'ring-2 ring-quest-purple/30 border-quest-purple' : ''}
                ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
              `}
            >
              <span className="text-base">{selected?.icon ?? slot.icon}</span>
              <span className="text-sm">
                {selected?.label ?? `${slot.label}...`}
              </span>
              <span className="text-xs text-quest-text-muted">{'\u{25BC}'}</span>
            </button>
          );
        }

        return <span key={i}>{part}</span>;
      })}
    </div>
  );
}

// ─── SLOT PICKER ────────────────────────────────────────────────────────────

function SlotPicker({
  slot,
  options,
  selectedTag,
  onSelect,
  onClose,
  isGenerating,
}: {
  slot: import('../types/madlibs').TemplateSlot;
  options: SlotOption[];
  selectedTag?: string;
  onSelect: (tag: string) => void;
  onClose: () => void;
  isGenerating: boolean;
}) {
  return (
    <div className="mb-3 animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <span className="font-heading font-bold text-sm text-quest-text-dark">
          {slot.icon} Pick {slot.label}:
        </span>
        <button
          onClick={onClose}
          className="text-quest-text-muted hover:text-quest-text-dark text-sm px-2"
        >
          {'\u{2715}'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {isGenerating ? (
          // Shimmer placeholders
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-quest-border/30 animate-pulse"
            />
          ))
        ) : (
          options.map((option) => (
            <button
              key={option.tag}
              onClick={() => onSelect(option.tag)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all duration-150
                font-heading font-semibold text-sm
                ${selectedTag === option.tag
                  ? 'bg-quest-purple/15 border-quest-purple text-quest-purple shadow-md scale-105'
                  : 'bg-white/70 border-quest-border text-quest-text-dark hover:border-quest-purple/40 hover:bg-white hover:scale-102'
                }
              `}
            >
              <span className="text-lg">{option.icon}</span>
              <span className="truncate">{option.label}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
