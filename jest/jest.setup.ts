/**
 * Copyright 2023 Jackson Bicalho.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fetchMock from 'jest-fetch-mock'
import * as dotenv from 'dotenv'
dotenv.config({ path: './.env' })

// adds the 'fetchMock' global variable and rewires 'fetch' global to call 'fetchMock' instead of the real implementation
fetchMock.enableMocks()
// changes default behavior of fetchMock to use the real 'fetch' implementation and not mock responses
fetchMock.dontMock()
