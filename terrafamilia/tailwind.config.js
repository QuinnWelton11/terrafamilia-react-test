/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Georama", "system-ui", "sans-serif"],
        body: ["Istok Web", "system-ui", "sans-serif"],
        sans: ["Istok Web", "system-ui", "sans-serif"], // Override default sans
      },
    },
  },
  plugins: [],
};
