// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",      // Next.js app directory
    "./pages/**/*.{js,ts,jsx,tsx}",    // Next.js pages directory
    "./components/**/*.{js,ts,jsx,tsx}",// Components directory
  ],
  theme: {
    extend: {
      colors: {
        'pastel-purple': '#D8B4FE',    // Pastel purple background
        'element-blue': '#93C5FD',      // Blue for grid elements
      },
    },
  },
  plugins: [],
}
