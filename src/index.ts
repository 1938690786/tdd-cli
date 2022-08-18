import chalk from "chalk";
import figlet from "figlet";
import { program } from "commander";
import pageageJSON from "../package.json"

import Server from "./plugins/server/index";
import FileTree from "./plugins/file-tree/index"

program.name("tdd");

console.log(chalk.yellow(figlet.textSync('tdd', {
    horizontalLayout: 'full'
})));

program
    .command("v")
    .description("查看当前版本")
    .action(() => {
        console.log(chalk.red("当前版本: " + pageageJSON.version))
    });

program
    .command("server")
    .description("静态资源服务，-p 端口")
    .option("-p <port>", "端口")
    .action((_, options: { p?: string }) => {
        console.log("options.p", options.p)
        Server(process.cwd(), options.p);
    });

program
    .command("tree")
    .description("获取文件夹下目录树，-p(Path) 指定的路径 -i(Ignore) 忽略的文件或路径 -o(Output) 是否输出文本")
    .option("-i <ignore>", "忽略的文件 多个参数以','隔开 例如 assets,bin  注:默认会忽视node_modules文件夹")
    .option("-o <output>", "是否输出文本 0不输出 1输出 默认输出")
    .option("-l <floor>", "需要遍历的层级 指定数字")
    .action((value) => {
        FileTree(value);
    });

program.parse(process.argv);