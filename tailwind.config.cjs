/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}', './public/**/*.html'],
  theme: {
    extend: {
      boxShadow: { card: '0 2px 8px rgba(0,0,0,.06)' }
    }
  },
  plugins: []
}
