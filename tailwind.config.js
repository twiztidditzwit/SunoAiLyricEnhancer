/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
          'brand-primary': '#4f46e5',
          'brand-secondary': '#7c3aed',
          'base-100': '#0f172a',
          'base-200': '#1e293b',
          'base-300': '#334155',
          'content-100': '#cbd5e1',
          'content-200': '#94a3b8',
        },
        keyframes: {
          'gradient-bg': {
            '0%, 100%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
          },
          'text-shimmer': {
            '0%, 100%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
          },
          'fade-in-up': {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
        },
        animation: {
          'gradient-bg': 'gradient-bg 15s ease infinite',
          'text-shimmer': 'text-shimmer 5s ease infinite',
          'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        },
        backgroundSize: {
          '400%': '400% 400%',
        }
      },
  },
  plugins: [],
}
