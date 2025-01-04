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
      }
    },
	},
	plugins: [require('daisyui')],
}
