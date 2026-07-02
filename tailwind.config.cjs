/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#008C6A",
        accent: "#FFC512",
        darkBg: "#071A16",
        cardBg: "#102B25",
        sectionBg: "#0C201B",
        secondaryText: "#C6D1CD",
        border: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        heading: ["'Playfair Display'", "serif"],
        body: ["'Poppins'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
