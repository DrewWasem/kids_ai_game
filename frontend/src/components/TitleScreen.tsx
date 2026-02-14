import type { CharacterKey } from '../data/asset-manifest';
import { PLAYER_CHARACTERS } from '../data/player-characters';

interface TitleScreenProps {
  onSelectCharacter: (id: CharacterKey) => void;
}

export default function TitleScreen({ onSelectCharacter }: TitleScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-quest-page-bg stars-bg-light px-6">
      {/* Logo */}
      <div className="font-display text-6xl sm:text-7xl font-bold flex items-center gap-3 mb-2">
        <span className="text-5xl sm:text-6xl animate-sparkle">{'\u{2728}'}</span>
        <span className="bg-gradient-to-r from-quest-purple via-quest-orange to-quest-yellow bg-clip-text text-transparent">
          Quest AI
        </span>
      </div>

      <p className="font-heading text-lg text-quest-text-mid mb-8">
        Learn to talk to AI through play
      </p>

      {/* Character Selection */}
      <h2 className="font-heading font-bold text-xl text-quest-text-dark mb-4">
        Choose Your Hero!
      </h2>

      <div className="grid grid-cols-4 gap-3 max-w-xl w-full mb-12">
        {PLAYER_CHARACTERS.map((char) => (
          <button
            key={char.id}
            onClick={() => onSelectCharacter(char.id)}
            className={`group bg-gradient-to-br ${char.bgGradient} rounded-2xl p-3 border-2 ${char.borderColor}
              hover:scale-105 hover:border-white hover:shadow-lg
              active:scale-95
              transition-all duration-150 cursor-pointer text-center`}
          >
            <div className="text-3xl sm:text-4xl mb-1">{char.emoji}</div>
            <div className="font-heading font-bold text-xs sm:text-sm text-white drop-shadow-sm">
              {char.displayName}
            </div>
            <div className="text-[10px] sm:text-xs text-white/80 mt-0.5">
              {char.description}
            </div>
          </button>
        ))}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-5 py-4 border border-quest-purple/15 text-center">
          <div className="text-2xl mb-1">{'\u{1F3F0}'}</div>
          <h3 className="font-heading font-bold text-sm text-quest-text-dark">Explore</h3>
          <p className="text-xs text-quest-text-light mt-1">
            Roam a 3D village with 7 quest zones
          </p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-5 py-4 border border-quest-orange/15 text-center">
          <div className="text-2xl mb-1">{'\u{1F9E9}'}</div>
          <h3 className="font-heading font-bold text-sm text-quest-text-dark">Prompt</h3>
          <p className="text-xs text-quest-text-light mt-1">
            Fill in the blanks to command characters and props
          </p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-5 py-4 border border-quest-yellow/15 text-center">
          <div className="text-2xl mb-1">{'\u{1F3C6}'}</div>
          <h3 className="font-heading font-bold text-sm text-quest-text-dark">Earn Badges</h3>
          <p className="text-xs text-quest-text-light mt-1">
            Get more specific to unlock all 8 badges
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-[11px] text-quest-text-muted mt-12">
        Ages 8-10 {'\u{2022}'} Built for the Claude Code Hackathon 2026
      </p>
    </div>
  );
}
