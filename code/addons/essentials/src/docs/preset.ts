import { dirname, join } from 'path';

export * from '@storybook/addon-docs/dist/preset';

export const mdxLoaderOptions = async (config: any) => {
  config.mdxCompileOptions.providerImportSource = join(
    dirname(require.resolve('@storybook/addon-docs/package.json')),
    '/dist/shims/mdx-react-shim'
  );
  return config;
};
