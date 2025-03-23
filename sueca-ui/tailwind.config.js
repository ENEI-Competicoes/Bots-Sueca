/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"], 
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out'
      },
    },
  },
  plugins: [],
};


