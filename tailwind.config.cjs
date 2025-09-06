/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9edff",
          200: "#bde0ff",
          300: "#90cbff",
          400: "#5aacff",
          500: "#2c90ff",
          600: "#1173e6",
          700: "#0a5bc1",
          800: "#0b4a99",
          900: "#0d3f7d",
        }
      }
    },
  },
  plugins: [],
};
