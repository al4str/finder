module.exports = {
  darkMode: "class",
  experimental: {
    optimizeUniversalDefaults: false,
  },
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    screens: {
      xs: "480px",
      sm: "576px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {},
  },
  plugins: [],
};
