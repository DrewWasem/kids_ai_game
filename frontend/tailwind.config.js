/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Nunito', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      colors: {
        quest: {
          bg: '#0F0A1A',
          panel: '#1A0F2E',
          card: '#231546',
          surface: '#2D1B69',
          border: '#3D2B7A',
          'border-light': '#4C3D8F',
          accent: '#8B5CF6',
          purple: '#6C3FC5',
          glow: '#A78BFA',
          gold: '#fbbf24',
          orange: '#FF8C42',
          'orange-light': '#FFB380',
          blue: '#60A5FA',
          pink: '#f472b6',
          green: '#34D399',
          red: '#F87171',
          'red-soft': '#FCA5A5',
          text: {
            bright: '#FFFFFF',
            primary: '#E8E0F7',
            secondary: '#B8A9D4',
            dim: '#8B7AAE',
            muted: '#6B5C8A',
          },
        },
      },
      boxShadow: {
        'glow-purple': '0 0 24px rgba(139, 92, 246, 0.25), 0 0 60px rgba(139, 92, 246, 0.1)',
        'glow-gold': '0 0 20px rgba(251, 191, 36, 0.3), 0 0 60px rgba(251, 191, 36, 0.1)',
        'glow-orange': '0 0 20px rgba(255, 140, 66, 0.25)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
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
      },
    },
  },
  plugins: [],
};
