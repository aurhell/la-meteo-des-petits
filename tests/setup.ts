import { vi } from "vitest"

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = String(value)
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key: (index: number) => Object.keys(store)[index] || null,
  }
})()

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

// Mock Notification API
Object.defineProperty(window, "Notification", {
  writable: true,
  value: vi.fn(() => ({
    close: vi.fn(),
  })),
})

// Mock navigator.geolocation
Object.defineProperty(navigator, "geolocation", {
  writable: true,
  value: {
    getCurrentPosition: vi.fn(),
  },
})
