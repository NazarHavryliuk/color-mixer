import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [
      '**/e2e/**', 
      '**/*.spec.e2e.js'
    ]
  }
});
