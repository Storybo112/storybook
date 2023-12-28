import { defineConfig, mergeConfig } from 'vitest/config';
import { sep, posix } from 'path';
import { vitestCommonConfig } from '../../vitest.workspace';

export default mergeConfig(
  vitestCommonConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      name: __dirname.split(sep).slice(-2).join(posix.sep),
    },
    resolve: {
      alias: {
        'estree-walker': 'estree-walker/src',
        'is-reference': 'is-reference/src',
      },
    },
  })
);
