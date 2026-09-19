/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-0': '#02060D',
        'bg-1': '#060D18',
        'bg-2': '#0B1626',
        'bg-3': '#101F34',
        'surface-card': '#0B1626',
        'surface-glass': 'rgba(11, 22, 38, 0.75)',
        'surface-elevated': '#13233A',
        'border-subtle': 'rgba(255, 255, 255, 0.08)',
        'border-strong': 'rgba(255, 255, 255, 0.15)',
        'border-cyan': 'rgba(56, 189, 248, 0.3)',
        'border-red': 'rgba(239, 68, 68, 0.35)',
        'brand-red': '#E11D2A',
        'brand-red-bright': '#FF3B3B',
        'brand-cyan': '#38BDF8',
        'brand-blue': '#2563EB',
        'brand-emerald': '#10B981',
        'brand-amber': '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 24px rgba(225, 29, 42, 0.35)',
        'glow-cyan': '0 0 24px rgba(56, 189, 248, 0.25)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.25)',
      },
    },
  },
  plugins: [],
}
