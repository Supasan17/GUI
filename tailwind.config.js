/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#fdf6ee',
          100: '#fae8d0',
          200: '#f5cd9f',
          300: '#efac65',
          400: '#e8883b',
          500: '#e36a1c',
          600: '#d45112',
          700: '#b03b11',
          800: '#8c2f14',
          900: '#722814',
          950: '#3e1208',
        },
        surface: {
          DEFAULT: '#fafaf8',
          dark:    '#0f0f0e',
        }
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-up':   'slideUp 0.4s ease forwards',
        'scale-in':   'scaleIn 0.3s ease forwards',
        'shimmer':    'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn:   { from: { opacity: '0' },                    to: { opacity: '1' } },
        slideUp:  { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:  { from: { opacity: '0', transform: 'scale(0.95)' },      to: { opacity: '1', transform: 'scale(1)' } },
        shimmer:  { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
