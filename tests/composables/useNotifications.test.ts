import { describe, expect, it, beforeEach, afterEach, vi } from "vitest"

import { useNotifications } from "@/composables/useNotifications"

describe("useNotifications", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("should have hasNotificationSupport function", () => {
    const { hasNotificationSupport } = useNotifications()
    expect(typeof hasNotificationSupport).toBe("function")
  })

  it("should have requestPermission function", () => {
    const { requestPermission } = useNotifications()
    expect(typeof requestPermission).toBe("function")
  })

  it("should have showNotification function", () => {
    const { showNotification } = useNotifications()
    expect(typeof showNotification).toBe("function")
  })

  it("should track if permission has been asked", () => {
    const { hasAskedForPermission } = useNotifications()
    expect(typeof hasAskedForPermission).toBe("function")
    expect(hasAskedForPermission()).toBe(false)
  })

  it("should have permissionStatus ref", () => {
    const { permissionStatus } = useNotifications()
    expect(permissionStatus).toBeDefined()
  })
})
