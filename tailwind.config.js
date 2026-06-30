/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: '#f1f9f3',
          100: '#dcefe1',
          200: '#bbdfc6',
          300: '#8fc8a3',
          400: '#5fab7c',
          500: '#3f8f5f',
          600: '#2f724a',
          700: '#275c3d',
          800: '#224a33',
          900: '#1d3e2b',
        },
      },
    },
  },
  plugins: [],
}
