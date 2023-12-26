/**
 * Copyright 2023 Jackson Bicalho.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CONFIG_NAME_DEFAULT } from "./constants";

type ConfigValue<T> = {
  default: T;
  fnConfig: (val: T) => unknown;
};

type ConfigT<T> = {
  [K in keyof T]: ConfigValue<T[K]>;
};

function asConfig<T>(config: ConfigT<T>): ConfigT<T> {
  return config;
}

let ConfigType = asConfig({});

type configType = typeof ConfigType;

/* eslint-disable @typescript-eslint/no-this-alias */
export class CustomConfig {
  private default: configType = {
    name: CONFIG_NAME_DEFAULT,
  };

  constructor(protected CustomConfigType: configType = ConfigType) {
    ConfigType = asConfig(this.CustomConfigType);
  }

  getConfig = (key?: string): configType => {
    if (key) {
      if (Object.prototype.hasOwnProperty.call(this.default, key)) {
        // @ts-expect-error: Unreachable code error
        return this.default[key];
      }
    }

    return this.default;
  };

  configure = (config: configType) => {
    const currenConfig = this.default;
    this.default = {
      ...currenConfig,
      ...config,
    };
    ConfigType = asConfig(this.default);
    return this;
  };

  // eslint-disable @typescript-eslint/no-fallthrough
  execute = async (name: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const fnConfig: Function = this.default[name as never];
    return await fnConfig();
  };
}
