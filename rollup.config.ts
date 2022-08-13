import path from "path";
import rollupTypescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import json from "@rollup/plugin-json";
import pkg from "./package.json";

const paths = {
    input: path.join(__dirname, "/src/index.ts"),
    output: path.join(__dirname, "/lib")
};
export default {
    input: 'src/index.ts',
    output: [
        // 输出 commonjs 规范的代码
        {
            file: path.join(paths.output, "index.js"),
            format: "cjs",
            name: pkg.name,
            exports: "auto",
            banner: "#!/usr/bin/env node"
        }
    ],
    plugins: [
        json(),
        // 配合 commnjs 解析第三方模块
        commonjs(),
        // 生成声明文件
        rollupTypescript({
            tsconfig: path.resolve(__dirname, "tsconfig.json")
        })
    ],
    // 排除node_modules
    external: [/node_modules/]
};