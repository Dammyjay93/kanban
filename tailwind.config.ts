import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        // Surfaces
        surface: {
          primary: "var(--surface-primary)",
          secondary: "var(--surface-secondary)",
          overlay: "var(--surface-overlay)",
        },
        
        // Text
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        
        // Borders
        border: {
          light: "var(--border-light)",
          subtle: "var(--border-subtle)",
        },
        
        // Interactive
        hover: {
          light: "var(--hover-light)",
          subtle: "var(--hover-subtle)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
