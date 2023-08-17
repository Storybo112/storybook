import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button, Icon } from '@storybook/components/experimental';

import { DropdownMenu } from './DropdownMenu';

const meta: Meta<typeof DropdownMenu.Root> = {
  title: 'DropdownMenu',
  component: DropdownMenu.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof DropdownMenu.Root>;

export const Base: Story = {
  args: {},
  render: (_, { args }) => (
    <DropdownMenu.Root {...args}>
      <DropdownMenu.Trigger asChild>
        <Button variant="tertiary" iconOnly icon={<Icon.Cog />} aria-label="Settings">
          ''
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={5}>
          <DropdownMenu.Item label="About your Storybook" startInlineIndent />
          <DropdownMenu.Item label="What's new?" startInlineIndent />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  ),
};

export const WithCheckboxItem: Story = {
  args: {},
  render: (_, { args }) => (
    <DropdownMenu.Root {...args}>
      <DropdownMenu.Trigger asChild>
        <Button variant="tertiary" iconOnly icon={<Icon.Cog />} aria-label="Settings">
          ''
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={5}>
          <DropdownMenu.CheckboxItem
            checked
            label="Show sidebar"
            keyboardShortcut={{ label: 'S', ariaKeyshortcuts: 'S' }}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  ),
};

export const WithSeparator: Story = {
  args: {},
  render: (_, { args }) => (
    <DropdownMenu.Root {...args}>
      <DropdownMenu.Trigger asChild>
        <Button variant="tertiary" iconOnly icon={<Icon.Cog />} aria-label="Settings">
          ''
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={5}>
          <DropdownMenu.Item label="About your Storybook" startInlineIndent />
          <DropdownMenu.Item label="What's new?" startInlineIndent />
          <DropdownMenu.Separator />
          <DropdownMenu.CheckboxItem
            label="Show sidebar"
            keyboardShortcut={{ label: 'S', ariaKeyshortcuts: 'S' }}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  ),
};
