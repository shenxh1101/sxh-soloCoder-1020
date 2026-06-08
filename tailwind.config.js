/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'game-dark': '#0f1729',
        'game-blue': '#1a2744',
        'game-blue-light': '#4a6fa5',
        'game-gold': '#e8c170',
        'game-wood': '#3a2412',
        'game-wood-light': '#5a3a1a',
        'game-cream': '#f0e6d2',
        'game-green': '#6a8c5f',
        'game-red': '#e06c75',
        'game-gray': '#a0a0a0',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', '"VT323"', 'monospace'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'wave': 'wave 2s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(3px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
