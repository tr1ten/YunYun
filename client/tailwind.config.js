module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "Cultured": "#f8f9fa",
        "Cultured 2": "#e9ecef",
        "Gainsboro": "#dee2e6",
        "Light Gray": "#ced4da",
        "Cadet Blue Crayola": "#adb5bd",
        "Slate Gray": "#6c757d",
        "Davys Grey": "#495057",
        "Gunmetal": "#343a40",
        "Charleston Green": "#212529"
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
