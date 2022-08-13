import chalk from "chalk";
import figlet from "figlet";
import { program } from "commander";
import pageageJSON from "../package.json"

import Server from "./plugins/server/index";

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
    .command("server [options]")
    .description("静态资源服务，-p 端口")
    .option("-p <port>", "端口")
    .action((_, options: { p?: string }) => {
        Server(process.cwd(), options.p);
    });

program.parse(process.argv);