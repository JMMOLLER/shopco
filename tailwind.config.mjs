/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
      fontFamily: {
        sans: ['Satoshi-Regular', 'sans-serif'],
        integral: ['IntegralCF-Regular', 'sans-serif'],
      },
      colors: {
        primary: "#00000060",
        accent: "#",
      },
      backgroundColor: {
        primary: "#F0F0F0"
      },
      keyframes: {
        'fade-out-down': {
          '0%': {
            opacity: '1',
            transform: 'translateY(1.5rem)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-2rem)',
          },
        },
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-2rem)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'fade-out-down': 'fade-out-down 0.3s ease',
        'fade-in-down': 'fade-in-down 0.3s ease',
      },
    },
	},
	plugins: [require('daisyui')],
}
