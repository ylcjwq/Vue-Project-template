import antfu from '@antfu/eslint-config';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default antfu({
  vue: true,
  typescript: true,
  stylistic: {
    indent: 2, // 缩进使用 2 个空格
    quotes: 'single', // 使用单引号
    semi: true, // 语句末尾需要分号
  },
  ignores: ['**/node_modules/**', 'dist', 'pnpm-lock.yaml', '**/*.md', '.lintstagedrc', '.gitignore'], // 忽略的文件和目录
  rules: {
    'arrow-parens': ['error', 'always'],
    // 'unused-imports/no-unused-vars': 'off', // 关闭未使用变量检查
    // 'style/no-multi-spaces': 'off', // 关闭多空格检查
    'style/operator-linebreak': 'off', // 关闭运算符换行规则
    'style/brace-style': 'off', // 关闭大括号风格规则
    'style/arrow-parens': 'off', // 关闭箭头函数括号规则
    'antfu/top-level-function': 'off', // 关闭顶层函数必须使用 function 声明的规则
    'antfu/if-newline': 'off', // 关闭 if 语句换行规则
    '@typescript-eslint/explicit-function-return-type': 'off', // 关闭函数返回类型必须明确声明的规则
    'no-console': 'off', // 允许使用 console
    'n/prefer-global/process': 'off', // 允许使用 process 而不需要全局引入
    'prefer-promise-reject-errors': 'off', // 允许 Promise.reject 使用非 Error 对象
    'perfectionist/sort-imports': 'off', // 关闭导入排序规则
    'perfectionist/sort-named-imports': 'off', // 关闭导入排序规则
    'vue/singleline-html-element-content-newline': 'off', // 禁用标签换行规则
    'antfu/consistent-chaining': 'off', // 关闭链式调用规则
  },
  eslintPluginPrettierRecommended,
  eslintConfigPrettier,
});
