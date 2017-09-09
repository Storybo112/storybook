import mergeDirs from 'merge-dirs';
import path from 'path';
import latestVersion from 'latest-version';
import { getPackageJson, writePackageJson } from '../../lib/helpers';

export default Promise.all([
  latestVersion('@storybook/react-native'),
  latestVersion('@storybook/addon-actions'),
  latestVersion('@storybook/addon-links'),
  latestVersion('prop-types'),
]).then(([storybookVersion, actionsVersion, linksVersion, propTypesVersion]) => {
  // copy all files from the template directory to project directory
  mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

  const packageJson = getPackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.devDependencies['@storybook/react-native'] = `^${storybookVersion}`;
  packageJson.devDependencies['@storybook/addon-actions'] = `^${actionsVersion}`;
  packageJson.devDependencies['@storybook/addon-links'] = `^${linksVersion}`;

  if (!packageJson.dependencies['react-dom'] && !packageJson.devDependencies['react-dom']) {
    const reactVersion = packageJson.dependencies.react;
    packageJson.devDependencies['react-dom'] = reactVersion;
  }

  if (!packageJson.dependencies['prop-types'] && !packageJson.devDependencies['prop-types']) {
    packageJson.devDependencies['prop-types'] = `^${propTypesVersion}`;
  }

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'storybook start -p 7007';

  writePackageJson(packageJson);
});
