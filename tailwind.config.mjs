/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        burgundy: { DEFAULT: '#6B2E2A', light: '#8A3D38' },
        cream: '#F5F1EA',
        'off-white': '#FAF8F4',
        carbon: '#1A1A1A',
        'warm-gray': '#9E9188',
        'dark-bg': '#141410',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        'serif-zh': ['Noto Serif SC', 'Cormorant Garamond', 'serif'],
        'sans-zh': ['Noto Sans SC', 'Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem', '22': '5.5rem', '26': '6.5rem',
        '30': '7.5rem', '34': '8.5rem',
      },
      transitionTimingFunction: { 'out-smooth': 'cubic-bezier(0.0, 0.0, 0.2, 1)' },
    },
  },
  plugins: [],
};
