import type {
  WebpackConfiguration as WebpackConfigurationBase,
  StorybookConfig as StorybookConfigBase,
  TypescriptOptions as TypescriptOptionsBase,
} from '@storybook/core-webpack';
import type { PluginOptions as ReactDocgenTypescriptOptions } from '@storybook/react-docgen-typescript-plugin';

export type { BuilderResult } from '@storybook/core-webpack';

export type TypescriptOptions = TypescriptOptionsBase & {
  /**
   * Sets the type of Docgen when working with React and TypeScript
   *
   * @default `'react-docgen-typescript'`
   */
  reactDocgen: 'react-docgen-typescript' | 'react-docgen' | false;
  /**
   * Configures `react-docgen-typescript-plugin`
   *
   * @default
   * @see https://github.com/storybookjs/storybook/blob/next/code/builders/builder-webpack5/src/config/defaults.js#L4-L6
   */
  reactDocgenTypescriptOptions: ReactDocgenTypescriptOptions;
};
export type StorybookConfig<TWebpackConfiguration = WebpackConfigurationBase> =
  StorybookConfigBase<TWebpackConfiguration> & {
    typescript?: Partial<TypescriptOptions>;
  };
