/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#060a14',
        bg2: '#0a0f1c',
        surface: '#11182c',
        surface2: '#171f38',
        surface3: '#1e2746',
        bd: '#232c4e',
        bd2: '#32406e',
        ink: '#e9edf8',
        dim: '#a8b3d4',
        mute: '#69749b',
        // node-type accents
        nApp: '#2fe39a',
        nData: '#b07cff',
        nCache: '#21d4fd',
        nExt: '#ffb224',
        nSec: '#ff7b7b',
        nNet: '#38bdf8',
        emerald2: '#ff4d9d',
        teal2: '#21d4fd',
      },
      fontFamily: {
        mono: ['Roboto Mono', 'ui-monospace', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 28px rgba(0,0,0,.45)',
      },
      keyframes: {
        shine: { to: { backgroundPosition: '200% center' } },
        pulse2: {
          '0%': { boxShadow: '0 0 0 0 rgba(33,212,253,.55)' },
          '70%': { boxShadow: '0 0 0 9px rgba(33,212,253,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(33,212,253,0)' },
        },
      },
      animation: {
        shine: 'shine 7s linear infinite',
        pulse2: 'pulse2 2.2s infinite',
      },
    },
  },
  plugins: [],
}
