import fs from 'node:fs';
import path from 'node:path';

interface Options {
  maxLines?: number;
  ignore?: string[];
  ignorePattern?: RegExp[];
  include?: string[];
  fileTypes?: string[];
}

function countFileLines(filePath: string): number {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split('\n').length;
}

function isIgnored(filePath: string, ignore: string[], ignorePattern: RegExp[]): boolean {
  // 检查是否在忽略目录中
  if (ignore.some((dir) => filePath.includes(dir))) {
    return true;
  }

  // 检查是否匹配忽略模式
  if (ignorePattern.some((pattern) => pattern.test(filePath))) {
    return true;
  }

  return false;
}

function shouldCheckFile(
  filePath: string,
  include: string[],
  fileTypes: string[],
  cwd: string,
): boolean {
  // 检查文件类型
  const ext = path.extname(filePath);
  if (!fileTypes.includes(ext)) {
    return false;
  }

  // 如果没有指定包含路径，则检查所有符合类型的文件
  if (include.length === 0) {
    return true;
  }

  // 检查文件是否在指定路径下
  const relativePath = path.relative(cwd, filePath);
  return include.some((includePath) => {
    const normalizedIncludePath = includePath.replace(/^\.\//, '');
    return relativePath.startsWith(normalizedIncludePath);
  });
}

export default function lineCounterPlugin(options: Options = {}) {
  const {
    maxLines = 300,
    ignore = ['node_modules', 'dist'],
    ignorePattern = [/\.d\.ts$/],
    include = [],
    fileTypes = ['.vue', '.ts', '.js', '.jsx', '.tsx'],
  } = options;

  return {
    name: 'vite-plugin-line-counter',
    enforce: 'post',

    async buildEnd() {
      console.log('\n--- 开始检查文件行数 ---\n');

      if (include.length > 0) {
        console.log('检查路径:', include.join(', '));
      }
      console.log('检查文件类型:', fileTypes.join(', '));
      console.log('行数限制:', maxLines);
      console.log();

      const cwd = process.cwd();
      const warnings: string[] = [];

      const checkDirectory = (dir: string) => {
        const files = fs.readdirSync(dir);

        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            if (!isIgnored(fullPath, ignore, ignorePattern)) {
              checkDirectory(fullPath);
            }
          } else if (stat.isFile()) {
            if (
              !isIgnored(fullPath, ignore, ignorePattern) &&
              shouldCheckFile(fullPath, include, fileTypes, cwd)
            ) {
              const lineCount = countFileLines(fullPath);
              if (lineCount > maxLines) {
                const relativePath = path.relative(cwd, fullPath);
                warnings.push(`${relativePath}: ${lineCount} 行 (超过 ${maxLines} 行限制)`);
              }
            }
          }
        }
      };

      checkDirectory(cwd);

      if (warnings.length > 0) {
        console.warn('\n⚠️ 以下文件超过最大行数限制:\n');
        warnings.forEach((warning) => console.warn('\x1B[33m%s\x1B[0m', warning));
        console.warn('\n建议对以上文件进行重构，将其拆分为更小的模块。\n');
      } else {
        console.log('✅ 所有文件行数都在限制范围内\n');
      }
    },
  };
}
