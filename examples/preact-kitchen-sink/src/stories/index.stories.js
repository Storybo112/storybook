/** @jsx h */

import { h } from 'preact';

import { storiesOf } from '@storybook/preact';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Welcome from '../Welcome';
import Button from '../Button';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onclick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onclick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));
