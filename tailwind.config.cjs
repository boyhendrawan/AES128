/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      transitionProperty: {
        multiple: "width , height , backgroundColor , border-radius",
      },
      colors: {
        bacot: "#242421",
      },
    },
  },
  plugins: [],
};
