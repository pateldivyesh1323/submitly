/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#121212", // Deep black
        secondary: "#1F2933", // Charcoal Black
        tertiary: "#3E4C59", // Slate gray
        accent: "#55E6A5", // Mint Green
        textPrimary: "#E5E7EB", // Light Gray for main text
        textSecondary: "#A0AEC0", // Cool Gray for secondary text
        error: "#F56565", // Coral Red for error
        success: "#48BB78", // Emerald Green for success
        info: "#4299E1",
      },
    },
  },
  plugins: [],
};
