// #!/usr/bin/env node

/**
 * Copyright 2023 Jackson Bicalho.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createCommand } from "@commander-js/extra-typings";
import path from "path";
import { utilities } from "@bicalho/utilities";

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

export const runCli = (command: string, args?: string[]) => {
  const appRoot = process.env.INIT_CWD;
  const directories = module.paths;
  let packageJsonFile = undefined;
  directories.map((directory) => {
    packageJsonFile = path.join(
      `${appRoot}`,
      `${directory}`,
      "@bicalho",
      "cli",
      "package.json",
    );
  });
  const packageJsonCcontent = utilities.getJson(`${packageJsonFile}`);
  const scripts = packageJsonCcontent.scripts;
  const [executable, script] = scripts[command].split(" ");
  runCommand(executable, [script, args]);
};

const args = process.argv.slice(2);
const program = createCommand();
program
  .usage("command [options]")
  .version("0.1.0")
  .command("init")
  .description("Initial configuration")
  .action(() => runCli("init", args));

program.parse(process.argv);
