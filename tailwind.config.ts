import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#f5f1e8",
        sand: "#e8dcc8",
        accent: "#c96d42",
        steel: "#506173",
        success: "#14532d",
        border: "rgba(15, 23, 42, 0.08)"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)"
      },
      maxWidth: {
        editorial: "84rem",
        prose: "46rem"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
