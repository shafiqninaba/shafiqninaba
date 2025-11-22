import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "[data-theme='dark']"],
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--brand-solid-strong)",
          strong: "var(--brand-solid-strong)",
          medium: "var(--brand-solid-medium)",
          weak: "var(--brand-solid-weak)",
        },
        accent: {
          DEFAULT: "var(--accent-solid-strong)",
          strong: "var(--accent-solid-strong)",
          medium: "var(--accent-solid-medium)",
          weak: "var(--accent-solid-weak)",
        },
        neutral: {
          DEFAULT: "var(--neutral-solid-strong)",
          strong: "var(--neutral-solid-strong)",
          medium: "var(--neutral-solid-medium)",
          weak: "var(--neutral-solid-weak)",
        },
        surface: {
          page: "var(--page-background)",
          background: "var(--surface-background)",
        },
      },
      borderRadius: {
        DEFAULT: "var(--radius-m)",
        sm: "var(--radius-s)",
        md: "var(--radius-m)",
        lg: "var(--radius-l)",
        xl: "var(--radius-xl)",
      },
      fontFamily: {
        primary: "var(--font-family-primary)",
        secondary: "var(--font-family-secondary)",
        code: "var(--font-family-code)",
      },
      boxShadow: {
        sm: "var(--shadow-s)",
        md: "var(--shadow-m)",
        lg: "var(--shadow-l)",
        xl: "var(--shadow-xl)",
      },
    },
  },
  plugins: [],
};

export default config;
