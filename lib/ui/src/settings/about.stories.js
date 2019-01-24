import React from 'react';
import { storiesOf } from '@storybook/react';
import AboutScreen from './about';

const info = {
  plain: `- upgrade webpack & babel to latest\n- new addParameters and third argument to .add to pass data to addons\n- added the ability to theme storybook\n- improved ui for mobile devices\n- improved performance of addon-knobs`,
};

storiesOf('UI|AboutPage', module)
  .add('up to date', () => (
    <AboutScreen latest={{ version: '5.0.0', info }} current={{ version: '5.0.0' }} />
  ))
  .add('new version required', () => (
    <AboutScreen latest={{ version: '5.0.3', info }} current={{ version: '5.0.0' }} />
  ))
  .add('failed to fetch new version', () => <AboutScreen current={{ version: '5.0.0' }} />);
