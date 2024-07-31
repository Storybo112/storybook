import { defu, defuArrayFn } from 'defu';

import { logger } from '@storybook/core/client-logger';

export default <TObj = any>(a: TObj, b: Partial<TObj> & any) => {
  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      return defuArrayFn(a, b);
    }

    logger.log(['the types mismatch, picking', a]);
    return a;
  }

  // TODO: Ask for what is prefered:
  // 1. type guard (safe at runtime, but potential performance slow-down)
  // 2. or type assertion (unsafe at runtime)
  return defu(a as object, b);
};
