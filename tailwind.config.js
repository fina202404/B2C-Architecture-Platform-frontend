/** @type {import('tailwindcss').Config} */
module.exports = {
  // ✅ fixed Tailwind warning — darkMode should be 'media' or removed
  darkMode: 'media',

  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        // 🌑 Refined dark mode palette (aligned with Ant Design)
        bgPage: "#1b1b1b",           // smoother dark background
        bgSectionDark: "#1e1e1e",    // slightly lighter for contrast
        surface: "#252525",          // unified with Card + Container

        // ✨ Text
        textPrimary: "#FFFFFF",
        textSecondary: "#C0C0C0",    // brighter readability

        // 💛 Accent
        accentGold: "#C6A664",
        borderSoft: "#3a3a3a",       // consistent visible gray border

        // 🖤 White & black tokens
        white: "#FFFFFF",
        black: "#000000",
      },

      // 🌫 Shadows
      boxShadow: {
        card: "0 4px 20px rgba(0, 0, 0, 0.25)",
        header: "0 2px 12px rgba(0, 0, 0, 0.4)",
      },

      // 🧱 Rounded corners
      borderRadius: {
        xl2: "1rem",
      },

      // ✍️ Typography scale
      fontSize: {
        display: [
          "2.5rem",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.03em",
            fontWeight: "600",
          },
        ],
        headline: [
          "1.125rem",
          {
            lineHeight: "1.4",
            fontWeight: "600",
          },
        ],
      },
    },
  },
  plugins: [],
};
