import { expect, test } from '@playwright/test'

test.describe('Aster portfolio', () => {
  test('loads the core experience without overflow or browser errors', async ({ page }) => {
    const browserErrors: string[] = []
    page.on('pageerror', (error) => browserErrors.push(error.message))
    page.on('console', (message) => {
      if (message.type() === 'error') browserErrors.push(message.text())
    })

    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('canvas.scene-canvas')).toBeVisible()
    await expect(page.locator('#work')).toBeVisible()
    await expect(page.locator('#contact')).toBeVisible()
    await expect(page.getByText('No borrowed metrics. No invented outcomes.', { exact: false })).toBeVisible()

    const hasNoHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
    expect(hasNoHorizontalOverflow).toBe(true)
    expect(browserErrors).toEqual([])
  })

  test('opens and closes a project case study with keyboard escape', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Open Signal Garden case study' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('dialog').getByRole('heading', { name: 'Signal Garden' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
  })

  test('keeps the mobile navigation and layout usable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Open navigation' })).toBeVisible()
    await page.getByRole('button', { name: 'Open navigation' }).click()
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible()
    await page.getByRole('link', { name: 'Work', exact: true }).click()
    await expect(page.locator('#work')).toBeInViewport()
    const hasNoHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
    expect(hasNoHorizontalOverflow).toBe(true)
  })

  test('honors reduced motion while retaining the content', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('.scene-layer')).toBeVisible()
    await expect(page.locator('#work')).toBeVisible()
  })
})
