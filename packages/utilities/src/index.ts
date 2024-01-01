/**
 * Copyright 2023 Jackson Bicalho.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { constants } from "./constants";

type Reference = { path: string };

export type WorkSpace = {
  name: string;
  version: string;
  description: string;
  homepage: string;
};

/* eslint-disable @typescript-eslint/no-this-alias */
class Utilities {
  getJson = (jsonFile: string) => {
    const data = readFileSync(jsonFile, {
      encoding: "utf-8",
      flag: "r",
    });

    return JSON.parse(
      data.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) =>
        g ? "" : m,
      ),
    );
  };

  listWorkSpaces = () => {
    const tsConfigJsonFile = resolve(
      constants.APP_ROOT,
      constants.TSCONFIG_JSON_ROOT,
    );
    const tsConfigJsonContent = this.getJson(tsConfigJsonFile);
    const workSpaces = tsConfigJsonContent.references.map(
      (reference: Reference) => reference.path,
    );
    const data: WorkSpace[] = [];

    workSpaces.map((workSpace: string) => {
      const workSpaceDir = workSpace.split("/").slice(1).join("/");
      const packageJsonFile = resolve(
        constants.APP_ROOT,
        workSpaceDir,
        constants.PACKAGE_FILE_NAME,
      );
      const packageJsonCcontent = this.getJson(packageJsonFile);
      data.push({
        name: packageJsonCcontent.name,
        description: packageJsonCcontent.description,
        homepage: packageJsonCcontent.homepage,
        version: packageJsonCcontent.version,
      });
    });

    return data;
  };
}
export const utilities = new Utilities();
export { constants };
