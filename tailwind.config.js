/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'primary': '#0F0F0F',
        'secondary': '#18191A',
        'footer': '#070707',
        'wallet-color': '#0066AA',
        'number-red' : '#C92A34',
        'number-green': '#2BB12B',
        'number-black': '#292835'
      },
      borderColor: {
        'primary': '#323232'
      },
      textColor: {
        'primary': '#FFF',
        'number-red' : '#C92A34',
        'number-green': '#2BB12B',
        'chat-green': '#16BCDB',
        'chat-red': '#E54545'
      },
      animation: {
        'spin': 'spin 6s linear infinite'
      }
    },
  },
  plugins: [],
}