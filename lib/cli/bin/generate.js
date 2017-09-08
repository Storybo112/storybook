#!/usr/bin/env node

const updateNotifier = require('update-notifier');
const program = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const spawnSync = require('cross-spawn').sync;
const detect = require('../lib/detect');
const hasYarn = require('../lib/has_yarn');
const types = require('../lib/project_types');
const commandLog = require('../lib/helpers').commandLog;
const codeLog = require('../lib/helpers').codeLog;
const paddedLog = require('../lib/helpers').paddedLog;
const installDeps = require('../lib/helpers').installDeps;
const installGlobal = require('../lib/helpers').installGlobal;
const runCreator = require('../lib/helpers').runCreator;

const logger = console;

const pkg = require('../package.json');

program
  .version(pkg.version)
  .option('-f --force', 'Forcely add storybook')
  .option('-N --use-npm', 'Use npm to install deps')
  .option('-p --parser <babel | babylon | flow>', 'jscodeshift parser')
  .parse(process.argv);

const welcomeMessage = 'getstorybook - the simplest way to add a storybook to your project.';
logger.log(chalk.inverse(`\n ${welcomeMessage} \n`));

const useYarn = Boolean(program.useNpm !== true) && hasYarn();

const npmOptions = {
  useYarn,
};

const runStorybookCommand = useYarn ? 'yarn run storybook' : 'npm run storybook';

// Update notify code.
updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60, // every hour (we could increase this later on.)
}).notify();

let detectedType;

const done = commandLog('Detecting project type');
try {
  detectedType = detect({
    force: program.force,
  });
} catch (ex) {
  done(ex.message);
  process.exit(1);
}
done();

const CRNA_DISCUSSION =
  'https://github.com/storybooks/storybook/blob/master/app/react-native/docs/manual-setup.md';

(function runGenerator(projectType, childDirname) {
  const end = () => {
    installDeps(npmOptions);

    logger.log('\nTo run your storybook, type:\n');

    codeLog([childDirname && `cd ${childDirname}`, runStorybookCommand].filter(Boolean));
    logger.log('\nFor more information visit:', chalk.cyan('https://storybook.js.org'));

    // Add a new line for the clear visibility.
    logger.log();
  };

  switch (projectType) {
    case types.ALREADY_HAS_STORYBOOK:
      logger.log();
      paddedLog('There seems to be a storybook already available in this project.');
      paddedLog('Apply following command to force:\n');
      codeLog(['getstorybook -f']);

      // Add a new line for the clear visibility.
      logger.log();
      break;

    case types.UPDATE_PACKAGE_ORGANIZATIONS:
      // eslint-disable-next-line
      require('../generators/UPDATE_PACKAGE_ORGANIZATIONS')(program.parser)
        .then(() => null) // commmandLog doesn't like to see output
        .then(commandLog('Upgrading your project to the new storybook packages.'))
        .then(end);
      break;

    case types.REACT_SCRIPTS:
      // eslint-disable-next-line
      require('../generators/REACT_SCRIPTS')
        .then(commandLog('Adding storybook support to your "Create React App" based project'))
        .then(end);
      break;

    case types.REACT:
      // eslint-disable-next-line
      require('../generators/REACT')
        .then(commandLog('Adding storybook support to your "React" app'))
        .then(end);
      break;

    case types.REACT_NATIVE_SCRIPTS: {
      const app = chalk.bold('"./App.js"');
      // eslint-disable-next-line
      require('../generators/REACT_NATIVE_SCRIPTS')
        .then(commandLog('Adding storybook support to your "Create React Native App" app'))
        .then(end)
        .then(() => {
          logger.log(chalk.red('NOTE: CRNA app installation is not 100% automated.'));
          logger.log(`To quickly run storybook, replace contents of ${app} with:\n`);
          codeLog(["export default from './storybook';"]); // eslint-disable-line
          logger.log('\nFor a more complete discussion of options, see:\n');
          logger.log(chalk.cyan(CRNA_DISCUSSION));
          logger.log();
        });
      break;
    }

    case types.REACT_NATIVE:
      // eslint-disable-next-line
      require('../generators/REACT_NATIVE')
        .then(commandLog('Adding storybook support to your "React Native" app'))
        .then(end);
      break;

    case types.METEOR:
      // eslint-disable-next-line
      require('../generators/METEOR')
        .then(commandLog('Adding storybook support to your "Meteor" app'))
        .then(end);
      break;

    case types.WEBPACK_REACT:
      // eslint-disable-next-line
      require('../generators/WEBPACK_REACT')
        .then(commandLog('Adding storybook support to your "Webpack React" app'))
        .then(end);
      break;

    case types.REACT_PROJECT:
      // eslint-disable-next-line
      require('../generators/REACT')
        .then(commandLog('Adding storybook support to your "React" library'))
        .then(end);
      break;

    case types.SFC_VUE:
      // eslint-disable-next-line
      require('../generators/SFC_VUE')
        .then(commandLog('Adding storybook support to your "Single File Components Vue" app'))
        .then(end);
      break;

    case types.VUE:
      // eslint-disable-next-line
      require('../generators/VUE')
        .then(commandLog('Adding storybook support to your "Vue" app'))
        .then(end);
      break;

    default:
      paddedLog(`We couldn't detect your project type. (code: ${projectType})`);
      paddedLog(
        "Please make sure you are running the 'getstorybook' command in your project's root directory."
      );
      paddedLog(
        'You can also create a project using some of the options below, or follow one of the slow start guides: https://storybook.js.org/basics/slow-start-guide/'
      );
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'type',
            message:
              'Which kind of project boilerplate would you like to install and start? This will create a project in a new directory.',
            choices: [
              {
                name: 'React (Create React App)',
                value: types.REACT_SCRIPTS,
              },
              {
                name: 'React Native (Create React Native App)',
                value: types.REACT_NATIVE_SCRIPTS,
              },
              {
                name: 'Vue (vue-cli)',
                value: types.SFC_VUE,
              },
              {
                name: 'Setup the project manually',
                value: null,
              },
            ],
          },
          {
            type: 'input',
            name: 'vueTemplate',
            message:
              'Which project template would you like to use? See official templates list: https://github.com/vuejs/vue-cli#official-templates',
            default: 'webpack',
            when: ({ type }) => type === types.SFC_VUE,
          },
          {
            type: 'input',
            name: 'dirname',
            message: 'Enter a directory name for your project',
            default: 'my-project',
            when: ({ type }) => type !== null,
          },
        ])
        .then(options => {
          const { type, vueTemplate, dirname } = options;

          switch (type) {
            case types.REACT_SCRIPTS:
              return runCreator(npmOptions, 'react-app', dirname).then(() => options);
            case types.REACT_NATIVE_SCRIPTS:
              return runCreator(npmOptions, 'react-native-app', dirname).then(() => options);
            case types.SFC_VUE:
              return installGlobal(npmOptions, 'vue-cli')
                .then(() => {
                  spawnSync('vue', ['init', vueTemplate, dirname], { stdio: 'inherit' });
                })
                .then(() => options);
            default:
              return Promise.reject({
                optout: true,
                reason: 'Manual setup',
              });
          }
        })
        .then(({ type, dirname }) => {
          process.chdir(dirname);
          runGenerator(type, dirname);
        })
        .catch(e => {
          if (e.optout) {
            process.exit(0);
          } else {
            done(e.message);
            process.exit(1);
          }
        });
  }
})(detectedType);
