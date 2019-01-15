import React from 'react';
import addons, { types } from '@storybook/addons';

import Panel from './components/Panel';
import ColorBlindness from './components/ColorBlindness';

import { ADDON_ID, PANEL_ID } from './constants';

addons.register(ADDON_ID, api => {
  addons.add(PANEL_ID, {
    type: types.TOOL,
    render: () => <ColorBlindness />,
  });

  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Accessibility',
    // eslint-disable-next-line react/prop-types
    render: ({ active, key }) => <Panel key={key} api={api} active={active} />,
  });
});
