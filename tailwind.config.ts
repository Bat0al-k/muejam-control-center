import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // ── Brand Colors ──────────────────────────────────────────────────────
      colors: {
        brand: {
          50:  "#f0f4ff",
          100: "#dce6fe",
          200: "#baccfd",
          300: "#90aafc",
          400: "#6383f9",
          500: "#4361f4",   // primary
          600: "#2f44e8",
          700: "#2433ce",
          800: "#2130a7",
          900: "#202e84",
          950: "#171d52",
        },
        library: {
          DEFAULT: "#4361f4",
          dark:    "#2f44e8",
        },
        studio: {
          DEFAULT: "#7c3aed",
          dark:    "#6d28d9",
        },
      },

      // ── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },

      // ── Animations ────────────────────────────────────────────────────────
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%":   { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in":  "fade-in 0.2s ease-out",
        "slide-in": "slide-in 0.25s ease-out",
      },

      // ── Border Radius ─────────────────────────────────────────────────────
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
