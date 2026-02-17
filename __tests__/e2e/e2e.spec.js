import { test, expect } from '@playwright/test';

test('Critical path: slider color mixing works', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Встановлюємо значення повзунків
  await page.evaluate(() => {
    const red = document.getElementById('red');
    const green = document.getElementById('green');
    const blue = document.getElementById('blue');

    red.value = 255;
    green.value = 0;
    blue.value = 0;

    red.dispatchEvent(new Event('input'));
    green.dispatchEvent(new Event('input'));
    blue.dispatchEvent(new Event('input'));
  });


  // Натискаємо кнопку
  await page.click('#applyColor');


  // Перевіряємо результат
  const hexText = await page.textContent('#sensorHex');
  await expect(hexText).toBe('#FF0000');
});
