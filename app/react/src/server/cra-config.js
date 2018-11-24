import fs from 'fs';
import path from 'path';
import semver from 'semver';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { normalizeCondition } from 'webpack/lib/RuleSet';

const cssExtensions = ['.css', '.scss', '.sass'];
const cssModuleExtensions = ['.module.css', '.module.scss', '.module.sass'];
const typeScriptExtensions = ['.ts', '.tsx'];

let reactScriptsPath;
export function getReactScriptsPath({ noCache } = {}) {
  if (reactScriptsPath && !noCache) return reactScriptsPath;
  const appDirectory = fs.realpathSync(process.cwd());
  const reactScriptsScriptPath = fs.realpathSync(
    path.join(appDirectory, '/node_modules/.bin/react-scripts')
  );
  reactScriptsPath = path.join(reactScriptsScriptPath, '../..');
  return reactScriptsPath;
}

export function isReactScriptsInstalled(requiredVersion = '2.0.0') {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const reactScriptsJson = require(path.join(getReactScriptsPath(), 'package.json'));
    if (semver.lt(reactScriptsJson.version, requiredVersion)) return false;
    return true;
  } catch (e) {
    return false;
  }
}

export const getRules = extensions => rules =>
  rules.reduce((craRules, rule) => {
    // If at least one style extension satisfies the rule test, the rule is one
    // we want to extract
    if (rule.test && extensions.some(normalizeCondition(rule.test))) {
      // If the base test is for styles, return early
      return craRules.concat(rule);
    }

    //  Get any style rules contained in rule.oneOf
    if (!rule.test && rule.oneOf) {
      craRules.push(...getRules(extensions)(rule.oneOf));
    }

    // Get any style rules contained in rule.rules
    if (!rule.test && rule.rules) {
      craRules.push(...getRules(extensions)(rule.rules));
    }

    return craRules;
  }, []);

const getStyleRules = getRules(cssExtensions.concat(cssModuleExtensions));
const getTypeScriptRules = getRules(typeScriptExtensions);

export function getCraWebpackConfig(mode) {
  if (mode === 'production') {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(path.join(getReactScriptsPath(), 'config/webpack.config.prod'));
  }

  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(path.join(getReactScriptsPath(), 'config/webpack.config.dev'));
}

export function applyCRAWebpackConfig(baseConfig) {
  // Check if the user can use TypeScript (react-scripts version 2.1+).
  const hasTsSupport = isReactScriptsInstalled('2.1.0');

  const tsExtensions = hasTsSupport ? typeScriptExtensions : [];
  const extensions = [...cssExtensions, ...tsExtensions];

  // Remove any rules from baseConfig that test true for any one of the extensions
  const filteredBaseRules = baseConfig.module.rules.filter(
    rule => !rule.test || !extensions.some(normalizeCondition(rule.test))
  );

  //  Load create-react-app config
  const craWebpackConfig = getCraWebpackConfig(baseConfig.mode);

  const craStyleRules = getStyleRules(craWebpackConfig.module.rules);
  const craTypeScriptRules = hasTsSupport ? getTypeScriptRules(craWebpackConfig.module.rules) : [];

  //  Add css minification for production
  const plugins = [...baseConfig.plugins];
  if (baseConfig.mode === 'production') {
    plugins.push(new MiniCssExtractPlugin());
  }

  return {
    ...baseConfig,
    module: {
      ...baseConfig.module,
      rules: [...filteredBaseRules, ...craStyleRules, ...craTypeScriptRules],
    },
    plugins,
    resolve: {
      ...baseConfig.resolve,
      extensions: [...baseConfig.resolve.extensions, ...tsExtensions],
    },
  };
}
