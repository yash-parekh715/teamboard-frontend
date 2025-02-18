/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pale: {
          50: "#EEEEEE",
        },
        purple: {
          600: "#8751ee",
        },
        pink: {
          500: "#8751ee",
        },
      },
    },
  },
  plugins: [],
};
