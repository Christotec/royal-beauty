import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Royal Beauty brand palette
        burgundy: {
          DEFAULT: "#5C1A2E",
          dark: "#3D0F1D",
          light: "#7A2740",
        },
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E3C77D",
          dark: "#A4802F",
        },
        cream: "#FBF6F0",
        blush: "#F3D9DF",
        charcoal: "#1F1417",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
