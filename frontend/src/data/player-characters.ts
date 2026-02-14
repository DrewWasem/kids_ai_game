import type { CharacterKey } from './asset-manifest';

export interface PlayerCharacterOption {
  id: CharacterKey;
  displayName: string;
  emoji: string;
  bgGradient: string;
  borderColor: string;
  description: string;
}

export const PLAYER_CHARACTERS: PlayerCharacterOption[] = [
  {
    id: 'knight',
    displayName: 'Knight',
    emoji: '\u{1F6E1}\u{FE0F}',
    bgGradient: 'from-blue-400 to-blue-600',
    borderColor: 'border-blue-400',
    description: 'Brave & bold',
  },
  {
    id: 'mage',
    displayName: 'Mage',
    emoji: '\u{1FA84}',
    bgGradient: 'from-purple-400 to-indigo-600',
    borderColor: 'border-purple-400',
    description: 'Wise & magical',
  },
  {
    id: 'barbarian',
    displayName: 'Barbarian',
    emoji: '\u{1FA93}',
    bgGradient: 'from-red-400 to-orange-600',
    borderColor: 'border-red-400',
    description: 'Strong & fierce',
  },
  {
    id: 'ninja',
    displayName: 'Ninja',
    emoji: '\u{1F977}',
    bgGradient: 'from-gray-600 to-gray-800',
    borderColor: 'border-gray-500',
    description: 'Quick & stealthy',
  },
  {
    id: 'space_ranger',
    displayName: 'Space Ranger',
    emoji: '\u{1F680}',
    bgGradient: 'from-cyan-400 to-teal-600',
    borderColor: 'border-cyan-400',
    description: 'Cosmic explorer',
  },
  {
    id: 'witch',
    displayName: 'Witch',
    emoji: '\u{1F9D9}',
    bgGradient: 'from-emerald-400 to-green-700',
    borderColor: 'border-emerald-400',
    description: 'Potions & spells',
  },
  {
    id: 'robot',
    displayName: 'Robot',
    emoji: '\u{1F916}',
    bgGradient: 'from-slate-400 to-sky-600',
    borderColor: 'border-slate-400',
    description: 'Beep boop!',
  },
  {
    id: 'clown',
    displayName: 'Clown',
    emoji: '\u{1F921}',
    bgGradient: 'from-yellow-400 to-pink-500',
    borderColor: 'border-yellow-400',
    description: 'Silly & fun',
  },
];
