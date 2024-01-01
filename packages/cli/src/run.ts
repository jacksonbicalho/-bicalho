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
import { methodsLocal } from "./methods-local";

const commands: Array<string> = ["init"];

/**
 * @param {string} command process to run
 * @param {string[]} args command line arguments
 * @returns {Promise<void>} promise
 */
const runCommand = async (
  command: typeof methodsLocal,
  args: unknown[],
): Promise<void> => {
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

export const run = async (command: string, args?: string[]) => {
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
  const afirmative = commands.filter((cmd): boolean => cmd === command);

  if (!afirmative) {
    const [executable, script] = await scripts[command].split(" ");
    await runCommand(executable, [script, args]);
  }

  switch (command) {
    case "init":
      methodsLocal.init(args);
      break;

    default:
      break;
  }
};

const args = process.argv.slice(2);
const program = createCommand("cli");
program
  .name("cli")
  .usage("command [options]")
  .version("0.1.0")
  .command("init")
  .description("Install depencies")
  .option("--yes", "Install all dependencies", false)
  .action(() => run("init", args.slice(1)));

program.parse(process.argv);
