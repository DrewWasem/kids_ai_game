/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Fredoka', 'Nunito', 'system-ui', 'sans-serif'],
        body: ['Nunito', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        quest: {
          // Primary Brand
          purple: '#7C3AED',
          'purple-deep': '#6D28D9',
          'purple-light': '#A78BFA',
          'purple-soft': '#C4B5FD',
          orange: '#FF8C42',
          'orange-deep': '#F97316',
          'orange-light': '#FDBA74',
          green: '#22C55E',
          'green-deep': '#16A34A',
          'green-light': '#86EFAC',
          yellow: '#FBBF24',
          'yellow-light': '#FDE68A',
          blue: '#38BDF8',
          'blue-deep': '#0EA5E9',
          'blue-light': '#7DD3FC',

          // Supporting & Celebration
          pink: '#EC4899',
          'pink-light': '#F9A8D4',
          violet: '#A78BFA',
          peach: '#FDBA74',
          mint: '#86EFAC',
          sunshine: '#FDE68A',

          // UI Backgrounds (Light Base)
          'page-bg': '#FAF7FF',
          'card-bg': '#FFFFFF',
          'panel-bg': '#F3EEFF',
          'border': '#E9DFFF',
          'border-light': '#F0EAFF',

          // Game Canvas (Dark Magic)
          'canvas-void': '#0F0A1A',
          'canvas-night': '#1A0F2E',
          'canvas-card': '#231546',
          'canvas-surface': '#2D1B69',
          'canvas-border': '#3D2B7A',
          'canvas-bg': '#1A0533',

          // Text
          text: {
            dark: '#1E1337',
            mid: '#4A3D6B',
            light: '#7B6FA0',
            muted: '#A99CC8',
            white: '#FFFFFF',
          },

          // Game States
          state: {
            thinking: '#38BDF8',
            animating: '#7C3AED',
            success: '#22C55E',
            'funny-fail': '#FBBF24',
            'try-again': '#FF8C42',
          },

          // Legacy compat (remove after full migration)
          bg: '#0F0A1A',
          panel: '#1A0F2E',
          card: '#231546',
          surface: '#2D1B69',
          accent: '#7C3AED',
          glow: '#A78BFA',
          gold: '#FBBF24',
        },
      },
      boxShadow: {
        'glow-purple': '0 0 24px rgba(124, 58, 237, 0.15), 0 0 60px rgba(124, 58, 237, 0.08)',
        'glow-gold': '0 0 20px rgba(251, 191, 36, 0.15), 0 0 60px rgba(251, 191, 36, 0.08)',
        'glow-orange': '0 0 20px rgba(255, 140, 66, 0.15)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.12)',
        'glow-blue': '0 0 20px rgba(56, 189, 248, 0.12)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.12)',
      },
      borderRadius: {
        'game-sm': '10px',
        'game-md': '16px',
        'game-lg': '22px',
        'game-xl': '30px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.1)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.15)' },
          '50%': { boxShadow: '0 0 30px rgba(124, 58, 237, 0.3), 0 0 60px rgba(124, 58, 237, 0.12)' },
        },
        'bounce-in': {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'twinkle': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
