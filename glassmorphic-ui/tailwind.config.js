/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'glass-bg-light': 'rgba(255, 255, 255, 0.18)',
        'glass-bg-medium': 'rgba(255, 255, 255, 0.28)',
        'glass-border': 'rgba(255, 255, 255, 0.4)',
        'accent-blue': '#38bdf8',
        'accent-indigo': '#818cf8',
        'accent-pink': '#ec4899',
        'accent-mint': '#34d399',
        'text-primary': '#f8fafc',
        'text-secondary': '#cbd5e1',
      },
      backdropBlur: {
        'glass-sm': '10px',
        'glass-md': '15px',
        'glass-lg': '20px',
        'glass-xl': '25px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 12px 48px 0 rgba(31, 38, 135, 0.45)',
        'glow-blue': '0 0 20px rgba(56, 189, 248, 0.5)',
        'glow-indigo': '0 0 20px rgba(129, 140, 248, 0.5)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.5)',
        'glow-mint': '0 0 20px rgba(52, 211, 153, 0.5)',
      },
    },
  },
  plugins: [],
}
