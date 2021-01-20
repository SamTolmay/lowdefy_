/*
  Copyright 2020-2021 Lowdefy, Inc

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

import writeConnections from './writeConnections';
import testContext from '../test/testContext';

const mockSet = jest.fn();

const artifactSetter = {
  set: mockSet,
};

const context = testContext({ artifactSetter });

beforeEach(() => {
  mockSet.mockReset();
});

test('writeConnections write connection', async () => {
  const components = {
    connections: [
      {
        id: 'connection:connection1',
        connectionId: 'connection1',
        properties: {
          prop: 'val',
        },
      },
    ],
  };
  await writeConnections({ components, context });
  expect(mockSet.mock.calls).toEqual([
    [
      {
        filePath: 'connections/connection1.json',
        content: `{
  "id": "connection:connection1",
  "connectionId": "connection1",
  "properties": {
    "prop": "val"
  }
}`,
      },
    ],
  ]);
});

test('writeConnections multiple connection', async () => {
  const components = {
    connections: [
      {
        id: 'connection:connection1',
        connectionId: 'connection1',
      },
      {
        id: 'connection:connection2',
        connectionId: 'connection2',
      },
    ],
  };
  await writeConnections({ components, context });
  expect(mockSet.mock.calls).toEqual([
    [
      {
        filePath: 'connections/connection1.json',
        content: `{
  "id": "connection:connection1",
  "connectionId": "connection1"
}`,
      },
    ],
    [
      {
        filePath: 'connections/connection2.json',
        content: `{
  "id": "connection:connection2",
  "connectionId": "connection2"
}`,
      },
    ],
  ]);
});

test('writeConnections no connections', async () => {
  const components = {
    connections: [],
  };
  await writeConnections({ components, context });
  expect(mockSet.mock.calls).toEqual([]);
});

test('writeConnections connections undefined', async () => {
  const components = {};
  await writeConnections({ components, context });
  expect(mockSet.mock.calls).toEqual([]);
});

test('writeConnections connections not an array', async () => {
  const components = {
    connections: 'connections',
  };
  await expect(writeConnections({ components, context })).rejects.toThrow(
    'Connections is not an array.'
  );
});
