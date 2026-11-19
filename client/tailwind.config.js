/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          950: '#05070B',
          900: '#0B0F17',
          850: '#0F1623',
          800: '#141E30',
          700: '#1E2D4A',
          600: '#2A3F66',
          500: '#3D5B94',
        },
        neon: {
          green: '#00FF88',
          cyan: '#00F0FF',
          blue: '#3B82F6',
          purple: '#A855F7',
          pink: '#EC4899',
          amber: '#F59E0B'
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'neon-green': '0 0 20px -3px rgba(0, 255, 136, 0.25)',
        'neon-cyan': '0 0 20px -3px rgba(0, 240, 255, 0.25)',
        'cyber-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
}
