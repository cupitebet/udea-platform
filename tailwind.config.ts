import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F5FF7',
        secondary: '#00B4D8',
        accent: '#FFB703',
        dark: '#051D3B',
      },
    },
  },
  plugins: [],
}
export default config
