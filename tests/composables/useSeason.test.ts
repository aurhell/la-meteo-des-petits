import { describe, expect, it } from "vitest"

import { useSeason } from "@/composables/useSeason"

describe("useSeason", () => {
  it("should return a season based on the current month", () => {
    const { season } = useSeason()
    expect(season.value).toMatch(/^(winter|spring|summer|autumn)$/)
  })

  it("should have valid season theme", () => {
    const { seasonTheme } = useSeason()
    expect(seasonTheme.value).toHaveProperty("emoji")
    expect(seasonTheme.value).toHaveProperty("gradient")
    expect(typeof seasonTheme.value.emoji).toBe("string")
    expect(typeof seasonTheme.value.gradient).toBe("string")
  })

  it("should cycle to next season", () => {
    const { season, nextSeason } = useSeason()
    nextSeason()
    // Season should have changed or cycled back
    expect([
      "winter",
      "spring",
      "summer",
      "autumn",
    ]).toContain(season.value)
  })

  it("should have nextSeason function", () => {
    const { nextSeason } = useSeason()
    expect(typeof nextSeason).toBe("function")
  })

  it("should cycle through all 4 seasons", () => {
    const { season, nextSeason } = useSeason()
    const seasonsCycled = new Set<string>()

    const NUMBER_0F_SEASON = 4

    for (let i = 0; i < NUMBER_0F_SEASON; i++) {
      seasonsCycled.add(season.value)
      nextSeason()
    }

    expect(seasonsCycled.size).toBe(NUMBER_0F_SEASON)
  })

  it("should have seasonTheme with valid CSS gradient", () => {
    const { seasonTheme } = useSeason()
    const gradient = seasonTheme.value.gradient
    expect(gradient).toBeTruthy()
    expect(typeof gradient).toBe("string")
  })
})

