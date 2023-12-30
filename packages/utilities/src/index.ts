/**
 * Copyright 2023 Jackson Bicalho.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { readFileSync } from "fs";

/* eslint-disable @typescript-eslint/no-this-alias */
class Utilities {
  getJson = (jsonFile: string) => {
    const data = readFileSync(jsonFile, {
      encoding: "utf-8",
      flag: "r",
    });

    return JSON.parse(data.replace(
      /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
      (m, g) => (g ? "" : m),
    ));
  };
}
export const utilities = new Utilities();
