import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/quiz-app/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    css: true,
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
