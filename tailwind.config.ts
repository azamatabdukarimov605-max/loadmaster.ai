import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          DEFAULT: "#00D4FF",
          soft: "#5EEBFF",
          dim: "#0B8FB3",
        },
        ink: {
          950: "#04070D",
          900: "#070B14",
          800: "#0C121E",
          700: "#121A2B",
          600: "#1B2740",
          500: "#4B5A75",
          400: "#7A889E",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% -10%, rgba(0,212,255,0.20), transparent 40%), radial-gradient(circle at 90% 10%, rgba(0,212,255,0.12), transparent 35%)",
        "hero-gradient":
          "linear-gradient(180deg, #04070D 0%, #070B14 45%, #0C121E 100%)",
      },
      boxShadow: {
        neon: "0 0 20px rgba(0,212,255,0.35), 0 0 60px rgba(0,212,255,0.12)",
        card: "0 8px 30px rgba(0,0,0,0.25)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        dash: {
          to: { strokeDashoffset: "0" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite",
        dash: "dash 2s linear forwards",
        fadeUp: "fadeUp 0.6s ease-out both",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
