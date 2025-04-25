/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#18181b",
        secondary: "#f5f5dc", // Beige background from mockups
        accent: "#3b82f6",
      },
    },
  },
  plugins: [],
}; 