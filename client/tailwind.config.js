/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "contrail-one": ['"Contrail One"', "sans-serif"],
        // neonderthaw: ['"Neonderthaw"', "cursive"],
      },
    },
  },
  plugins: [],
};
