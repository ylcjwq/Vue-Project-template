"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
// import * as path from 'node:path';
async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error('Usage: openapi-generator <openapi-file> <output-dir>');
        process.exit(1);
    }
    const [openapiFile, outputDir] = args;
    const generator = new index_1.OpenAPIGenerator(outputDir);
    try {
        await generator.generateFromFile(openapiFile);
        console.log('API files generated successfully!');
    }
    catch (error) {
        console.error('Error generating API files:', error);
        process.exit(1);
    }
}
main();
