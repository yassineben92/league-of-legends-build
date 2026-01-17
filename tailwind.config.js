/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hextech-gold': '#C8AA6E',
        'hextech-blue': '#0AC8B9',
        'void-purple': '#A020F0',
        'zaun-green': '#00FF00',
        'noxus-red': '#FF0000',
      },
    },
  },
  plugins: [],
}