import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ManagerContext } from '@storybook/manager-api';
import { within, userEvent, expect } from '@storybook/test';

import { index } from './mockdata.large';
import { Search } from './Search';
import { SearchResults } from './SearchResults';
import { noResults } from './SearchResults.stories';
import { DEFAULT_REF_ID } from './Sidebar';
import type { Selection } from './types';
import { IconSymbols } from './IconSymbols';
import { LayoutProvider } from '../layout/LayoutProvider';

const refId = DEFAULT_REF_ID;
const data = { [refId]: { id: refId, url: '/', index, previewInitialized: true } };
const dataset = { hash: data, entries: Object.entries(data) };
const getLastViewed = () =>
  Object.values(index)
    .filter((item, i) => item.type === 'component' && item.parent && i % 20 === 0)
    .map((component) => ({ storyId: component.id, refId }));

let queryParams: Record<string, string> = {};

const meta = {
  component: Search,
  title: 'Sidebar/Search',
  parameters: { layout: 'fullscreen' },
  args: {
    dataset,
    getLastViewed: (): Selection[] => []
  },
  render: (args) => {
    return (
      <Search {...args}>
        {() => <SearchResults {...noResults} />}
      </Search>
    );
  },
  decorators: [
    (storyFn) => (
      <ManagerContext.Provider
        value={
          {
            state: {
            },
            api: {
              emit: () => {},
              on: () => {},
              off: () => {},
              getShortcutKeys: () => ({ search: ['control', 'shift', 's'] }),
              selectStory: () => {},
              setQueryParams: (params: Record<string, string>): void => {
                queryParams = params;
              },
              getQueryParams: () => queryParams
            },
          } as any
        }
      >
        <LayoutProvider>
          <IconSymbols />
          {storyFn()}
        </LayoutProvider>
      </ManagerContext.Provider>
    ),
  ]
} satisfies Meta<typeof Search>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {};

export const SimpleWithCreateButton: Story = {
  args: {
    showCreateStoryButton: true
  }
};

export const FilledIn: Story = {
  args: {
    initialQuery: 'Search query'
  }
};

export const LastViewed: Story = {
  args: {
    getLastViewed
  }
};

export const ShortcutsDisabled: Story = {
  args: {
    enableShortcuts: false
  }
};

export const Searching: Story = {
  play: async ({ canvasElement }) => {
    const canvas = await within(canvasElement);
    const search = await canvas.findByPlaceholderText('Find components');
    await userEvent.clear(search);
    await userEvent.type(search, 'foo');
    expect(queryParams).toEqual({
      search: 'foo'
    });
  }
};

export const Clearing: Story = {
  play: async ({ canvasElement }) => {
    const canvas = await within(canvasElement);
    const search = await canvas.findByPlaceholderText('Find components');
    await userEvent.clear(search);
    await userEvent.type(search, 'foo');

    const clearIcon = await canvas.findByTitle('Clear search');
    await userEvent.click(clearIcon);

    expect(queryParams).toEqual({search: null});
  }
};
