import type { Config } from "tailwindcss";

// Allergoscreen brand palette:
//   - brand cyan #30C6E0 (existing; trust, medical clarity)
//   - gold #FFCD4B (existing accent; warmth, action)
//   - ink #0A1929 (deep navy text; not pure black — softer on screen)
//   - mist #F4FAFB (very light blue-grey backgrounds)

export default {
  content: ["./src/**/*.{astro,html,ts,tsx,js,jsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        mist: "#F4FAFB",
        ink: {
          DEFAULT: "#0A1929",
          50: "#F1F4F7",
          200: "#C8D2DC",
          400: "#5C7287",
          600: "#2C3E55",
          900: "#070E18",
        },
        brand: {
          DEFAULT: "#30C6E0",
          50: "#EBFAFC",
          100: "#D6F5F9",
          200: "#A6E9F2",
          300: "#76DCE9",
          400: "#48CFE0",
          500: "#30C6E0",
          600: "#1AA8C4",
          700: "#0E8AA3",
          800: "#066880",
          900: "#054D5C",
        },
        gold: {
          DEFAULT: "#FFCD4B",
          50: "#FFF8E5",
          100: "#FFEFC2",
          200: "#FFE08A",
          400: "#FFD061",
          500: "#FFCD4B",
          600: "#E5A623",
          700: "#B8821A",
        },
        // Logo red — used sparingly for brand accents (logo, "+" badge,
        // rare emphasis). NOT used for warning/error UI.
        crimson: {
          DEFAULT: "#E11D26",
          50: "#FEECEC",
          100: "#FBD1D3",
          400: "#EC4047",
          500: "#E11D26",
          600: "#B81620",
          700: "#8C111A",
        },
        rule: "#E2E8EC",
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
        display: ['"Manrope"', "Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
        container: "1200px",
        narrow: "880px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(10, 25, 41, 0.04), 0 4px 14px rgba(10, 25, 41, 0.06)",
        "card-hover": "0 4px 8px rgba(10, 25, 41, 0.08), 0 12px 28px rgba(10, 25, 41, 0.10)",
        cta: "0 2px 8px rgba(48, 198, 224, 0.25), 0 8px 24px rgba(48, 198, 224, 0.18)",
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
} satisfies Config;
