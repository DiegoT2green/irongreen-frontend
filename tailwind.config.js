/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mint: '#77c7bf',
        'mint-light': '#81d6cd',
        petrol: '#457f92',
      },
    },
  },
  plugins: [],
}
