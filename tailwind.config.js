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
          "secondary": "#FF4F5A",
          "base-100": "#e7e5e4",
          "neutral": "#44403c",
          "success": "#22c55e",
          "error": "#dc2626",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}