import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    reporters: ['default', 'html'],
    outputFile: './tests/html/index.html', // 修改html文件输出的位置
    coverage: {
      enabled: true,
      provider: 'v8',
      cleanOnRerun: true,
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './tests/coverage', // 修改coverage文件输出的位置
      include: [
        'src/utils/*.{js,ts}',
        'src/hooks/*.{js,ts}',
      ],
      exclude: [
        'src/utils/*.{test,spec}.{js,ts}', // 排除测试文件
        'src/utils/*.d.ts', // 排除类型声明文件
        'src/hooks/*.{test,spec}.{js,ts}', // 排除测试文件
        'src/hooks/*.d.ts', // 排除类型声明文件
      ],
    },
  },
});
