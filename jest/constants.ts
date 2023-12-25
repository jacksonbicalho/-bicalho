const SSLDEV_ERROR_TYPE_ERROR = "ssldev:error";
const SSLDEV_ERROR_TYPE_WARN = "ssldev:warn";
const SSLDEV_ERROR_TYPE_INFO = "ssldev:info";

const SSLDEV_BIN = "/.bin/ssldev";
const SSLDEV_COVERAGE_PATCH = "coverage";
const SSLDEV_PACKAGE_FILE_NAME = "package.json";

export const CONSTANTS = {
  SSLDEV_ERROR_TYPE_ERROR,
  SSLDEV_ERROR_TYPE_WARN,
  SSLDEV_ERROR_TYPE_INFO,
  ...Object.freeze({
    SSLDEV_BIN,
    SSLDEV_COVERAGE_PATCH,
    SSLDEV_PACKAGE_FILE_NAME
  })
};
