import { generateAPI } from '../src/index';
import path from 'node:path';

async function main() {
  // 示例 1: 基本用法
  await generateAPI({
    // 获取项目根目录
    openapiPath: path.join(process.cwd(), 'openapi.json'),
    outputDir: path.join(process.cwd(), 'src/api'),
  });

  console.log('API 生成成功！');
}

main().catch((error) => {
  console.error('API 生成失败:', error);
  process.exit(1);
});
