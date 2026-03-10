import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        sand: '#f0f5fb',
        sand2: '#e4edf7',
        sand3: '#d0dff0',
        brand: '#2563eb',
        brandDark: '#1a4ec4',
        forest: '#0f2a52',
        ink: '#0d1b2e',
        inkSoft: '#2e4a6a',
        muted: '#7a93b0',
        whiteSoft: '#f8fbff'
      },
      fontFamily: {
        display: ['var(--font-fraunces)'],
        sans: ['var(--font-jakarta)']
      },
      boxShadow: {
        glow: '0 20px 70px rgba(37, 99, 235, 0.16)',
        float: '0 16px 48px rgba(13, 27, 46, 0.12)'
      },
      keyframes: {
        ticker: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.3)' }
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        },
        bop: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-4px)' }
        },
        fadeInSoft: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        fadeInUpSoft: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        ticker: 'ticker 32s linear infinite',
        pulseSoft: 'pulseSoft 2s ease-in-out infinite',
        blink: 'blink 1s step-end infinite',
        bop: 'bop 1.2s ease-in-out infinite',
        fadeInSoft: 'fadeInSoft 650ms ease-out both',
        fadeInUpSoft: 'fadeInUpSoft 750ms cubic-bezier(0.16, 1, 0.3, 1) both'
      }
    }
  },
  plugins: []
};

export default config;
