import fs from 'node:fs';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import _generator from '@babel/generator';
import { parse as sfcParse } from '@vue/compiler-sfc';
import { execCommand } from './exec.ts';

const traverse = (_traverse as typeof _traverse & { default: typeof _traverse }).default;
const generator = (_generator as typeof _generator & { default: typeof _generator }).default;
let isDev = false;
let username = '';
let map: Record<number, string> = {};

/**
 * 初始化git用户名
 */
const initUsername = async () => {
  if (!username) {
    username = (await execCommand('git config user.name')) as string;
  }
};

/**
 * 处理文件内容
 * @param {*} scriptContent 文件内容
 * @param {*} id 文件路径
 * @returns 处理后的文件内容
 */
const processScript = (scriptContent: string, id: string) => {
  const ast = parse(scriptContent, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  traverse(ast, {
    CallExpression(path: any) {
      if (
        path.node.callee.type === 'MemberExpression' &&
        path.node.callee.property.name === 'log'
      ) {
        const logLine = path.node.loc.start.line;
        const commiter = map[logLine];
        if (commiter !== username && commiter !== 'Not') {
          console.log(
            `文件${id}的第${path.node.loc.start.line}行找到了非${username}的console.log。`,
          );
          path.remove();
        }
      }
    },
  });

  return generator(ast).code;
};

export default function removeConsolePlugin() {
  return {
    name: 'remove-console-plugin',
    async config(_config: any, ctx: { mode: string }) {
      isDev = ctx.mode === 'development';
      await initUsername();
      console.log('当前用户：', username);
    },
    async load(id: string) {
      const url = id;
      if (url.includes('/src/') && /\.(?:[tj]sx?|vue)$/.test(url) && isDev) {
        const blameOutput = (await execCommand(`git blame ${id}`)) as string;

        map = blameOutput
          .trim()
          .split('\n')
          .reduce((acc: Record<number, string>, line: string, index: number) => {
            // 修改行解析逻辑，因为输出格式会有所不同
            const match = line.match(/\((.*?)\)/);
            if (!match) {
              acc[index + 1] = 'Not';
              return acc;
            }
            const author = match[1];
            acc[index + 1] = author.trim().split(' ')[0];
            return acc;
          }, {});

        const originalContent = fs.readFileSync(id, 'utf-8');

        // 处理 .vue 文件
        if (url.endsWith('.vue')) {
          const { descriptor } = sfcParse(originalContent);
          let result = originalContent;

          // 处理 <script setup> 部分
          if (descriptor.scriptSetup) {
            const newCode = processScript(descriptor.scriptSetup.content, id);
            result = result.replace(descriptor.scriptSetup.content, newCode);
          }

          // 处理普通 <script> 部分
          if (descriptor.script && !descriptor.scriptSetup) {
            const newCode = processScript(descriptor.script.content, id);
            result = result.replace(descriptor.script.content, newCode);
          }

          return result;
        }

        // 处理其他文件（.js, .jsx, .ts, .tsx）
        const result = processScript(originalContent, id);
        return result;
      }
    },
  };
}
