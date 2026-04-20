/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        maya: {
          bg: '#0B0F14',
          panel: '#141A22',
          border: '#1F2937',
          accent: '#22D3EE',
          accentDark: '#0891B2',
          text: '#E5E7EB',
          muted: '#9CA3AF',
          danger: '#EF4444',
          success: '#10B981',
        },
      },
    },
  },
  plugins: [],
};
