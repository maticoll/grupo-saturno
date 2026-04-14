import { test } from '@playwright/test';

test('capture screenshots', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const locale of ['es', 'en', 'zh']) {
    await page.goto(`/${locale}/`);
    await page.screenshot({ path: `docs/screenshots/${locale}-desktop.png`, fullPage: false });
  }

  await page.setViewportSize({ width: 375, height: 812 });
  for (const locale of ['es', 'en']) {
    await page.goto(`/${locale}/`);
    await page.screenshot({ path: `docs/screenshots/${locale}-mobile.png`, fullPage: false });
  }
});
