/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(() => {
  // Determine base path based on environment
  let base = '/';

  // For GitHub Pages use repository path
  if (
    process.env.GITHUB_PAGES === 'true' ||
    process.env.NODE_ENV === 'production'
  ) {
    base = process.env.VITE_BASE_PATH || '/REACT2025Q3/';
  }

  return {
    plugins: [react()],
    base,
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      coverage: {
        provider: 'v8' as const,
        include: ['src/**/*.{js,jsx,ts,tsx}'],
        exclude: [
          'src/**/*.test.{js,jsx,ts,tsx}',
          'src/**/*.spec.{js,jsx,ts,tsx}',
          'src/index.{js,jsx,ts,tsx}',
          'src/main.{js,jsx,ts,tsx}',
          'src/setupTests.{js,ts}',
          'src/**/*.d.ts',
          'src/vite-env.d.ts',
        ],
        thresholds: {
          global: {
            statements: 80,
            branches: 50,
            functions: 50,
            lines: 50,
          },
        },
        reporter: ['text', 'json', 'html'],
      },
    },
  };
});
