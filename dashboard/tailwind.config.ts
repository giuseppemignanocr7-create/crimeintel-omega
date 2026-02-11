import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ci-bg': '#0a0e1a',
        'ci-card': '#111827',
        'ci-border': '#1f2937',
        'ci-accent': '#3b82f6',
        'ci-accent-hover': '#2563eb',
        'ci-danger': '#ef4444',
        'ci-success': '#22c55e',
        'ci-warning': '#f59e0b',
        'ci-text': '#e5e7eb',
        'ci-muted': '#9ca3af',
      },
    },
  },
  plugins: [],
};

export default config;
