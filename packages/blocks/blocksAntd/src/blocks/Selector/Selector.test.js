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

import { runBlockSchemaTests, runRenderTests } from '@lowdefy/block-dev';

import validationsExamples from '../demo/validationExamples.json';
import Selector from '../src/blocks/Selector/Selector';
import examples from '../demo/examples/Selector.yaml';
import meta from '../src/blocks/Selector/Selector.json';

runRenderTests({ examples, Block: Selector, meta, validationsExamples });
runBlockSchemaTests({ examples, meta });
