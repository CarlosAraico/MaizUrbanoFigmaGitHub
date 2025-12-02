/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          0: "#0d1421",
          50: "#101827",
          100: "#162032",
          200: "#1f2c44",
          300: "#2a3b58",
          600: "#cdd7e5",
        },
        brand: {
          500: "#1e6633",
          600: "#145026",
          700: "#0d3a1b",
        },
      },
      boxShadow: {
        soft: "0 20px 60px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
