/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a192f',
          800: '#0f172a',
          700: '#1e293b',
          600: '#334155',
        },
        primary: {
          DEFAULT: '#0284c7', // sky-600
          dark: '#0369a1',    // sky-700
          light: '#38bdf8',   // sky-400
          subtle: '#e0f2fe',  // sky-100
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 25px -4px rgba(15, 23, 42, 0.08)',
        'glow': '0 0 25px -5px rgba(56, 189, 248, 0.35)',
      },
    },
  },
  plugins: [],
}
