import http from "http";
import finalhandler from "finalhandler";
import serveIndex from "serve-index";
import serveStatic from "serve-static";
import portfinder from "portfinder";
import open from "open";
import os from "os";
import chalk from "chalk";

export default async function handleServer(path: string, p?: string): Promise<void> {
    let port = await portfinder.getPortPromise();
    if (p) {
        port = parseInt(p);
    }
    const ip = getIPAddress();
    const index = serveIndex(path, {
        icons: true
    });
    const serve = serveStatic(path, {
        index: ["index.html", "index.htm"]
    });

    const server = http.createServer(function onRequest(req, res) {
        const done = finalhandler(req, res);
        serve(req, res, function onNext(err) {
            if (err) return done(err);
            index(req, res, done);
        });
    });

    server.listen(port, "0.0.0.0");
    console.log(chalk.green.bold(`服务运行中...  => http://${ip}:${port}`));
    open(`http://${ip}:${port}`);
}

function getIPAddress(): string {
    const ifaces: any = os.networkInterfaces();
    const ipList: any = [];
    for (const dev in ifaces) {
        ifaces[dev].forEach(function (details) {
            if (details.family === "IPv4" && !details.internal) {
                ipList.push(details.address);
            }
        });
    }
    // Local IP first
    ipList.sort(function (ip1: string) {
        if (ip1.indexOf("192") >= 0) {
            return -1;
        }
        return 1;
    });
    return ipList[0] || "127.0.0.1";
}
