# vite-plugin-line-counter

一个用于检查项目文件行数的 Vite 插件。在构建时会检查所有文件的行数，如果超过设定的最大行数限制，将会给出警告提示。

## 安装

```bash
pnpm add @packages/vite-plugin-line-counter -D
```

## 使用

在 `vite.config.ts` 中配置：

```typescript
import lineCounter from '@packages/vite-plugin-line-counter'

export default defineConfig({
  plugins: [
    lineCounter({
      maxLines: 300, // 单文件最大行数限制
      ignore: ['node_modules', 'dist'], // 忽略的文件夹
      ignorePattern: [/\.d\.ts$/], // 忽略的文件模式
      include: ['src/components', 'src/views'], // 指定要检查的文件夹路径
      fileTypes: ['.vue', '.ts'] // 指定要检查的文件类型
    })
  ]
})
```

## 配置选项

- `maxLines`: 单个文件最大行数限制，默认为 300 行
- `ignore`: 要忽略的文件夹名称数组，默认为 ['node_modules', 'dist']
- `ignorePattern`: 要忽略的文件正则表达式数组，默认为 [/\.d\.ts$/]
- `include`: 指定要检查的文件夹路径数组，为空则检查所有文件，默认为 []
- `fileTypes`: 指定要检查的文件类型数组，默认为 ['.vue', '.ts', '.js', '.jsx', '.tsx']

## 输出示例

```
--- 开始检查文件行数 ---

检查路径: src/components, src/views
检查文件类型: .vue, .ts
行数限制: 300

⚠️ 以下文件超过最大行数限制:

src/components/LargeComponent.vue: 352 行 (超过 300 行限制)
src/views/Home.vue: 420 行 (超过 300 行限制)

建议对以上文件进行重构，将其拆分为更小的模块。 
