/**
 * Copyright 2023 Jackson Bicalho.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { coverageConfig } from './jest.coverage.config.json'
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
import type { JestConfigWithTsJest } from 'ts-jest'
import path from 'path'

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: path.resolve(__dirname, '..'),
  moduleFileExtensions: ['js', 'json', 'ts'],
  setupFiles: ['./jest/jest.setup.ts'],
  detectOpenHandles: true,
  cache: false,
  testPathIgnorePatterns: ["<rootDir>/packages/*/build", "<rootDir>/packages/*/examples/*"]
}

const args = process.argv.slice(2)
if (args.includes('--coverage')) {
  const coverage = JSON.parse(JSON.stringify(coverageConfig, null, 2))
  Object.assign(jestConfig, coverage)
}

export default jestConfig
