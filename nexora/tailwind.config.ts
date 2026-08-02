import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nexora light-mode palette — soft blue, confident, calm
        canvas: "#F7F9FC",       // page background
        surface: "#FFFFFF",      // card background
        ink: "#0B1B33",          // primary text (deep navy, not pure black)
        muted: "#5B6B85",        // secondary text
        border: "#E4E9F2",
        brand: {
          50: "#EEF3FF",
          100: "#DCE6FF",
          300: "#9EB8FF",
          500: "#3B6EF6",        // primary blue
          600: "#2C57D6",
          700: "#1F3FA6",
        },
        accent: {
          teal: "#17C3B2",       // secondary accent — automation/energy
          amber: "#F5A623",      // sparing use — highlights only
          gold: "#C9A24B",       // premium accent — dividers, eyebrows only, never large fills
        },
      },
      fontFamily: {
        display: ["var(--font-sora)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        wideish: "0.08em",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(16, 24, 40, 0.06)",
        card: "0 8px 24px rgba(16, 24, 40, 0.08)",
        lift: "0 16px 40px rgba(59, 110, 246, 0.16)",
        premium: "0 1px 2px rgba(16,24,40,0.04), 0 24px 48px -12px rgba(16,24,40,0.14)",
        "premium-hover": "0 1px 2px rgba(16,24,40,0.04), 0 32px 64px -12px rgba(59,110,246,0.22)",
        glow: "0 0 0 1px rgba(59,110,246,0.08), 0 8px 32px rgba(59,110,246,0.14)",
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
        xl4: "2.25rem",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #3B6EF6 0%, #17C3B2 100%)",
        "brand-radial": "radial-gradient(60% 60% at 50% 0%, #EEF3FF 0%, #F7F9FC 100%)",
        "brand-mesh":
          "radial-gradient(50% 60% at 15% 0%, #EEF3FF 0%, rgba(238,243,255,0) 100%), radial-gradient(40% 50% at 100% 10%, rgba(23,195,178,0.12) 0%, rgba(23,195,178,0) 100%), linear-gradient(180deg, #FFFFFF 0%, #F7F9FC 100%)",
        "footer-gradient": "linear-gradient(180deg, #0B1B33 0%, #0E2142 100%)",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        "400": "400ms",
      },
      keyframes: {
        flowdot: {
          "0%": { offsetDistance: "0%" },
          "100%": { offsetDistance: "100%" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        floaty: "floaty 4s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
