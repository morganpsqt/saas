/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        maya: {
          bg: '#fafaf9',
          panel: '#ffffff',
          panelAlt: '#f5f5f4',
          border: '#e7e5e4',
          borderStrong: '#d6d3d1',
          accent: '#10b981',
          accentDark: '#059669',
          accentSoft: '#d1fae5',
          orange: '#f59e0b',
          orangeSoft: '#fef3c7',
          text: '#1c1917',
          muted: '#78716c',
          mutedSoft: '#a8a29e',
          danger: '#ef4444',
          success: '#10b981',
        },
        cat: {
          body: '#8b5cf6',
          nutrition: '#10b981',
          training: '#f59e0b',
          lifestyle: '#0ea5e9',
          mindset: '#ec4899',
        },
      },
    },
  },
  plugins: [],
};
