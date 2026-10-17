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
        canvas: 'var(--bg-canvas)',
        surface: 'var(--bg-surface)',
        muted: 'var(--bg-muted)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        ink: 'var(--text-1)',
        copy: 'var(--text-2)',
        faint: 'var(--text-3)',
        action: 'var(--action)',
        'action-hover': 'var(--action-hover)',
        'action-fg': 'var(--action-fg)',
        'chip-neutral-bg': 'var(--chip-neutral-bg)',
        'chip-neutral-fg': 'var(--chip-neutral-fg)',
        'chip-neutral-border': 'var(--chip-neutral-border)',
        'chip-urgent-bg': 'var(--chip-urgent-bg)',
        'chip-urgent-fg': 'var(--chip-urgent-fg)',
        'chip-urgent-border': 'var(--chip-urgent-border)',
        'chip-accent-bg': 'var(--chip-accent-bg)',
        'chip-accent-fg': 'var(--chip-accent-fg)',
        'chip-accent-border': 'var(--chip-accent-border)',
        'chip-green-bg': 'var(--chip-green-bg)',
        'chip-green-fg': 'var(--chip-green-fg)',
        'chip-green-border': 'var(--chip-green-border)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        'neo-sm': 'var(--shadow-sm)',
        'neo-md': 'var(--shadow-md)',
        'neo-lg': 'var(--shadow-lg)',
        'neo-xl': 'var(--shadow-xl)',
      },
      borderRadius: {
        panel: 'var(--radius-panel)',
        card: 'var(--radius-card)',
        control: 'var(--radius-control)',
        chip: 'var(--radius-chip)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
      },
    },
  },
  plugins: [],
}

export default config
