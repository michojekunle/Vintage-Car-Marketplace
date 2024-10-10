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
        primary: "#1c2657",
        secondary: "#8598f7",
        "primary-80%": "#2b3fa1",
        "text-body": "#525252",
        "text-body-50%": "#a3a3a3",
        "text-header": "#404040",
        "card-bg": "#e5e7eb",
        border: "#e5e5e5",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
