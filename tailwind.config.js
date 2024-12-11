/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@spartan-ng/ui-core/hlm-tailwind-preset')],
  content: [
    "./libs/**/*.{html,ts}",
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', "sans-serif"],
      },
      colors: {
        primary: {
          100: "#f9f7f3",
          200: "#FFDEA8",
          300: "#FFC570",
          400: "#FFA037",
        }
      }
    },
  },
  plugins: [],
}

