import { describe, expect, it, vi } from "vitest"

import { useTTS } from "@/composables/useTTS"

// Mock fetch globalement
globalThis.fetch = vi.fn()

describe("useTTS", () => {
  it("should initialize with isSpeaking = false", () => {
    const { isSpeaking } = useTTS()
    expect(isSpeaking.value).toBe(false)
  })

  it("should have a speak function", () => {
    const { speak } = useTTS()
    expect(typeof speak).toBe("function")
  })
})
