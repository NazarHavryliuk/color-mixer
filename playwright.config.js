// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './__tests__/e2e',  // <- тільки e2e тести
});
