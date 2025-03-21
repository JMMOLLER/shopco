import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  safelist: [
    {
      pattern: /rating-star-\[.*\]/, // Conserva las clases coincidentes como rating-star-[1.0]
      variants: ['responsive'], // Asegura que las variantes se incluyan también
    },
  ],
	theme: {
		extend: {
      screens: {
        'nav': '905px',
        'min': '537px',
        'main':  '1350px',
        'lg': '1024px',
        '2lg': '1281px',
        '8xl': '1770px',
      },
      backgroundImage: {
        'mobile-nav-gradient': 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,1) 15%)'
      },
      borderColor: {
        'primary': '#00000010'
      },
      fontSize: {
        clamp: "clamp(1rem, 5vw, 3rem)",
      },
      lineHeight: {
        clamp: "clamp(1.5rem, 5vw, 3rem)",
      },
      fontFamily: {
        sans: ['Satoshi', 'sans-serif'],
        integral: ['IntegralCF', 'sans-serif'],
      },
      colors: {
        primary: "#00000060",
        accent: "#",
      },
      backgroundColor: {
        primary: "#F0F0F0"
      },
      keyframes: {
        shine: {
          to: {
            'background-position-x': '200%',
          }
        },
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
        'shine': 'shine 1.5s linear infinite'
      },
    },
	},
	plugins: [
    require('daisyui'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.animate-shine': {
          background: 'linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%)',
          animation: 'shine 1.5s linear infinite',
          'background-size': '200% 100%',
        },
      })
    }),
    plugin(function ({ addComponents, addUtilities }) {
      // Estilos base para las estrellas
      addComponents({
        '.rating-star': {
          fontStyle: 'normal',
          display: 'inline-block',
          position: 'relative',
          unicodeBidi: 'bidi-override',
          width: 'fit-content',
          lineHeight: '1rem',
          '--tw-color': '#FFC633'
        },
        '.rating-star::before': {
          display: 'block',
          content: '"★★★★★"',
          color: '#dddddd6e',
        },
        '.rating-star::after': {
          position: 'absolute',
          top: '0',
          content: '"★★★★★"',
          width: '0', // Ancho inicial
          color: 'var(--tw-color)',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
        },
      });

      // Generar utilidades para los valores de rating
      const starWidths = {};
      for (let i = 0; i <= 5; i += 0.1) {
        const value = i.toFixed(1).replace('.', '\\.'); // Escapar el punto
        starWidths[`.rating-star-\\[${value}\\]::after`] = {
          width: `${i * 20}%`,
        };
      }

      addUtilities(starWidths, ['responsive']);
    })
  ],
}
