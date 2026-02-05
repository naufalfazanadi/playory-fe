/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6ECBFF', // Light Blue
          DEFAULT: '#7A6CFF', // Purple
          dark: '#5e52cc',
        },
        secondary: {
          DEFAULT: '#FF7EB6', // Pink
        },
        status: {
          backlog: '#94a3b8',   // Gray
          paused: '#fbbf24',    // Yellow
          playing: '#3b82f6',   // Blue
          completed: '#10b981', // Green
          dropped: '#ef4444',   // Red
        }
      }
    },
  },
  plugins: [],
}
