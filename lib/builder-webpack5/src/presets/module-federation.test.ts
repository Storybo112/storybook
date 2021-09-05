import webpack from 'webpack';
import type { Configuration, EntryObject } from 'webpack';
import { logger } from '@storybook/node-logger';
import WebpackVirtualModules from 'webpack-virtual-modules';
import { checkForModuleFederation, enableModuleFederation } from './module-federation';

jest.mock(
  '@storybook/node-logger',
  () => ({
    logger: {
      info: jest.fn(),
    },
  }),
  { virtual: true }
);
jest.mock('webpack-virtual-modules');

let mockConfig: Configuration;

describe('module-federation', () => {
  describe('checkForModuleFederation', () => {
    it.each([
      [{}, false],
      [{ plugins: [] }, false],
      [{ plugins: [new webpack.container.ModuleFederationPlugin({})] }, true],
    ])('should find use of plugin', (config, result) => {
      expect(checkForModuleFederation(config)).toEqual(result);
    });
  });

  describe('enableModuleFederation', () => {
    beforeEach(() => {
      jest.clearAllMocks();

      mockConfig = {
        entry: 'file.js',
        plugins: [],
      };
    });

    it.each([
      [{}, undefined, 0],
      [{ optimization: {} }, undefined, 0],
      [
        {
          optimization: {
            runtimeChunk: false,
          },
        },
        false,
        0,
      ],
      [
        {
          optimization: {
            runtimeChunk: true,
          },
        },
        false,
        1,
      ],
      [
        {
          optimization: {
            runtimeChunk: 'single' as 'single',
          },
        },
        false,
        1,
      ],
    ])('should turn off "runtimeCheck" optimization', async (config, result, logs) => {
      Object.assign(mockConfig, config);

      const actualConfig = await enableModuleFederation(mockConfig);

      expect(actualConfig.optimization?.runtimeChunk).toEqual(result);

      expect(logger.info).toHaveBeenCalledTimes(1 + logs);
    });

    it.each([
      [undefined, undefined, 0],
      ['./path', './path', 0],
      ['/path', '/path', 0],
      ['http://host', 'http://host', 0],
      ['', undefined, 1],
    ])(
      'should set publicPath to "undefined" if empty string',
      async (publicPath, expected, logs) => {
        mockConfig.output = {
          publicPath,
        };

        const actualConfig = await enableModuleFederation(mockConfig);

        expect(actualConfig.output.publicPath).toEqual(expected);

        expect(logger.info).toHaveBeenCalledTimes(1 + logs);
      }
    );

    it.each([
      [
        'file.js',
        { main: './__entry_main.js' },
        {
          './__entry_main.js': "import('./__bootstrap_main.js');",
          './__bootstrap_main.js': "import 'file.js';",
        },
      ],
      [
        ['file.js'],
        { main: './__entry_main.js' },
        {
          './__entry_main.js': "import('./__bootstrap_main.js');",
          './__bootstrap_main.js': "import 'file.js';",
        },
      ],
      [
        ['file.js', 'other.js'],
        { main: './__entry_main.js' },
        {
          './__entry_main.js': "import('./__bootstrap_main.js');",
          './__bootstrap_main.js': "import 'file.js';\nimport 'other.js';",
        },
      ],
      [
        { someKey: 'file.js' },
        { someKey: './__entry_someKey.js' },
        {
          './__entry_someKey.js': "import('./__bootstrap_someKey.js');",
          './__bootstrap_someKey.js': "import 'file.js';",
        },
      ],
      [
        { someKey: ['file.js'] },
        { someKey: './__entry_someKey.js' },
        {
          './__entry_someKey.js': "import('./__bootstrap_someKey.js');",
          './__bootstrap_someKey.js': "import 'file.js';",
        },
      ],
      [
        { someKey: ['file.js', 'other.js'] },
        { someKey: './__entry_someKey.js' },
        {
          './__entry_someKey.js': "import('./__bootstrap_someKey.js');",
          './__bootstrap_someKey.js': "import 'file.js';\nimport 'other.js';",
        },
      ],
      [
        { someKey: 'file.js', otherKey: 'other.js' },
        { someKey: './__entry_someKey.js', otherKey: './__entry_otherKey.js' },
        {
          './__entry_someKey.js': "import('./__bootstrap_someKey.js');",
          './__entry_otherKey.js': "import('./__bootstrap_otherKey.js');",
          './__bootstrap_someKey.js': "import 'file.js';",
          './__bootstrap_otherKey.js': "import 'other.js';",
        },
      ],
      [
        { someKey: ['file.js'], otherKey: ['other.js'] },
        { someKey: './__entry_someKey.js', otherKey: './__entry_otherKey.js' },
        {
          './__entry_someKey.js': "import('./__bootstrap_someKey.js');",
          './__entry_otherKey.js': "import('./__bootstrap_otherKey.js');",
          './__bootstrap_someKey.js': "import 'file.js';",
          './__bootstrap_otherKey.js': "import 'other.js';",
        },
      ],
      [
        { someKey: ['file.js', 'other.js'], otherKey: ['some.js', 'added.js'] },
        { someKey: './__entry_someKey.js', otherKey: './__entry_otherKey.js' },
        {
          './__entry_someKey.js': "import('./__bootstrap_someKey.js');",
          './__entry_otherKey.js': "import('./__bootstrap_otherKey.js');",
          './__bootstrap_someKey.js': "import 'file.js';\nimport 'other.js';",
          './__bootstrap_otherKey.js': "import 'some.js';\nimport 'added.js';",
        },
      ],
      [
        { main: { import: 'file.js', filename: 'foobar.js' } },
        { main: { import: './__entry_main.js', filename: 'foobar.js' } },
        {
          './__entry_main.js': "import('./__bootstrap_main.js');",
          './__bootstrap_main.js': "import 'file.js';",
        },
      ],
      [
        { main: { import: ['file.js'], filename: 'foobar.js' } },
        { main: { import: './__entry_main.js', filename: 'foobar.js' } },
        {
          './__entry_main.js': "import('./__bootstrap_main.js');",
          './__bootstrap_main.js': "import 'file.js';",
        },
      ],
      [
        { main: { import: ['file.js', 'other.js'], filename: 'foobar.js' } },
        { main: { import: './__entry_main.js', filename: 'foobar.js' } },
        {
          './__entry_main.js': "import('./__bootstrap_main.js');",
          './__bootstrap_main.js': "import 'file.js';\nimport 'other.js';",
        },
      ],
      [
        () => 'file.js',
        { main: './__entry_main.js' },
        {
          './__entry_main.js': "import('./__bootstrap_main.js');",
          './__bootstrap_main.js': "import 'file.js';",
        },
      ],
      [
        () => ['file.js'],
        { main: './__entry_main.js' },
        {
          './__entry_main.js': "import('./__bootstrap_main.js');",
          './__bootstrap_main.js': "import 'file.js';",
        },
      ],
      [
        () => ['file.js', 'other.js'],
        { main: './__entry_main.js' },
        {
          './__entry_main.js': "import('./__bootstrap_main.js');",
          './__bootstrap_main.js': "import 'file.js';\nimport 'other.js';",
        },
      ],
      [
        () => ({
          single: 'file.js',
          array: ['file.js', 'other.js'],
          description: {
            import: ['file.js', 'other.js'],
            filename: 'desc.js',
          },
        }),
        {
          single: './__entry_single.js',
          array: './__entry_array.js',
          description: {
            filename: 'desc.js',
            import: './__entry_description.js',
          },
        },
        {
          './__entry_single.js': "import('./__bootstrap_single.js');",
          './__entry_array.js': "import('./__bootstrap_array.js');",
          './__entry_description.js': "import('./__bootstrap_description.js');",
          './__bootstrap_single.js': "import 'file.js';",
          './__bootstrap_array.js': "import 'file.js';\nimport 'other.js';",
          './__bootstrap_description.js': "import 'file.js';\nimport 'other.js';",
        },
      ],
    ])('should set up entries correctly', async (entryInput, entryOutput, virtualModules) => {
      mockConfig.entry = entryInput;

      const actual = await enableModuleFederation(mockConfig);

      expect(actual.entry).toEqual(entryOutput);

      expect(WebpackVirtualModules).toHaveBeenCalledTimes(1);
      expect(WebpackVirtualModules).toHaveBeenNthCalledWith(1, virtualModules);
    });
  });
});
