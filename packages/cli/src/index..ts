// #!/usr/bin/env node

/**
 * Copyright 2023 Jackson Bicalho.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createCommand } from "@commander-js/extra-typings";
import path from "path";
import { existsSync, readFileSync } from "fs";
import { PackageJson } from "types-package-json";

/**
 * @param {string} command process to run
 * @param {string[]} args command line arguments
 * @returns {Promise<void>} promise
 */
export const runCommand = (command: string, args: unknown[]): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cp = require("child_process");
  return new Promise((resolve, reject) => {
    const executedCommand = cp.spawn(command, args, {
      stdio: "inherit",
      shell: true,
    });
    executedCommand.on("error", (error: unknown) => {
      reject(error);
    });
    executedCommand.on("exit", (code: number) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

export const runCli = () => {
  const cli = (command: string, args?: string[]) => {
    const httpsPackageJson = packageJson.read();
    const scripts = httpsPackageJson.scripts;
    if (scripts === undefined) {
      console.error("file not found");
      process.exit(1);
    }
    const httpsPackageName = httpsPackageJson.name;
    if (httpsPackageName === undefined) {
      console.error("httpsPackageName not found");
      process.exit(1);
    }

    const [executable, moduleLib] = scripts[command].split(" ");
    const pwd = process.env.PWD;
    const moduleLibPath = path.resolve(
      `${pwd}`,
      "node_modules",
      httpsPackageName,
      moduleLib,
    );
    const options: string | undefined = args?.join(" ");
    runCommand(executable, [moduleLibPath, options]);
  };

  process.argv.slice(2);
  const program = createCommand("ssldev");
  program
    .name("ssldev")
    .usage("command [options]")
    .version("0.1.0")
    .command("setup", { isDefault: true })
    .description("generate config file")
    .action(() => cli("setup"));

  program
    .command("start")
    .description("start server https")
    .action(() => cli("start"));

  program
    .command("mkcert")
    .description("generate ssl keys")
    .option("-d, --domain <string>", "specified domain", "publicDomain")
    .option("-p, --path <string>", "specified path", "ssl")
    .action(() => cli("mkcert", process.argv));

  program.parse(process.argv);
};

export const packageJson = {
  readContent(file: string): Partial<PackageJson> {
    if (!existsSync(file)) {
      throw new Error(`${file} not found`);
    }

    return JSON.parse(
      readFileSync(file, {
        encoding: "utf-8",
        flag: "r",
      }),
    );
  },

  /* eslint-disable @typescript-eslint/no-this-alias */
  search(): Partial<PackageJson> {
    const directories = Object.values(module.paths).flatMap((directory) =>
      directory.split("node_modules"),
    );
    const files: Partial<PackageJson>[] = [];
    directories.map((dir) => {
      const file = path.join("node_modules", dir, "package.json");
      if (existsSync(file)) {
        const packageJson = this.readContent(file);
        const index = files.findIndex((f) => f.name === packageJson.name);
        if (index == -1) {
          files.push(packageJson);
        }
      }
    });
    if (files.length < 1) {
      throw new Error(`not found`);
    }
    return files[0];
  },

  read(file?: string): Partial<PackageJson> {
    if (!file) {
      return this.search();
    }

    return this.readContent(file);
  },
};
