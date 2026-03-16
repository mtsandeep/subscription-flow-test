/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neo-brutalism palette
        primary: {
          DEFAULT: '#10B981', // Green
          light: '#34D399',
          dark: '#059669',
        },
        secondary: {
          DEFAULT: '#8B5CF6', // Purple
          light: '#A78BFA',
          dark: '#7C3AED',
        },
        accent: {
          DEFAULT: '#FBBF24', // Yellow for contrast
          light: '#FCD34D',
        },
        dark: {
          DEFAULT: '#1F2937',
          lighter: '#374151',
          dark: '#111827',
          darkest: '#0D1117',
        },
        brutal: {
          black: '#000000',
          white: '#FFFFFF',
        }
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'brutal-sm': '2px 2px 0px 0px rgba(0, 0, 0, 1)',
        'brutal-lg': '6px 6px 0px 0px rgba(0, 0, 0, 1)',
        'brutal-primary': '4px 4px 0px 0px #10B981',
        'brutal-secondary': '4px 4px 0px 0px #8B5CF6',
        'brutal-hover': '2px 2px 0px 0px rgba(0, 0, 0, 1)',
      },
      fontFamily: {
        'brutal': ['Space Grotesk', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
