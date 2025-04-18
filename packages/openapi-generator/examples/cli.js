#!/usr/bin/env node

const { generateAPI } = require('../dist/src/index');

async function main() {
  const args = process.argv.slice(2);
  let openapiPath;
  let outputDir;

  // 解析命令行参数
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--openapi' || arg === '-o') {
      openapiPath = args[++i];
    } else if (arg === '--output' || arg === '-d') {
      outputDir = args[++i];
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  if (!openapiPath || !outputDir) {
    console.error('错误: 缺少必要参数');
    printHelp();
    process.exit(1);
  }

  try {
    await generateAPI({
      openapiPath,
      outputDir,
    });
    console.log(`API 文件已成功生成到 ${outputDir}`);
  } catch (error) {
    console.error('生成 API 文件失败:', error.message);
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
openapi-typescript-generator CLI

使用方法:
  node cli.js --openapi <文档路径> --output <输出目录>

选项:
  --openapi, -o     OpenAPI 文档的路径
  --output, -d      生成的 API 文件的输出目录
  --help, -h        显示帮助信息
`);
}

main();
