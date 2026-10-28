/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        loki: {
          primary: '#F6B6C8',
          light: '#FCE4EC',
          soft: '#FDF2F4',
          bg: '#FFF9FB',
          text: '#3A3033',
          dark: '#C85C7A',
          deep: '#A33E5D',
          lavender: '#F5EEF8',
          champagne: '#F7EDE2',
          muted: '#8D7F84',
          border: '#F2D7E0',
          glass: 'rgba(255, 255, 255, 0.75)'
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        sans: ['Montserrat', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft-glow': '0 0 25px rgba(246, 182, 200, 0.45)',
        'loki': '0 10px 30px -5px rgba(200, 92, 122, 0.08), 0 4px 10px -2px rgba(200, 92, 122, 0.04)',
        'glass': '0 8px 32px 0 rgba(200, 92, 122, 0.1)'
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}

