# 前端系统模板

## 技术选型

- pnpm -- 包管理工具
- Vue3 -- 框架
- TypeScript -- 语言
- Vite -- 构建工具
- pinia -- 状态管理
- vue-router -- 路由
- Element Plus -- UI 库
- UnoCSS -- 原子 CSS
- VueUse -- 工具库
- Vitest -- 测试
- Eslint -- 代码规范
- Prettier -- 代码格式化
- Husky -- git钩子工具

## 项目结构

```bash
# git钩子
.husky/
# 无需处理的静态资源
public/
# 编译包
dist/
# 测试报告
tests/
# 全局类型声明
types/
# 项目源码
src/
├── assets/ #静态资源
├── components/ #组件
├── hooks/ #自定义 hooks
├── utils/ #工具函数
├── App.vue #主组件
├── main.ts #入口文件
# npm配置
.npmrc
# 代码格式化配置
.prettierrc
# 代码规范配置
eslint.config.js
# commitlint 配置
commitlint.config.ts
# UnoCSS 配置
uno.config.ts
# TypeScript 配置
tsconfig.app.json、tsconfig.json、tsconfig.node.json
# 项目构建配置
vite.config.ts
# 项目测试配置
vitest.config.ts
```

## 提交规范

`<type>: <commit-message>`

- build：主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
- ci：主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
- docs：文档更新
- feat：新增功能
- fix：bug 修复
- perf：性能优化
- refactor：重构代码(既没有新增功能，也没有修复 bug)
- revert：回滚某个更早之前的提交
- style：不影响程序逻辑的代码修改(修改空白字符，补全缺失的分号等)
- test：新增测试用例或是更新现有测试
- chore：不属于以上类型的其他类型(日常事务)
