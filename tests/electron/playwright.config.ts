/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { config as loadEnv } from 'dotenv';
loadEnv({ path: path.join(__dirname, '..', '..', '.env') });

import type { Config, PlaywrightTestOptions, PlaywrightWorkerOptions } from '@playwright/test';
import * as path from 'path';
import type { CoverageWorkerOptions } from '../config/coverageFixtures';

process.env.PWPAGE_IMPL = 'electron';

const outputDir = path.join(__dirname, '..', '..', 'test-results');
const testDir = path.join(__dirname, '..');
const config: Config<CoverageWorkerOptions & PlaywrightWorkerOptions & PlaywrightTestOptions> = {
  testDir,
  outputDir,
  timeout: 30000,
  globalTimeout: 5400000,
  workers: process.env.CI ? 1 : undefined,
  forbidOnly: !!process.env.CI,
  preserveOutput: process.env.CI ? 'failures-only' : 'always',
  retries: process.env.CI ? 3 : 0,
  reporter: process.env.CI ? [
    [ 'dot' ],
    [ 'json', { outputFile: path.join(outputDir, 'report.json') } ],
  ] : 'line',
  projects: [],
};

const metadata = {
  platform: process.platform,
  headful: true,
  browserName: 'electron',
  channel: undefined,
  mode: 'default',
  video: false,
};

config.projects.push({
  name: 'chromium',  // We use 'chromium' here to share screenshots with chromium.
  use: {
    browserName: 'chromium',
    coverageName: 'electron',
  },
  testDir: path.join(testDir, 'electron'),
  metadata,
});

config.projects.push({
  name: 'chromium',  // We use 'chromium' here to share screenshots with chromium.
  use: {
    browserName: 'chromium',
    coverageName: 'electron',
  },
  testDir: path.join(testDir, 'page'),
  metadata,
});

export default config;
