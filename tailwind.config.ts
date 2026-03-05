import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          bg: '#050505',
          panel: '#0b0b0b',
          card: '#0f0f0f',
          border: 'rgba(255,255,255,0.02)',
          text: 'rgba(255,255,255,0.95)',
          muted: 'rgba(255,255,255,0.6)',
        },
        accent: {
          orange: '#FF5A2A',
          'orange-dim': 'rgba(255,90,42,0.4)',
        },
      },
      fontFamily: {
        heading: ['var(--font-poppins)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        hero: 'clamp(48px, 9vw, 160px)',
        'hero-sub': 'clamp(32px, 5vw, 80px)',
      },
      letterSpacing: {
        tighter: '-0.02em',
      },
      backgroundImage: {
        'gradient-panel': 'linear-gradient(to bottom, #0b0b0b, #0e0e0e, #0a0a0a)',
        'gradient-overlay': 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.2))',
      },
      boxShadow: {
        'glow-orange': '0 0 20px rgba(255,90,42,0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
