import deprecate from 'util-deprecate';
import addons from '@storybook/addons';
import { WithNotes as ReactWithNotes } from './react';

export const withNotes = notes => {
  const channel = addons.getChannel();
  // send the notes to the channel before the story is rendered
  channel.emit('storybook/notes/add_notes', notes);
};

Object.defineProperty(exports, 'WithNotes', {
  configurable: true,
  enumerable: true,
  get: deprecate(
    () => ReactWithNotes,
    '@storybook/addon-notes WithNotes Component is deprecated, use withNotes() instead. See https://github.com/storybooks/storybook/tree/master/addons/notes'
  ),
});
