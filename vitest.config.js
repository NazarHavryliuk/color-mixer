import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['__tests__/unit/**/*.test.js'], // тільки твої юніт-тести
    exclude: ['node_modules/**', '**/e2e/**', '**/*.spec.e2e.js'] // виключаємо node_modules повністю
  }
});
