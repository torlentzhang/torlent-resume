/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#165DFF',
        'text-primary': '#1D2129',
        'text-secondary': '#4E5969',
        border: '#E5E6EB',
        'tag-bg': '#F2F3F5',
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
