/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#E24B4A', dark: '#A32D2D', light: '#FCEBEB' },
        surface:  { DEFAULT: '#111111', 2: '#1a1a1a', 3: '#222222', 4: '#2a2a2a' },
      },
      fontFamily: {
        sans:    ['"DM Sans"', 'sans-serif'],
        display: ['"Syne"',    'sans-serif'],
      },
    },
  },
  plugins: [],
}
