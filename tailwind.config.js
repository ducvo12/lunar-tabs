/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface1: "var(--surface1)",
        surface2: "var(--surface2)",
        text: "var(--text)"
      },
      width: {
        searchBar: "700px"
      },
      fontFamily: {
        quicksand: ["Quicksand", "sans-serif"]
      }
    }
  },
  plugins: []
};
