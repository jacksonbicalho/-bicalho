/**
 * Copyright 2023 Jackson Bicalho.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { readFileSync } from "fs";

class Utilities {
  getJson = (jsonFile: string) => {
    const content = JSON.parse(
      readFileSync(jsonFile, {
        encoding: "utf-8",
        flag: "r",
      }),
    );

    return content;
  };
}
export const utilities = new Utilities();
