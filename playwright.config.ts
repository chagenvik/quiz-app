import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  testMatch: /.*\.e2e\.ts/,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:4173/quiz-app/',
    locale: 'nb-NO',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm exec vite preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173/quiz-app/',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
      },
    },
  ],
});
