/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#1e6633",
          600: "#145026",
          700: "#0d3a1b",
        },
      },
    },
  },
  plugins: [],
};
