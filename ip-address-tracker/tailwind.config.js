/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    backgroundImage: {
      "map-mobile": "url('/pattern-bg-mobile.png')",
      "map-desktop": "url('/pattern-bg-desktop.png')",
    },
    colors: {
      darkGray: "hsl(0, 0%, 17%)",
      veryDarkGray: "hsl(0, 0%, 59%)",
      white: "hsl(0, 0%, 100%)",
      black: "hsl(0, 0%, 0%)",
    },

    extend: {
      fontFamily: {
        rubik: ["Rubik", "sans-serif"],
      },
      fontSize: {
        body: "18px",
      },
    },
  },
  plugins: [],
};
