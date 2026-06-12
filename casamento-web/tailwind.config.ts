import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Puxam das CSS variables (canais RGB) definidas via config/wedding.ts no layout.
        // O formato rgb(var / <alpha-value>) permite usar opacidade: bg-primary/20 etc.
        primary: "rgb(var(--color-primary-rgb) / <alpha-value>)",
        "primary-dark": "rgb(var(--color-primary-dark-rgb) / <alpha-value>)",
        accent: "rgb(var(--color-accent-rgb) / <alpha-value>)",
        // Paleta de luxo (fixa)
        ink: "#2b2620",        // texto principal, quase preto quente
        "ink-soft": "#7a7065",  // texto secundário
        champagne: "#d9c4a0",   // dourado claro p/ bordas/divisores
        ivory: "#fbf8f2",       // fundo creme
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.25em",
      },
      boxShadow: {
        luxe: "0 10px 40px -12px rgba(80, 60, 30, 0.18)",
        "luxe-sm": "0 4px 20px -8px rgba(80, 60, 30, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
