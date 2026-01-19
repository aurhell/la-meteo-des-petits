/** @type {import('tailwindcss').Config} */

// Animation duration constants
const ANIMATION_DURATIONS = {
  FLOAT: "3s",
  SWAY_BOUNCE: "2s",
  PULSE_TEMP: "1s",
  RAIN_SMOOTH: "3s",
  SNOW_SMOOTH: "4s",
  MOVE_CLOUDS: "8s",
  THUNDER: "0.5s",
  SHAKE: "0.6s",
  SHAKE_SLOW: "1s",
  SHIVER: "0.6s",
  SPIN_SLOW: "6s",
  PULSE_GENTLE: "2s",
}

// Transform and animation offset constants
const ANIMATION_OFFSETS = {
  FLOAT_Y_SMALL: "-10px",
  FLOAT_Y_LARGE: "-20px",
  FLOAT_ROTATION_SMALL: "5deg",
  FLOAT_ROTATION_MEDIUM: "-5deg",
  FLOAT_ROTATION_SMALL_NEG: "-2deg",
  SWAY_Y_SMALL: "-5px",
  SWAY_Y_MEDIUM: "-10px",
  SHAKE_X: "2px",
  RAIN_Y_START: "-20%",
  RAIN_Y_END: "110%",
  RAIN_ROTATION: "10deg",
  SNOW_Y_START: "-10%",
  SNOW_Y_END: "110%",
  SNOW_ROTATION: "360deg",
  CLOUDS_X_START: "-20%",
  CLOUDS_X_END: "120%",
  THUNDER_OPACITY_MIN: "0.3",
}

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
          "25%": { transform: `translateY(${ANIMATION_OFFSETS.FLOAT_Y_SMALL}) rotate(${ANIMATION_OFFSETS.FLOAT_ROTATION_SMALL})` },
          "50%": { transform: `translateY(${ANIMATION_OFFSETS.FLOAT_Y_LARGE}) rotate(${ANIMATION_OFFSETS.FLOAT_ROTATION_MEDIUM})` },
          "75%": { transform: `translateY(${ANIMATION_OFFSETS.FLOAT_Y_SMALL}) rotate(${ANIMATION_OFFSETS.FLOAT_ROTATION_SMALL})` },
          "100%": { transform: "translateY(0) rotate(0deg)" },
        },
        "sway-bounce": {
          "0%": { transform: "translateY(0) rotate(-5deg)" },
          "25%": { transform: `translateY(${ANIMATION_OFFSETS.SWAY_Y_SMALL}) rotate(${ANIMATION_OFFSETS.FLOAT_ROTATION_SMALL})` },
          "50%": { transform: `translateY(${ANIMATION_OFFSETS.SWAY_Y_MEDIUM}) rotate(${ANIMATION_OFFSETS.FLOAT_ROTATION_SMALL_NEG})` },
          "75%": { transform: `translateY(${ANIMATION_OFFSETS.SWAY_Y_SMALL}) rotate(${ANIMATION_OFFSETS.FLOAT_ROTATION_SMALL})` },
          "100%": { transform: "translateY(0) rotate(-5deg)" },
        },
        "pulse-temp": {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
        },
        "rain-smooth": {
          "0%": {
            transform: `translateY(${ANIMATION_OFFSETS.RAIN_Y_START}) rotate(0deg)`,
            opacity: "0",
          },
          "50%": { opacity: "1" },
          "100%": {
            transform: `translateY(${ANIMATION_OFFSETS.RAIN_Y_END}) rotate(${ANIMATION_OFFSETS.RAIN_ROTATION})`,
            opacity: "0",
          },
        },
        "snow-smooth": {
          "0%": { transform: `translateY(${ANIMATION_OFFSETS.SNOW_Y_START}) rotate(0deg)` },
          "100%": { transform: `translateY(${ANIMATION_OFFSETS.SNOW_Y_END}) rotate(${ANIMATION_OFFSETS.SNOW_ROTATION})` },
        },
        "move-clouds": {
          "0%": { transform: `translateX(${ANIMATION_OFFSETS.CLOUDS_X_START})` },
          "100%": { transform: `translateX(${ANIMATION_OFFSETS.CLOUDS_X_END})` },
        },
        thunder: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: ANIMATION_OFFSETS.THUNDER_OPACITY_MIN },
        },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "25%": { transform: `translateX(${ANIMATION_OFFSETS.SHAKE_X})` },
          "75%": { transform: `translateX(${ANIMATION_OFFSETS.SHAKE_X})` },
        },
        "shake-slow": {
          "0%,100%": { transform: "translateX(0)" },
          "25%": { transform: `translateX(${ANIMATION_OFFSETS.SHAKE_X})` },
          "75%": { transform: `translateX(${ANIMATION_OFFSETS.SHAKE_X})` },
        },
        shiver: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: `translateY(${ANIMATION_OFFSETS.SWAY_Y_SMALL})` },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: `rotate(${ANIMATION_OFFSETS.SNOW_ROTATION})` },
        },
        "gentle-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "float": `float ${ANIMATION_DURATIONS.FLOAT} infinite ease-in-out`,
        "sway-bounce": `sway-bounce ${ANIMATION_DURATIONS.SWAY_BOUNCE} infinite ease-in-out`,
        "pulse-temp": `pulse-temp ${ANIMATION_DURATIONS.PULSE_TEMP} infinite ease-in-out`,
        "rain-smooth": `rain-smooth ${ANIMATION_DURATIONS.RAIN_SMOOTH} linear infinite`,
        "snow-smooth": `snow-smooth ${ANIMATION_DURATIONS.SNOW_SMOOTH} linear infinite`,
        "move-clouds": `move-clouds ${ANIMATION_DURATIONS.MOVE_CLOUDS} linear infinite`,
        "thunder": `thunder ${ANIMATION_DURATIONS.THUNDER} infinite`,
        "shake": `shake ${ANIMATION_DURATIONS.SHAKE} infinite`,
        "shake-slow": `shake-slow ${ANIMATION_DURATIONS.SHAKE_SLOW} infinite`,
        "shiver": `shiver ${ANIMATION_DURATIONS.SHIVER} infinite`,
        "spin-slow": `spin-slow ${ANIMATION_DURATIONS.SPIN_SLOW} linear infinite`,
        "gentle-bounce": `gentle-bounce ${ANIMATION_DURATIONS.SWAY_BOUNCE} infinite ease-in-out`,
      },
    },
  },
  plugins: [],
}
