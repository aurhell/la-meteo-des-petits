import { describe, expect, it } from "vitest"

import { useTemperature } from "@/composables/useTemperature"

const TEMPERATURE_SCALE_LENGTH = 5

describe("useTemperature", () => {
  it("should have temperature limit constants", () => {
    const {
      TEMPERATURE_LIMIT_VERY_COLD,
      TEMPERATURE_LIMIT_COLD,
      TEMPERATURE_LIMIT_MILD,
      TEMPERATURE_LIMIT_WARM,
    } = useTemperature()

    expect(TEMPERATURE_LIMIT_VERY_COLD).toBeLessThan(TEMPERATURE_LIMIT_COLD)
    expect(TEMPERATURE_LIMIT_COLD).toBeLessThan(TEMPERATURE_LIMIT_MILD)
    expect(TEMPERATURE_LIMIT_MILD).toBeLessThan(TEMPERATURE_LIMIT_WARM)
  })

  it("should return temperature scale emojis", () => {
    const { temperatureScale } = useTemperature()
    expect(Array.isArray(temperatureScale)).toBe(true)
    expect(temperatureScale.length).toBe(TEMPERATURE_SCALE_LENGTH)
    expect(temperatureScale[0]).toBe("🥶") // very cold
  })
})
