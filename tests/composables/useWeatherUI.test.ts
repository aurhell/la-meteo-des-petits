import { describe, expect, it } from "vitest"

import { useWeatherUI } from "@/composables/useWeatherUI"

// Weather code test constants
const WEATHER_CODE_SUN = 0
const WEATHER_CODE_PARTLY_CLOUDY = 1
const WEATHER_CODE_CLOUDY = 2
const WEATHER_CODE_PARTLY_CLOUDY_2 = 3
const WEATHER_CODE_FOG_1 = 45
const WEATHER_CODE_FOG_2 = 48
const WEATHER_CODE_RAIN_1 = 51
const WEATHER_CODE_RAIN_2 = 61
const WEATHER_CODE_RAIN_3 = 65
const WEATHER_CODE_SNOW_1 = 71
const WEATHER_CODE_SNOW_2 = 75
const WEATHER_CODE_STORM_1 = 95
const WEATHER_CODE_STORM_2 = 96
const WEATHER_CODE_UNKNOWN = 999

// Temperature test constants
const TEMP_VERY_COLD = -10
const TEMP_COLD = 5
const TEMP_COLD_NEGATIVE = -5
const TEMP_MILD = 15
const TEMP_WARM = 23
const TEMP_HOT = 30
const TEMP_HOT_2 = 28

describe("useWeatherUI", () => {
  it("should return weather emoji for sunny code", () => {
    const { weatherEmoji } = useWeatherUI()
    expect(weatherEmoji(WEATHER_CODE_SUN)).toBe("☀️")
  })

  it("should return cloud emoji for cloudy code", () => {
    const { weatherEmoji } = useWeatherUI()
    expect(weatherEmoji(WEATHER_CODE_CLOUDY)).toBe("⛅")
    expect(weatherEmoji(WEATHER_CODE_PARTLY_CLOUDY)).toBe("⛅")
    expect(weatherEmoji(WEATHER_CODE_PARTLY_CLOUDY_2)).toBe("⛅")
  })

  it("should return rain emoji for rainy code", () => {
    const { weatherEmoji } = useWeatherUI()
    expect(weatherEmoji(WEATHER_CODE_RAIN_1)).toBe("🌧️")
    expect(weatherEmoji(WEATHER_CODE_RAIN_2)).toBe("🌧️")
    expect(weatherEmoji(WEATHER_CODE_RAIN_3)).toBe("🌧️")
  })

  it("should return snow emoji for snowy code", () => {
    const { weatherEmoji } = useWeatherUI()
    expect(weatherEmoji(WEATHER_CODE_SNOW_1)).toBe("❄️")
    expect(weatherEmoji(WEATHER_CODE_SNOW_2)).toBe("❄️")
  })

  it("should return storm emoji for stormy code", () => {
    const { weatherEmoji } = useWeatherUI()
    expect(weatherEmoji(WEATHER_CODE_STORM_1)).toBe("⛈️")
    expect(weatherEmoji(WEATHER_CODE_STORM_2)).toBe("⛈️")
  })

  it("should return fog emoji for foggy code", () => {
    const { weatherEmoji } = useWeatherUI()
    expect(weatherEmoji(WEATHER_CODE_FOG_1)).toBe("🌫️")
    expect(weatherEmoji(WEATHER_CODE_FOG_2)).toBe("🌫️")
  })

  it("should return unknown emoji for unknown codes", () => {
    const { weatherEmoji } = useWeatherUI()
    expect(weatherEmoji(WEATHER_CODE_UNKNOWN)).toBe("❓")
  })

  it("should return empty text for undefined temperature", () => {
    const { playfulWeatherText } = useWeatherUI()
    expect(playfulWeatherText(undefined)).toBe("")
  })

  it("should return playful text for cold temperatures", () => {
    const { playfulWeatherText } = useWeatherUI()
    const veryCold = playfulWeatherText(TEMP_VERY_COLD)
    const cold = playfulWeatherText(TEMP_COLD)
    expect(veryCold).toContain("froid")
    expect(cold).toContain("froid")
    expect(veryCold).not.toBe(cold)
  })

  it("should return contextual text for cold temperatures with weather code", () => {
    const { playfulWeatherText } = useWeatherUI()
    const coldSunny = playfulWeatherText(TEMP_COLD, WEATHER_CODE_SUN) // Cold and sunny
    const coldRainy = playfulWeatherText(TEMP_COLD, WEATHER_CODE_RAIN_2) // Cold and rainy
    const coldSnowy = playfulWeatherText(TEMP_COLD_NEGATIVE, WEATHER_CODE_SNOW_1) // Cold and snowy
    expect(coldSunny).toContain("soleil")
    expect(coldRainy).toContain("mouillé")
    expect(coldSnowy).toContain("neige")
  })

  it("should return playful text for mild temperatures", () => {
    const { playfulWeatherText } = useWeatherUI()
    const text = playfulWeatherText(TEMP_MILD)
    expect(text).toContain("doux")
  })

  it("should return contextual text for mild temperatures with weather code", () => {
    const { playfulWeatherText } = useWeatherUI()
    const mildSunny = playfulWeatherText(TEMP_MILD, WEATHER_CODE_SUN) // Mild and sunny
    const mildRainy = playfulWeatherText(TEMP_MILD, WEATHER_CODE_RAIN_2) // Mild and rainy
    expect(mildSunny).toContain("soleil")
    expect(mildRainy).toContain("mouillé")
  })

  it("should return playful text for warm temperatures", () => {
    const { playfulWeatherText } = useWeatherUI()
    const warm = playfulWeatherText(TEMP_WARM)
    const hot = playfulWeatherText(TEMP_HOT)
    expect(warm).toBeTruthy()
    expect(hot).toBeTruthy()
  })

  it("should return contextual text for warm temperatures with weather code", () => {
    const { playfulWeatherText } = useWeatherUI()
    const warmSunny = playfulWeatherText(TEMP_WARM, WEATHER_CODE_SUN) // Warm and sunny
    const hotStorm = playfulWeatherText(TEMP_HOT_2, WEATHER_CODE_STORM_1) // Hot and stormy
    expect(warmSunny).toContain("beau")
    expect(hotStorm).toContain("orage")
  })

  it("should have characterAnimation function", () => {
    const { characterAnimation } = useWeatherUI()
    expect(typeof characterAnimation).toBe("function")
  })

  it("should return animation classes for different weather codes", () => {
    const { characterAnimation } = useWeatherUI()
    const sunny = characterAnimation(WEATHER_CODE_SUN)
    const rainy = characterAnimation(WEATHER_CODE_RAIN_1)
    const snowy = characterAnimation(WEATHER_CODE_SNOW_1)
    expect(typeof sunny).toBe("string")
    expect(typeof rainy).toBe("string")
    expect(typeof snowy).toBe("string")
  })

  it("should have weatherAnimationClass function", () => {
    const { weatherAnimationClass } = useWeatherUI()
    expect(typeof weatherAnimationClass).toBe("function")
  })

  it("should return animation classes for specific weather codes", () => {
    const { weatherAnimationClass } = useWeatherUI()
    expect(weatherAnimationClass(WEATHER_CODE_SUN)).toContain("animate-")
    expect(weatherAnimationClass(WEATHER_CODE_CLOUDY)).toContain("animate-")
  })
})

