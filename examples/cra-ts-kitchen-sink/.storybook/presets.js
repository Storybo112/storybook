const path = require('path');

module.exports = [
  {
    name: '@storybook/preset-create-react-app',
    options: {
      tsDocgenLoaderOptions: {
        tsconfigPath: path.resolve(__dirname, '../tsconfig.json'),
        shouldExtractLiteralValuesFromEnum: true,
        propFilter: prop => {
          if (prop.parent) {
            return !prop.parent.fileName.includes('node_modules/@types/react/');
          }

          return true;
        },
      },
    },
  },
  '@storybook/addon-docs/react/preset',
];
