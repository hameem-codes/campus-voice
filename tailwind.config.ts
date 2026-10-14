import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './views/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neo-accent': '#FF6B6B',
        'neo-secondary': '#FFD93D',
        'neo-muted': '#C4B5FD',
        canvas: 'var(--bg-canvas)',
        surface: 'var(--bg-surface)',
        muted: 'var(--bg-muted)',
        border: 'var(--border)',
        ink: 'var(--text-1)',
        copy: 'var(--text-2)',
        faint: 'var(--text-3)',
        action: 'var(--action)',
        'chip-orange-bg': 'var(--chip-orange-bg)',
        'chip-orange-fg': 'var(--chip-orange-fg)',
        'chip-green-bg': 'var(--chip-green-bg)',
        'chip-green-fg': 'var(--chip-green-fg)',
        'chip-blue-bg': 'var(--chip-blue-bg)',
        'chip-blue-fg': 'var(--chip-blue-fg)'
      },
      boxShadow: {
        'neo-sm': '3px 3px 0px 0px #000',
        'neo-md': '5px 5px 0px 0px #000',
        'neo-lg': '8px 8px 0px 0px #000',
        'neo-xl': '12px 12px 0px 0px #000',
      },
      borderRadius: {
        panel: 'var(--radius-panel)',
        card: 'var(--radius-card)',
        control: 'var(--radius-control)',
        chip: 'var(--radius-chip)'
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        6: 'var(--space-6)',
        8: 'var(--space-8)'
      }
    }
  },
  plugins: []
}

export default config
