/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      height: {
        fullScreen: "calc(100vh - 48px)",
      },
    },
  },
  plugins: [],
};

