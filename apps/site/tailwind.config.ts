import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontVariationSettings: {
        normal: "'wght' 400",
        medium: "'wght' 500",
        semibold: "'wght' 600",
        bold: "'wght' 700",
        extrabold: "'wght' 800",
        black: "'wght' 900",
        wide: "'wdth' 125",
        narrow: "'wdth' 75",
        "bold-wide": "'wght' 700, 'wdth' 125",
        "black-wide": "'wght' 900, 'wdth' 125",
      },
      keyframes: {
        slideDown: {
          from: { transform: "translateY(0%)" },
          to: { transform: "translateY(100%)" },
        },
        slideDown2: {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0%)" },
        },
        slideUp: {
          from: { transform: "translateY(0%)" },
          to: { transform: "translateY(-100%)" },
        },
        slideUp2: {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0%)" },
        },
        fadein: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "slide-down": "slideDown 130s linear infinite",
        "slide-down-2": "slideDown2 130s linear infinite",
        "slide-up": "slideUp 100s linear infinite",
        "slide-up-2": "slideUp2 100s linear infinite",
        "fade-in":
          "fadein 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) forwards",
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }: any) {
      const fontVariationSettings = theme("fontVariationSettings");
      const utilities = Object.entries(fontVariationSettings).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [`.font-variation-${key}`]: {
            "font-variation-settings": value,
          },
        }),
        {},
      );
      addUtilities(utilities);

      // Add animation-play-state utilities
      addUtilities({
        ".paused": {
          "animation-play-state": "paused",
        },
        ".running": {
          "animation-play-state": "running",
        },
      });
    },
  ],
};

export default config;
