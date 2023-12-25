/**
 * Copyright 2023 Jackson Bicalho.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

interface ConfigValue<T> {
  default: T;
  fn: (val: T) => any;
}

type ConfigT<T> = {
  [K in keyof T]: ConfigValue<T[K]>;
};

export function asConfig<T>(config: ConfigT<T>): ConfigT<T> {
  return config;
}

const ConfigType = asConfig({});

type configType = typeof ConfigType;

export class Config {
  private default: configType = {};

  getConfig = (key?: string): typeof this.default => {
    if (key) {
      if (this.default.hasOwnProperty(key)) {
        // @ts-ignore: Unreachable code error
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
    return this;
  };

  getType = (): typeof this.default => {
    return typeof this.default;
  };

  toJSON = (): typeof this.default => {
    return JSON.parse(JSON.stringify(this.default));
  };

  run = async (name: string) => {
    const fn: Function = this.default[name as never];
    if (typeof fn === "function") {
      await fn();
    }
    return this;
  };
}
