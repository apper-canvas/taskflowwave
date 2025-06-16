/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5B21B6",
        secondary: "#8B5CF6", 
        accent: "#EC4899",
        surface: "#FAFAFA",
        background: "#FFFFFF",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6"
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui"],
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      animation: {
        'pulse-gentle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spring': 'spring 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'slide-right': 'slideRight 0.3s ease-out forwards'
      },
      keyframes: {
        spring: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' }
        },
        slideRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(20px)', opacity: '0.7' }
        }
      }
    }
  },
  plugins: []
};