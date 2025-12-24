/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#05090f",
        base: {
          0: "#05090f",
          50: "#0b1420",
          100: "#0f1c2b",
          200: "#16273c",
          600: "#9eb0c7",
        },
        surface: {
          900: "#08101b",
          800: "#0d1624",
          700: "#101c2d",
        },
        brand: {
          300: "#d7ff7a",
          400: "#b4ff4a",
          500: "#8de84a",
          600: "#65d637",
          amber: "#f3c969",
        },
        accent: {
          teal: "#5ad2b4",
          blue: "#6dd3ff",
        },
        neutral: {
          200: "#d7e2f1",
          300: "#c1cdde",
          400: "#9db0c9",
          500: "#7f93b0",
        },
        border: {
          DEFAULT: "#16263a",
          soft: "#1f3148",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 20px 80px rgba(180,255,74,0.15)",
        overlay: "0 30px 80px rgba(0,0,0,0.35)",
        soft: "0 15px 45px rgba(0, 0, 0, 0.28)",
      },
      backgroundImage: {
        "noise-surface":
          "radial-gradient(circle at 10% 20%, rgba(255,255,255,0.06), transparent 20%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.08), transparent 25%), radial-gradient(circle at 50% 100%, rgba(255,255,255,0.04), transparent 18%)",
      },
    },
  },
  plugins: [],
};
