/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		colors: {
  			limeCust: '#B2FF45',
  			darkPrimaryCust: '#111111',
  			darkSecondaryCust: '#141414'
  		},
  		fontFamily: {
  			guerrilla: [
  				'Protest Guerrilla',
  				'sans-serif'
  			],
  			doto: [
  				'Doto',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
