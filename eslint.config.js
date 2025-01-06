import antfu from '@antfu/eslint-config';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default antfu({
  vue: true,
  typescript: true,
  // formatters: true,
  stylistic: {
    indent: 2, // 缩进使用 2 个空格
    quotes: 'single', // 使用单引号
    semi: true, // 语句末尾需要分号
  },
  ignores: ['node_modules', 'dist', 'pnpm-lock.yaml'],
  rules: {
    // 'unused-imports/no-unused-vars': 'off', // 关闭未使用变量检查
    '@typescript-eslint/explicit-function-return-type': 'off', // 关闭函数返回类型必须明确声明的规则
    'no-console': 'off', // 允许使用 console
    'n/prefer-global/process': 'off', // 允许使用 process 而不需要全局引入
    'prefer-promise-reject-errors': 'off', // 允许 Promise.reject 使用非 Error 对象
    'perfectionist/sort-imports': 'off', // 关闭导入排序规则
    'vue/singleline-html-element-content-newline': 'off', // 禁用标签换行规则
  },
  eslintPluginPrettierRecommended,
  eslintConfigPrettier,
});
