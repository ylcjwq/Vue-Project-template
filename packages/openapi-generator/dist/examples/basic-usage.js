"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
const node_path_1 = __importDefault(require("node:path"));
async function main() {
    // 示例 1: 基本用法
    await (0, index_1.generateAPI)({
        // 获取项目根目录
        openapiPath: node_path_1.default.join(process.cwd(), 'openapi.json'),
        outputDir: node_path_1.default.join(process.cwd(), 'src/api'),
    });
    console.log('API 生成成功！');
}
main().catch((error) => {
    console.error('API 生成失败:', error);
    process.exit(1);
});
