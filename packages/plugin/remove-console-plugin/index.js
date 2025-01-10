import fs from 'node:fs';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generator from '@babel/generator';
import { parse as sfcParse } from '@vue/compiler-sfc';
import { execCommand } from './exec.js';

let isDev = false;
let username = '';
let map = {};

/**
 * 初始化git用户名
 */
const initUsername = async () => {
  if (!username) {
    username = await execCommand('git config user.name');
  }
};

/**
 * 处理文件内容
 * @param {*} scriptContent 文件内容
 * @param {*} id 文件路径
 * @returns 处理后的文件内容
 */
const processScript = (scriptContent, id) => {
  const ast = parse(scriptContent, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  traverse.default(ast, {
    CallExpression(path) {
      if (
        path.node.callee.type === 'MemberExpression' &&
        path.node.callee.property.name === 'log'
      ) {
        console.log(`文件${id}的第${path.node.loc.start.line}行找到了console.log。`);
        const logLine = path.node.loc.start.line;
        const commiter = map[logLine];
        console.log('commiter', commiter);
        if (commiter !== username && commiter !== 'Not') {
          path.remove();
        }
      }
    },
  });

  return generator.default(ast).code;
};

export default function removeConsolePlugin() {
  return {
    name: 'remove-console-plugin',
    async config(config, ctx) {
      isDev = ctx.mode === 'development';
      await initUsername();
      console.log('username', username);
    },
    async load(id) {
      const url = id;
      if (url.includes('/src/') && /\.(?:[tj]sx?|vue)$/.test(url) && isDev) {
        const blameOutput = await execCommand(`git blame ${id}`);

        map = blameOutput
          .trim()
          .split('\n')
          .reduce((acc, line, index) => {
            // 修改行解析逻辑，因为输出格式会有所不同
            const [, author] = line.match(/\((.*?)\)/).input.split('(');
            acc[index + 1] = author.replace(')', '').trim().split(' ')[0];
            return acc;
          }, {});

        console.log('map', map);
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
    transform(code, id) {
      const url = id;
      if (url.includes('/src/') && /\.[tj]sx?$/.test(url)) {
        return `${code}\n` + `// 一行注释`;
      }
      return code;
    },
  };
}
