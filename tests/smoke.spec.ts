import { test, expect } from '@playwright/test';

const routes = [
  '/es/',
  '/en/',
  '/zh/',
  '/es/FrigorificoFlorida',
  '/en/FrigorificoFlorida',
  '/zh/FrigorificoFlorida',
  '/es/FrigorificoSaturno',
  '/en/FrigorificoSaturno',
  '/zh/FrigorificoSaturno',
];

for (const route of routes) {
  test(`${route} — loads without 404`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBeLessThan(400);
  });
}

test('/es/ — H1 contains "26 años"', async ({ page }) => {
  await page.goto('/es/');
  const h1 = page.locator('h1').first();
  await expect(h1).toContainText('26 años');
});

test('/en/ — H1 contains "26 years"', async ({ page }) => {
  await page.goto('/en/');
  const h1 = page.locator('h1').first();
  await expect(h1).toContainText('26 years');
});

test('/es/ — language selector visible', async ({ page }) => {
  await page.goto('/es/');
  // Target anchor elements with hreflang (not <link> tags in <head>)
  const langSelector = page.locator('a[hreflang]').first();
  await expect(langSelector).toBeVisible();
});

test('/es/FrigorificoFlorida — breadcrumb visible with unit name', async ({ page }) => {
  await page.goto('/es/FrigorificoFlorida');
  const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
  await expect(breadcrumb).toBeVisible();
  await expect(breadcrumb).toContainText('Frigorífico Florida');
});
