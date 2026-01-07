import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#FDBA74",   // amber-300
          DEFAULT: "#F59E0B", // amber-500
          dark: "#B45309"     // amber-700
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
