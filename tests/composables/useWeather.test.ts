import { describe, expect, it } from "vitest"

import { useWeather } from "@/composables/useWeather"

describe("useWeather", () => {
  it("should have weather data refs", () => {
    const { weather, isLoading, error, location } = useWeather()
    expect(weather).toBeDefined()
    expect(isLoading).toBeDefined()
    expect(error).toBeDefined()
    expect(location).toBeDefined()
  })

  it("should have refs defined", () => {
    const { weather, isLoading, error, location } = useWeather()
    expect(weather).toBeDefined()
    expect(isLoading).toBeDefined()
    expect(error).toBeDefined()
    expect(location).toBeDefined()
  })

  it("should have fetchWeather function", () => {
    const { fetchWeather } = useWeather()
    expect(typeof fetchWeather).toBe("function")
  })

  it("should have requestGeolocation function", () => {
    const { requestGeolocation } = useWeather()
    expect(typeof requestGeolocation).toBe("function")
  })

  it("should have getDefaultWeather function", () => {
    const { getDefaultWeather } = useWeather()
    expect(typeof getDefaultWeather).toBe("function")
  })

  it("should have clearError function", () => {
    const { clearError } = useWeather()
    expect(typeof clearError).toBe("function")
  })

  it("should have setWeather function", () => {
    const { setWeather } = useWeather()
    expect(typeof setWeather).toBe("function")
  })

  it("should have lastUpdated ref", () => {
    const { lastUpdated } = useWeather()
    expect(lastUpdated).toBeDefined()
  })
})

