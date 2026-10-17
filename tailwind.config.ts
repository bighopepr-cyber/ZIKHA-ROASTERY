import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'dark-brown': '#3E2F25',
        beige: '#D9C9B2',
        'coffee-green': '#4B5E3F',
        charcoal: '#2B2B2B',
      },
    },
  },
  plugins: [],
};

export default config;