import { mergeConfig, defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true, // 是否启用全局变量
      environment: 'jsdom', // 测试环境
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], // 测试文件
      exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'], // 排除文件
      reporters: ['default', 'html'], // 测试报告
      outputFile: './test/html/index.html', // 测试报告输出路径
      deps: {
        inline: ['element-plus'], // 内联依赖
      },
      coverage: {
        enabled: true, // 是否启用覆盖率
        provider: 'v8', // 覆盖率报告提供者
        cleanOnRerun: true, // 是否在重新运行时清除覆盖率报告
        reporter: ['text', 'json', 'html'], // 覆盖率报告类型
        reportsDirectory: './test/coverage', // 覆盖率报告输出路径
        include: ['src/utils/**/*.{js,ts}', 'src/hooks/**/*.{js,ts}'], // 覆盖率报告包含的文件
        exclude: [
          // 覆盖率报告不包含的文件
          'src/utils/**/*.{test,spec}.{js,ts}',
          'src/utils/**/*.d.ts',
          'src/hooks/**/*.{test,spec}.{js,ts}',
          'src/hooks/**/*.d.ts',
        ],
      },
    },
  }),
);
