import { Config } from "@bicalho/config";
import { server } from "./server";
import * as path from "node:path";
import * as fs from "node:fs";

class SslDev {
  constructor(readonly configServer: unknown) {
    this.configServer = configServer;
  }

  run() {
    const { rootApp, keysPath, publicDomain, webPort } = configServer as never;
    const sslFiles: { key: string; cert: string } = {
      key: path.resolve(`${rootApp}`, `${keysPath}`, `${publicDomain}.key.pem`),
      cert: path.resolve(
        `${rootApp}`,
        `${keysPath}`,
        `${publicDomain}.cert.pem`,
      ),
    };

    Object.entries(sslFiles).map((file) => {
      if (!fs.existsSync(file[1])) {
        const reason = `\nfile not found!\n${file[0]}: ${file[1]}`;
        throw new Error(reason);
      }
    });

    const options = {
      key: fs.readFileSync(sslFiles.key),
      cert: fs.readFileSync(sslFiles.cert),
    };

    const bootstrap = server(options, configServer);
    bootstrap.listen(webPort, () => {
      console.log(`Running at https://${publicDomain}:${webPort}`);
    });
  }
}

const configDefault = {
  rootApp: path.resolve(`${process.env.PWD}`),
  publicDomain: "localhost",
  contenPublic: "example",
  webPort: 8081,
  keysPath: "ssl",
  renderSingle: false,
  cleanUrls: ["/**"],
  rewrites: [{ source: "app/**", destination: "/index.html" }],
};

const config = new Config().configure(configDefault);
const configServer = config.getConfig();

const sslldev = new SslDev(configServer);

export { sslldev };
