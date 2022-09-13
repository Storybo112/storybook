import type { Meta, StoryFn } from '@storybook/angular';
import { Welcome } from './angular-demo';

export default {
  title: 'Welcome/ To Storybook',
} as Meta;

export const ToStorybook: StoryFn = () => ({
  component: Welcome,
  props: {
    showApp: () => {},
  },
});
