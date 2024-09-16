import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { GlobalRegistrator } from '@happy-dom/global-registrator';

import { dedent, esbuild, getWorkspace, prettier } from '../../../../scripts/prepare/tools';
import { temporaryFile } from '../../src/common/utils/cli';

GlobalRegistrator.register({ url: 'http://localhost:3000', width: 1920, height: 1080 });

// read code/frameworks subfolders and generate a list of available frameworks
// save this list into ./code/core/src/types/frameworks.ts and export it as a union type.
// The name of the type is `SupportedFrameworks`. Add additionally 'qwik' and `solid` to that list.
export const generateSourceFiles = async () => {
  const location = join(__dirname, '..', '..', 'src');
  const prettierConfig = await prettier.resolveConfig(location);

  await Promise.all([
    //
    generateFrameworksFile(prettierConfig),
    generateVersionsFile(prettierConfig),
    generateExportsFile(prettierConfig),
  ]);
};

async function generateVersionsFile(prettierConfig: prettier.Options | null): Promise<void> {
  const location = join(__dirname, '..', '..', 'src', 'common', 'versions.ts');

  const workspace = await getWorkspace();

  const versions = JSON.stringify(
    workspace
      .sort((a, b) => a.path.localeCompare(b.path))
      .reduce<Record<string, string>>((acc, i) => {
        if (i.publishConfig && i.publishConfig.access === 'public') {
          acc[i.name] = i.version;
        }
        return acc;
      }, {})
  );

  await writeFile(
    location,
    await prettier.format(
      dedent`
        // auto generated file, do not edit
        export default ${versions};
      `,
      {
        ...prettierConfig,
        parser: 'typescript',
      }
    )
  );
}

async function generateFrameworksFile(prettierConfig: prettier.Options | null): Promise<void> {
  const thirdPartyFrameworks = ['qwik', 'solid', 'nuxt', 'react-rsbuild', 'vue3-rsbuild'];
  const location = join(__dirname, '..', '..', 'src', 'types', 'modules', 'frameworks.ts');
  const frameworksDirectory = join(__dirname, '..', '..', '..', 'frameworks');

  const readFrameworks = await readdir(frameworksDirectory);
  const frameworks = [...readFrameworks.sort(), ...thirdPartyFrameworks]
    .map((framework) => `'${framework}'`)
    .join(' | ');

  await writeFile(
    location,
    await prettier.format(
      dedent`
        // auto generated file, do not edit
        export type SupportedFrameworks = ${frameworks};
      `,
      {
        ...prettierConfig,
        parser: 'typescript',
      }
    )
  );
}

const localAlias = {
  '@storybook/core': join(__dirname, '..', '..', 'src'),
  storybook: join(__dirname, '..', '..', 'src'),
};
async function generateExportsFile(prettierConfig: prettier.Options | null): Promise<void> {
  function removeDefault(input: string) {
    return input !== 'default';
  }

  const location = join(__dirname, '..', '..', 'src', 'manager', 'globals', 'exports.ts');

  const entryFile = join(__dirname, '..', '..', 'src', 'manager', 'globals', 'runtime.ts');
  const outFile = await temporaryFile({ extension: 'js' });

  await esbuild.build({
    entryPoints: [entryFile],
    bundle: true,
    format: 'esm',
    drop: ['console'],
    outfile: outFile,
    alias: localAlias,
    legalComments: 'none',
    splitting: false,
    platform: 'browser',
    target: 'chrome100',
  });

  const { globalsNameValueMap: data } = await import(outFile);

  // loop over all values of the keys of the data object and remove the default key
  for (const key in data) {
    const value = data[key];
    if (typeof value === 'object') {
      data[key] = Object.keys(
        Object.fromEntries(Object.entries(value).filter(([k]) => removeDefault(k)))
      ).sort();
    }
  }

  await writeFile(
    location,
    await prettier.format(
      dedent`
      // this file is generated by sourcefiles.ts
      // this is done to prevent runtime dependencies from making it's way into the build/start script of the manager
      // the manager builder needs to know which dependencies are 'globalized' in the ui
      
      export default ${JSON.stringify(data)} as const;
    `,
      {
        ...prettierConfig,
        parser: 'typescript',
      }
    )
  );
}
