import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
            sans: ["Bricolage Grotesque Variable", "system-ui", "sans-serif"],
    mono: ["Martian Mono Variable", "ui-monospace", "monospace"],

      },
    },
  },
  plugins: [],
};

export default config;