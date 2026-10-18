import { expect, test } from '@playwright/test';

async function startCountryQuiz(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByRole('link', { name: 'Åpne modul' }).click();
  await page.getByRole('button', { name: 'Europa' }).click();
  await page.getByRole('button', { name: 'Start spill' }).click();
}

test('country quiz gives feedback after clicking the matching country', async ({ page }) => {
  await startCountryQuiz(page);

  const countryName = (await page.getByTestId('atlas-question-primary').textContent())?.trim();
  expect(countryName).toBeTruthy();

  const target = page.locator(`[data-country-label=${JSON.stringify(countryName)}]`).first();
  await expect(target).toBeVisible();
  await target.click({ force: true });

  await expect(page.getByTestId('atlas-feedback')).toContainText(/Perfekt treff|Nesten|Nært/i);
});

test('capital quiz shows distance after placing a pin', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Åpne modul' }).click();
  await page.getByRole('button', { name: /^Hovedsteder/ }).click();
  await page.getByRole('button', { name: 'Europa' }).click();
  await page.getByRole('button', { name: 'Start spill' }).click();

  await page.locator('.atlas-map__svg').click({ position: { x: 500, y: 240 } });

  await expect(page.getByTestId('atlas-feedback')).toContainText('km');
  await expect(page.getByTestId('atlas-feedback')).toContainText('poeng');
});

test('language switching updates the atlas home copy', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 2, name: 'Velg en quizmodul' })).toBeVisible();
  await page.getByRole('button', { name: 'EN' }).click();
  await expect(page.getByRole('heading', { level: 2, name: 'Choose a quiz module' })).toBeVisible();
  await page.getByRole('link', { name: 'Open module' }).click();
  await expect(page.getByRole('heading', { level: 2, name: 'Choose your Atlas adventure' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Countries' })).toBeVisible();
});
