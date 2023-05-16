import type { ComponentProps } from 'react';
import React from 'react';
import { styled, css } from '@storybook/theming';

import { Icons } from './icon';
import type { IconKey } from './icons';
import { icons } from './icons';

const Meta = styled.div`
  color: #666;
  font-size: 12px;
`;

const Item = styled.li<{ minimal?: boolean }>`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  flex: 0 1 16%;
  min-width: 120px;
  margin: 16px;

  svg {
    margin-right: 6px;
    width: 14px;
    height: 14px;
  }

  ${(props: any) =>
    props.minimal &&
    css`
      flex: none;
      min-width: auto;
      padding: 0;
      margin: 16px;

      svg {
        display: block;
        margin-right: 0;
        width: 14px;
        height: 14px;
      }
    `};
`;

const List = styled.ul`
  display: flex;
  flex-flow: row wrap;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Header = styled.h2`
  font-size: 16px;
  margin: 16px;
`;

export default {
  component: Icons,
  argTypes: {
    color: { control: 'color' },
  },
};

export const Basic = (args: ComponentProps<typeof Icons>) => <Icons {...args} />;
Basic.args = { icon: 'watch' };

export const Labels = (args: Omit<ComponentProps<typeof Icons>, 'icon'>) => (
  <>
    <Header>{Object.keys(icons).length} icons</Header>
    <List>
      {Object.keys(icons).map((key) => (
        <Item key={key}>
          <Icons icon={key as IconKey} aria-hidden {...args} />
          <Meta>{key}</Meta>
        </Item>
      ))}
    </List>
  </>
);

export const NoLabels = (args: Omit<ComponentProps<typeof Icons>, 'icon'>) => (
  <>
    <Header>{Object.keys(icons).length} icons</Header>
    <List>
      {Object.keys(icons).map((key) => (
        <Item minimal key={key}>
          <Icons icon={key as IconKey} aria-label={key} {...args} />
        </Item>
      ))}
    </List>
  </>
);
