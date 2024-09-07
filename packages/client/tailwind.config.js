/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        limeCust: "#B2FF45",
        darkPrimaryCust: "#111111",
        darkSecondaryCust: "#141414",
      },
      fontFamily: {
        guerrilla: ["Protest Guerrilla", "sans-serif"],
      },
    },
  },
  plugins: [],
};
