/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFA',
        surface: '#F5F5F5',
        dark: '#111111',
        gray: {
          100: '#F5F5F5',
          200: '#E5E5E5',
          400: '#9E9E9E',
          600: '#666666',
          800: '#222222',
        },
        accent: '#6DA9E4',
      },
    },
  },
  plugins: [],
}