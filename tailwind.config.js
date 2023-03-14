/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    // "./pages/**/*.{js,ts,jsx,tsx}",
    // "./components/**/*.{js,ts,jsx,tsx}",
    // "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#14B6DA',
        'secondary': '#F2F0FF',
        'accent': '#221C3E',
        'input': '#252836',
        'background': '#221c3e',
        'background-secondary': '#252836'
      },
      textColor: {
        'primay': '#F2F0FF',
        'link':  '#14B6DA'
      }
    },
  },
  plugins: [],
}
