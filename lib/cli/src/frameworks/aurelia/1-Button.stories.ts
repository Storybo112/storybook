import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Button from './button';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    text: { control: 'text' },
  },
};

const ButtonStory = (args) => ({
  component: Button,
  props: args,
});

export const Text = ButtonStory.bind({});
Text.args = {
  text: 'Button',
  onClick: action('onClick'),
};

export const Emoji = ButtonStory.bind({});
Emoji.args = {
  text: '😀 😎 👍 💯',
};

export const TextWithAction = () => ({
  component: Button,
  props: {
    text: 'Trigger Action',
    onClick: () => action('This was clicked')(),
  },
});

TextWithAction.storyName = 'With an action';
TextWithAction.parameters = { notes: 'My notes on a button with emojis' };

export const ButtonWithLinkToAnotherStory = () => ({
  component: Button,
  props: {
    text: 'Go to Welcome Story',
    onClick: linkTo('Welcome'),
  },
});

ButtonWithLinkToAnotherStory.storyName = 'button with link to another story';
