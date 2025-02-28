# 前端系统模板

## 项目脚本

- pnpm run dev -- 开发环境
- pnpm run dev:rmLog -- 开发环境（去除非当前用户的console.log）
- pnpm run transform -- 开发环境（依赖加载分析）
- pnpm run build -- 打包
- pnpm run preview -- 预览（须先打包）
- pnpm run test -- 测试环境
- pnpm run test:coverage -- 生成测试覆盖率报告
- pnpm run test:ui -- 生成测试报告UI页面
- pnpm run lint -- eslint校验
- pnpm run lint:fix -- eslint校验（自动修复）

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
# monorepo包
packages/
# 编译包
dist/
# docker与nginx配置
docker/
# 测试报告
test/
# 项目源码
src/
├── api/ #接口
├── assets/ #静态资源
├── components/ #组件
├── routers/ #路由
├── stores/ #状态管理仓库
├── hooks/ #自定义 hooks
├── utils/ #工具函数
├── tests/ #测试文件
├── types/ #全局类型声明
├── styles/ #样式
├── layouts/ #布局
├── views/ #页面
├── App.vue #主组件
├── main.ts #入口文件
# 开发环境配置文件
.env.development
# 生产环境配置文件
.env.production
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

## 文件命名

- 文件夹 使用小写字母和 - 连接
```ts
eg: 
├──view-core/
│ ├── index.vue
│ ├── Core.vue
│ └── index.ts
```
- ts文件/js文件/单方法文件夹 使用小驼峰命名 
```ts
eg：
useRequest.ts
├── useRequest/
│ ├── index.ts
│ └── index.test.ts
```
- vue文件/组件 使用大驼峰命名 （index.vue 除外），文件中使用时则使用 - 连接。
```ts
eg: 
VueDraggable.vue
├──view-core/
│ ├── index.vue
│ ├── CoreWidget.vue
│ └── index.ts

// template中使用
<vue-draggable />
```

## 部署

- 打包
- 运行docker compose -f docker/docker-compose.yml up -d --build
