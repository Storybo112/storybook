import React from 'react';
import { ThemeProvider, withTheme } from 'emotion-theming';
import { storiesOf, configure, addDecorator, addParameters } from '@storybook/react';

import { themes } from '@storybook/components';
import { Global } from '@emotion/core';

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { withCssResources } from '@storybook/addon-cssresources';
import { withA11Y } from '@storybook/addon-a11y';
import { withNotes } from '@storybook/addon-notes';

import 'react-chromatic/storybook-addon';

import addHeadWarning from './head-warning';
import extraViewports from './extra-viewports.json';

if (process.env.NODE_ENV === 'development') {
  if (!process.env.DOTENV_DEVELOPMENT_DISPLAY_WARNING) {
    addHeadWarning('dotenv-env', 'Dotenv development file not loaded');
  }

  if (!process.env.STORYBOOK_DISPLAY_WARNING) {
    addHeadWarning('env-glob', 'Global storybook env var not loaded');
  }

  if (process.env.DISPLAY_WARNING) {
    addHeadWarning('env-extra', 'Global non-storybook env var loaded');
  }
}

addHeadWarning('preview-head-not-loaded', 'Preview head not loaded');
addHeadWarning('dotenv-file-not-loaded', 'Dotenv file not loaded');

addDecorator(withCssResources);
addDecorator(withA11Y);
addDecorator(withNotes);

const Reset = withTheme(({ theme }) => (
  <Global
    styles={{
      body: {
        fontFamily: theme.mainTextFace,
        color: theme.mainTextColor,
        WebkitFontSmoothing: 'antialiased',
        fontSize: theme.mainTextSize,
      },
    }}
  />
));

addDecorator(fn => (
  <ThemeProvider theme={themes.normal}>
    <Reset />
    {fn()}
  </ThemeProvider>
));

addParameters({
  a11y: {},
  options: {
    name: 'Storybook',
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: '|',
    // theme: themes.dark,
  },
  viewports: {
    ...INITIAL_VIEWPORTS,
    ...extraViewports,
  },
});

let previousExports = {};
if (module && module.hot && module.hot.dispose) {
  ({ previousExports = {} } = module.hot.data || {});

  module.hot.dispose(data => {
    // eslint-disable-next-line no-param-reassign
    data.previousExports = previousExports;
  });
}

// The simplest version of examples would just export this function for users to use
function importAll(context) {
  const storyStore = window.__STORYBOOK_CLIENT_API__._storyStore; // eslint-disable-line no-undef, no-underscore-dangle

  context.keys().forEach(filename => {
    const fileExports = context(filename);

    // A old-style story file
    if (!fileExports.default) {
      return;
    }

    const { default: component, ...examples } = fileExports;
    let componentOptions = component;
    if (component.prototype && component.prototype.isReactComponent) {
      componentOptions = { component };
    }
    const kindName = componentOptions.title || componentOptions.component.displayName;

    if (previousExports[filename]) {
      if (previousExports[filename] === fileExports) {
        return;
      }

      // Otherwise clear this kind
      storyStore.removeStoryKind(kindName);
      storyStore.incrementRevision();
    }

    // We pass true here to avoid the warning about HMR. It's cool clientApi, we got this
    const kind = storiesOf(kindName, true);

    (componentOptions.decorators || []).forEach(decorator => {
      kind.addDecorator(decorator);
    });
    if (componentOptions.parameters) {
      kind.addParameters(componentOptions.parameters);
    }

    Object.keys(examples).forEach(key => {
      const example = examples[key];
      const { title = key, parameters } = example;
      kind.add(title, example, parameters);
    });

    previousExports[filename] = fileExports;
  });
}

function loadStories() {
  let req;
  req = require.context('../../lib/ui/src', true, /\.stories\.js$/);
  importAll(req);

  req = require.context('../../lib/components/src', true, /\.stories\.js$/);
  importAll(req);

  req = require.context('./stories', true, /\.stories\.js$/);
  importAll(req);
}

configure(loadStories, module);
