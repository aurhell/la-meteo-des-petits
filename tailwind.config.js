/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          "0%": { transform: "translateY(0) rotate(0deg)" },
          "25%": { transform: "translateY(-10px) rotate(5deg)" },
          "50%": { transform: "translateY(-20px) rotate(-5deg)" },
          "75%": { transform: "translateY(-10px) rotate(5deg)" },
          "100%": { transform: "translateY(0) rotate(0deg)" },
        },
        "sway-bounce": {
          "0%": { transform: "translateY(0) rotate(-5deg)" },
          "25%": { transform: "translateY(-5px) rotate(5deg)" },
          "50%": { transform: "translateY(-10px) rotate(-2deg)" },
          "75%": { transform: "translateY(-5px) rotate(5deg)" },
          "100%": { transform: "translateY(0) rotate(-5deg)" },
        },
        "pulse-temp": {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
        },
        "rain-smooth": {
          "0%": {
            transform: "translateY(-20%) rotate(0deg)",
            opacity: "0",
          },
          "50%": { opacity: "1" },
          "100%": {
            transform: "translateY(110%) rotate(10deg)",
            opacity: "0",
          },
        },
        "snow-smooth": {
          "0%": { transform: "translateY(-10%) rotate(0deg)" },
          "100%": { transform: "translateY(110%) rotate(360deg)" },
        },
        "move-clouds": {
          "0%": { transform: "translateX(-20%)" },
          "100%": { transform: "translateX(120%)" },
        },
        thunder: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
        "shake-slow": {
          "0%,100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
        shiver: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "float": "float 3s infinite ease-in-out",
        "sway-bounce": "sway-bounce 2s infinite ease-in-out",
        "pulse-temp": "pulse-temp 1s infinite ease-in-out",
        "rain-smooth": "rain-smooth 3s linear infinite",
        "snow-smooth": "snow-smooth 4s linear infinite",
        "move-clouds": "move-clouds 8s linear infinite",
        "thunder": "thunder 0.5s infinite",
        "shake": "shake 0.3s infinite",
        "shake-slow": "shake-slow 0.6s infinite",
        "shiver": "shiver 0.3s infinite",
        "spin-slow": "spin-slow 6s linear infinite",
      },
    },
  },
  plugins: [],
}
