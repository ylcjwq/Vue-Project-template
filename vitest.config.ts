import { mergeConfig, defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
      reporters: ['default', 'html'],
      outputFile: './test/html/index.html',
      coverage: {
        enabled: true,
        provider: 'v8',
        cleanOnRerun: true,
        reporter: ['text', 'json', 'html'],
        reportsDirectory: './test/coverage',
        include: ['src/utils/*.{js,ts}', 'src/hooks/*.{js,ts}'],
        exclude: [
          'src/utils/*.{test,spec}.{js,ts}',
          'src/utils/*.d.ts',
          'src/hooks/*.{test,spec}.{js,ts}',
          'src/hooks/*.d.ts',
        ],
      },
    },
  }),
);
