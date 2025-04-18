# OpenAPI TypeScript Generator

一个用于从 OpenAPI 文档生成 TypeScript API 客户端的工具。

## 安装

```bash
npm install openapi-typescript-generator
```

## 使用方法

### 作为独立工具使用

```typescript
import { generateAPI } from 'openapi-typescript-generator';

// 从文件生成 API
await generateAPI({
  openapiPath: './openapi.json',
  outputDir: './src/api'
});
```

### 作为 Vite 插件使用（可选）

如果你使用 Vite，可以将其作为插件使用：

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { viteOpenAPIGenerator } from 'openapi-typescript-generator';

export default defineConfig({
  plugins: [
    viteOpenAPIGenerator({
      openapiPath: './openapi.json',
      outputDir: './src/api'
    })
  ],
});
```

## 功能

- 从 OpenAPI 文档生成 TypeScript 接口和 API 客户端
- 支持按标签（tag）分组生成 API 文件
- 自动生成请求类型、响应类型和错误类型
- 支持路径参数、查询参数和请求头

## API

### generateAPI(options)

主要函数，根据提供的选项生成 API 文件。

#### 选项

- `openapiPath`：OpenAPI 文档的文件路径
- `outputDir`：生成的 API 文件的输出目录

### OpenAPIGenerator 类

如果你需要更多控制，可以直接使用 `OpenAPIGenerator` 类：

```typescript
import { OpenAPIGenerator } from 'openapi-typescript-generator';

const generator = new OpenAPIGenerator('./src/api');

// 从文件生成
await generator.generateFromFile('./openapi.json');

// 或从字符串生成
const openApiContent = '...'; // OpenAPI JSON 内容
await generator.generateFromString(openApiContent);
```

## 许可证

MIT
