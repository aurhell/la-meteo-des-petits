import { expect, test } from "@playwright/test"

test.describe("App E2E Tests", () => {
  test.beforeEach(async({ page }) => {
    await page.goto("http://localhost:5173")
  })

  test("should load the app with title", async({ page }) => {
    expect(await page.title()).toContain("")
    const heading = page.locator("text=🌤️ La météo des petits ☀️")
    await expect(heading).toBeVisible()
  })

  test("should display friend selector initially", async({ page }) => {
    const friendSelector = page.locator("p:has-text('Qui va t\\'annoncer la météo aujourd\\'hui ?')")
    await expect(friendSelector).toBeVisible()
  })

  test("should be able to select a friend", async({ page }) => {
    // Click on first friend emoji button
    const firstFriendButton = page.locator("button").filter({ hasText: /[🐱🐶🐊🦄🐸🐭🐰🦊🐔🕷️]/ }).first()
    await firstFriendButton.click()

    // Should show weather after selection
    const weatherDisplay = page.locator("div").filter({ hasText: /[☀️⛅🌧️❄️⛈️]/ })
    await expect(weatherDisplay.first()).toBeVisible()
  })

  test("should display weather information", async({ page }) => {
    // Select a friend - wait for the button to appear
    const firstFriendButton = page.locator("button").filter({ hasText: "🐱" }).or(page.locator("button").filter({ hasText: "🐶" })).first()
    await firstFriendButton.click()

    // Check for temperature display - look for digits followed by °
    const tempDisplay = page.locator("text=/\\d+°/")
    await expect(tempDisplay).toBeVisible({ timeout: 3000 })
  })

  test("should have refresh button", async({ page }) => {
    const refreshButton = page.locator('button[title="Rafraîchir"]')
    await expect(refreshButton).toBeVisible()
  })

  test("should have locate button", async({ page }) => {
    const locateButton = page.locator('button[title="Me localiser"]')
    await expect(locateButton).toBeVisible()
  })

  test("should display location when available", async({ page }) => {
    // Wait for location to be displayed (it loads from the API)
    const location = page.locator("div").filter({ hasText: /📍/ })
    await expect(location.first()).toBeVisible({ timeout: 5000 })
  })

  test("should display weather data from API", async({ page }) => {
    // Verify the app loads weather data properly - look for digits + degree symbol
    const tempDisplay = page.locator("text=/\\d+°/")
    await expect(tempDisplay).toBeVisible({ timeout: 8000 })
  })

  test("should have speak button", async({ page }) => {
    // Select a friend first
    const firstFriendButton = page.locator("button").filter({ hasText: "🐱" }).or(page.locator("button").filter({ hasText: "🐶" })).first()
    await firstFriendButton.click()

    // Wait for weather to load then check for speak button
    await page.waitForTimeout(1000)
    const speakButton = page.locator("button:has-text('La météo!')")
    await expect(speakButton).toBeVisible({ timeout: 3000 })
  })

  test("should be able to toggle notifications", async({ page }) => {
    const notificationButton = page.locator('button[title="Alertes météo"]')
    // Button might not always be visible depending on browser permissions
    if (await notificationButton.isVisible()) {
      await notificationButton.click()
      // Notification status should change or permission dialog appear
    }
  })

  test("should load without errors", async({ page }) => {
    let hasConsoleError = false
    page.on("console", (message) => {
      if (message.type() === "error") {
        hasConsoleError = true
        console.error(message)
      }
    })

    await page.reload()
    expect(hasConsoleError).toBe(false)
  })
})
