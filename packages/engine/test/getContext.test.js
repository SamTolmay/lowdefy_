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

import getContext from '../src/getContext';

const updateBlock = () => jest.fn();
const pageId = 'pageId';
const client = {};

test('block is required input', async () => {
  const rootContext = {
    client,
    contexts: {},
    input: {},
    updateBlock,
  };
  await expect(getContext({ contextId: 'c1', pageId, rootContext })).rejects.toThrow(
    'A block must be provided to get context.'
  );
});

test('memoize context', async () => {
  const rootContext = {
    client,
    contexts: {},
    input: {},
    updateBlock,
  };
  const block = {
    blockId: 'blockId',
    meta: {
      type: 'context',
    },
  };
  const c1 = await getContext({ block, contextId: 'c1', pageId, rootContext });
  const c2 = await getContext({ block, contextId: 'c1', pageId, rootContext });
  expect(c1).toBe(c2);
});

test('create context', async () => {
  const rootContext = {
    client: { client: true },
    contexts: {},
    document: { document: true },
    input: { contextId: { input: true } },
    lowdefyGlobal: { lowdefyGlobal: true },
    menus: [{ id: 'default' }],
    routeHistory: ['routeHistory'],
    updateBlock,
    urlQuery: { urlQuery: true },
    window: { window: true },
  };
  const block = {
    blockId: 'blockId',
    meta: {
      type: 'context',
    },
  };
  const context = await getContext({ block, contextId: 'contextId', pageId, rootContext });
  expect(context.Actions).toBeDefined();
  expect(context.Requests).toBeDefined();
  expect(context.RootBlocks).toBeDefined();
  expect(context.State).toBeDefined();
  expect(context.blockId).toEqual('blockId');
  expect(context.root).toEqual(rootContext);
  expect(context.eventLog).toEqual([]);
  expect(context.id).toEqual('contextId');
  expect(context.pageId).toEqual('pageId');
  expect(context.parser).toBeDefined();
  expect(context.requests).toEqual({});
  expect(context.rootBlock).toBeDefined();
  expect(context.showValidationErrors).toEqual(false);
  expect(context.state).toEqual({});
  expect(context.update).toBeDefined();
  expect(context.updateListeners).toEqual(new Set());
});

test('create context, initialize input', async () => {
  const rootContext = {
    client: { client: true },
    contexts: {},
    document: { document: true },
    input: {},
    lowdefyGlobal: { lowdefyGlobal: true },
    menus: [{ id: 'default' }],
    routeHistory: ['routeHistory'],
    updateBlock,
    urlQuery: { urlQuery: true },
    window: { window: true },
  };
  const block = {
    blockId: 'blockId',
    meta: {
      type: 'context',
    },
  };
  const context = await getContext({ block, contextId: 'contextId', pageId, rootContext });
  expect(context.root.input.contextId).toEqual({});
});

test('call update for listening contexts', async () => {
  const rootContext = {
    client,
    contexts: {},
    input: {},
    updateBlock,
  };
  const block1 = {
    blockId: 'block1',
    meta: {
      type: 'context',
    },
  };
  const block2 = {
    blockId: 'block2',
    meta: {
      type: 'context',
    },
  };
  const mockUpdate = jest.fn();
  const c1 = await getContext({ block: block1, contextId: 'c1', pageId, rootContext });
  const c2 = await getContext({ block: block2, contextId: 'c2', pageId, rootContext });
  c2.update = mockUpdate;
  c1.updateListeners.add('c2');
  c1.update();
  expect(mockUpdate.mock.calls.length).toBe(1);
});

test('remove contextId from updateListeners if not found', async () => {
  const rootContext = {
    client,
    contexts: {},
    input: {},
    updateBlock,
  };
  const block = {
    blockId: 'blockId',
    meta: {
      type: 'context',
    },
  };
  const c1 = await getContext({ block, contextId: 'c1', pageId, rootContext });

  c1.updateListeners.add('c2');
  expect(c1.updateListeners).toEqual(new Set(['c2']));
  c1.update();
  expect(c1.updateListeners).toEqual(new Set());
});

test('remove contextId from updateListeners if equal to own contextId', async () => {
  const rootContext = {
    client,
    contexts: {},
    input: {},
    updateBlock,
  };
  const block = {
    blockId: 'blockId',
    meta: {
      type: 'context',
    },
  };
  const c1 = await getContext({ block, contextId: 'c1', pageId, rootContext });

  c1.updateListeners.add('c1');
  expect(c1.updateListeners).toEqual(new Set(['c1']));
  c1.update();
  expect(c1.updateListeners).toEqual(new Set());
});

test('update memoized context', async () => {
  const rootContext = {
    client,
    contexts: {},
    input: {},
    updateBlock,
  };
  const block = {
    blockId: 'blockId',
    meta: {
      type: 'context',
    },
  };
  const mockUpdate = jest.fn();
  const c1 = await getContext({ block, contextId: 'c1', pageId, rootContext });
  c1.update = mockUpdate;
  await getContext({ block, contextId: 'c1', pageId, rootContext });
  expect(mockUpdate.mock.calls.length).toBe(1);
});

test('call update for nested contexts and prevent circular loop structure', async () => {
  const rootContext = {
    client,
    contexts: {},
    input: {},
    updateBlock,
  };
  const block2 = {
    blockId: 'block2',
    meta: {
      type: 'context',
    },
  };
  const block1 = {
    blockId: 'block1',
    meta: {
      type: 'context',
    },
    areas: {
      content: {
        blocks: block2,
      },
    },
  };
  const c1 = await getContext({ block: block1, contextId: 'c1', pageId, rootContext });
  const getC2 = () =>
    getContext({
      block: c1.RootBlocks.areas.root.blocks[0],
      contextId: 'c2',
      pageId,
      rootContext,
    });
  await expect(getC2()).resolves.not.toThrow();
});
