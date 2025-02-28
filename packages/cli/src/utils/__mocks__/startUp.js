/*
  Copyright 2020-2023 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

const mockStartUp = jest.fn().mockImplementation(mockStartUpImp);

async function mockStartUpImp({ context, options = {} }) {
  context.command = 'test';
  context.cliVersion = 'cliVersion';
  context.commandLineOptions = options;

  context.print = {
    info: jest.fn(),
    succeed: jest.fn(),
    log: jest.fn(),
  };

  context.configDirectory = options.configDirectory || 'configDirectory';

  context.cliConfig = {};
  context.lowdefyVersion = 'lowdefyVersion';

  context.appId = 'appId';
  context.options = options;

  context.cacheDirectory = `${context.configDirectory}/cacheDirectory`;
  context.buildDirectory = `${context.configDirectory}/buildDirectory`;

  context.sendTelemetry = jest.fn();

  return context;
}

export default mockStartUp;
