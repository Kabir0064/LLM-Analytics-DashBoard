/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'text-blue-600',
    'text-green-600',
    'text-purple-600',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}