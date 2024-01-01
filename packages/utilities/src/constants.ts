import { resolve } from "path";

export const constants = {
  APP_ROOT: resolve(__dirname, "..", "..", ".."),
  ERROR_TYPE_ERROR: "error",
  ERROR_TYPE_WARN: "warn",
  ERROR_TYPE_INFO: "info",
  SCOPE: "@bicalho",
  DIR_BIN: "./build/bin/",
  PACKAGE_FILE_NAME: "package.json",
  TSCONFIG_JSON_ROOT: "tsconfig.json",
};
