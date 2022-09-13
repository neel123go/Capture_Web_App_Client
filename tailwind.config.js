/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#11100E",
          "secondary": "#ED163A",
          "base-100": "#e7e5e4",
          "success": "#22c55e",
          "error": "#dc2626",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}