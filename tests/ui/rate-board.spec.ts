import { test, expect } from '@playwright/test';

test.describe('Rate Board UI', () => {

  test('should display title', async ({ page }) => {

    await page.goto('http://localhost:5173');

    await expect(
      page.getByText('Xe Rate Board')
    ).toBeVisible();

  });

  test('should display all currency pairs', async ({ page }) => {

    await page.goto('http://localhost:5173');

    await expect(page.getByText('USD / CAD')).toBeVisible();
    await expect(page.getByText('GBP / USD')).toBeVisible();
    await expect(page.getByText('EUR / USD')).toBeVisible();

  });

  test('should refresh rates', async ({ page }) => {

    await page.goto('http://localhost:5173');

    await page.getByRole('button', {
      name: 'Refresh rates'
    }).click();

    await expect(
      page.getByText('Last updated')
    ).toBeVisible();

  });

});