/*
 * @Author: xw
 * @Date: 2022-08-18 11:57:07
 * @LastEditors: xw
 * @LastEditTime: 2022-08-18 11:57:07
 * @Description:
 */
import fs from 'fs'
import path from "path"
import ncp from "copy-paste"
import chalk from "chalk";

/**
 * @param i 忽略文件
 * @param o 是否输出txt文件
 * @param l 指定层级
 */
interface TreeOptions {
    i?: string,
    o?: string,
    l?: string,
}
export default async function createdTree(value: TreeOptions): Promise<void> {
    const { i, o, l } = value
    let basepath = process.cwd(); //解析目录路径
    let filterFile = ["node_modules", "\\..*"]; //过滤文件名，使用，隔开
    let stopFloor = 10; //遍历层数
    let generatePath = "./fileTree.txt"; //生成文件路径
    let isFullPath = true; //是否输出完整路径
    let isOuput = true; // 是否输出文件
    if (i) {
        let arr = i.split(",")
        filterFile = filterFile.concat(arr)
    }
    if (l) {
        const num = parseInt(l)
        if (num === NaN) {
            console.log(chalk.yellow("参数-l传递类型错误,已自动切换默认层数10"))
        } else {
            if (num > 10) {
                console.log(chalk.yellow("超出最大层级限制,已自动切换默认层数10"))
            } else if (num === 0) {
                console.log(chalk.yellow("最小指定层级为1,已切换为最小层数1"))
                stopFloor = 1
            } else {
                stopFloor = num
            }
        }
    }
    if (o) {
        o === '1' && (isOuput = true)
        o === '0' && (isOuput = false)
        if (o !== '0' && o !== '1') {
            console.log(chalk.yellow("未匹配到o(是否输出txt文件)，请指定正确参数 0:不输出 1:输出 默认输出"))
        }
    }

    function getPartPath(dirPath) {
        let base = basepath.split(/\/|\\/g);
        dirPath = dirPath.split(/\/|\\/g);
        while (base.length && dirPath.length && base[0] === dirPath[0]) {
            base.shift();
            dirPath.shift();
        }
        return dirPath.join("/");
    }

    /** 是否要过滤的路径 */
    function isFilterPath(item) {
        for (let i = 0; i < filterFile.length; i++) {
            let reg = filterFile[i];
            if (item.match(reg) && item.match(reg)[0] === item) return true;
        }
        return false;
    }


    function processDir(dirPath, dirTree: any = [], floor = 1) {
        if (floor > stopFloor) return;
        let list = fs.readdirSync(dirPath);
        list = list.filter((item) => {
            return !isFilterPath(item);
        });
        list.forEach((itemPath) => {
            const fullPath = path.join(dirPath, itemPath);
            const fileStat = fs.statSync(fullPath);
            const isFile = fileStat.isFile();
            const dir: any = {
                name: isFullPath ? getPartPath(fullPath) : itemPath,
            };
            if (!isFile) {
                dir.children = processDir(fullPath, [], floor + 1);
            }
            dirTree.push(dir);
        });
        return dirTree;
    }
    let dirTree: any = [];
    dirTree = processDir(basepath, dirTree)
    let fileTree = ''
    function consoleTree(tree, floor = 1, str = "", adder = "─ ", isLast = false) {
        str += adder;
        for (let i = 0; i < tree.length; i++) {
            if (floor === 1 && i === 0) {
                fileTree += "\n" + "┌" + str + tree[i].name;
            } else if (
                (isLast || floor === 1) &&
                i === tree.length - 1 &&
                !tree[i].children
            ) {
                fileTree += "\n" + "└" + str + tree[i].name;
            } else {
                fileTree += "\n" + "├" + str + tree[i].name;
            }
            if (tree[i].children)
                consoleTree(
                    tree[i].children,
                    floor + 1,
                    str,
                    adder,
                    (isLast || floor === 1) && i === tree.length - 1
                );
        }
    }
    function writeTree(filePath, content) {
        clearTxt(generatePath);
        fs.writeFileSync(filePath, `${content}`);
        console.log(content);
    }
    function clearTxt(filePath) {
        fileTree = "";
        fs.writeFileSync(filePath, "");
    }
    consoleTree(dirTree);
    isOuput && writeTree(generatePath, fileTree);
    ncp.copy(fileTree, () => {
        console.log(chalk.blue("已复制至剪贴板"))
    })
}
