// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {

  darkMode: 'class',
  content: [
    "./index.html",
    // CRITICAL: This line tells Tailwind where to look for classes
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}