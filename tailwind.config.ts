import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta propia: base carbón profundo + acento "sakura-ember",
        // ni pastel infantil ni neón genérico de streaming.
        ink: {
          950: "#0b0d10",
          900: "#12151a",
          800: "#1a1f26",
          700: "#242a33",
        },
        ember: {
          400: "#ff8f6b",
          500: "#ff6a45",
          600: "#e2532f",
        },
        mist: {
          100: "#e9edf1",
          300: "#aab3bd",
          500: "#6c7684",
        },
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      fontFamily: {
        display: ["'Sora'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
