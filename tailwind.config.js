/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'bk': ['BK Font', 'sans-serif'],
      },
      screens: {
        '1096': '1096px',
      }
    },
  },
  plugins: [],
}