// #!/usr/bin/env node

/**
 * Copyright 2023 Jackson Bicalho.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import prompts from "prompts";
import kleur from 'kleur';
import { utilities, WorkSpace } from "@bicalho/utilities";

prompts.override(require('yargs').argv);

type PackageChoice = {
  title: string, description: string, value: string
};

export const methodsLocal = {
  async init(_args?: string[]) {

    const workSpaces = utilities.listWorkSpaces();

    const packagesChoices: PackageChoice[] = [];

    workSpaces.map((packge: WorkSpace) => {
      packagesChoices.push({
        title: `${packge.name} - Curren version: ${packge.version}`,
        description: kleur.white(`${packge.description}`),
        value: packge.name,
      });
    });


    const response = await prompts([
      {
        type: "multiselect",
        name: "installPackages",
        message: "select the packages you want to install",
        choices: packagesChoices,
      },
    ]);

    console.log("[2023-12-31 20:05:13] >>>>> response: ", response);

  },

  check(args?: string[]) {
    console.log(args);
  },
};

export type TethodsLocalType = typeof methodsLocal;
