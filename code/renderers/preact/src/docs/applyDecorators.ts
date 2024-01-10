import { defaultDecorateStory } from '@storybook/preview-api';
import type { LegacyStoryFn, DecoratorFunction } from '@storybook/types';

import type { PreactRenderer } from '../types';
import { jsxDecorator } from './jsxDecorator';

export const applyDecorators = (
  storyFn: LegacyStoryFn<PreactRenderer>,
  decorators: DecoratorFunction<PreactRenderer>[]
): LegacyStoryFn<PreactRenderer> => {
  // @ts-expect-error originalFn is not defined on the type for decorator. This is a temporary fix
  // that we will remove soon (likely) in favour of a proper concept of "inner" decorators.
  const jsxIndex = decorators.findIndex((d) => d.originalFn === jsxDecorator);

  const reorderedDecorators =
    jsxIndex === -1 ? decorators : [...decorators.splice(jsxIndex, 1), ...decorators];

  return defaultDecorateStory(storyFn, reorderedDecorators);
};
