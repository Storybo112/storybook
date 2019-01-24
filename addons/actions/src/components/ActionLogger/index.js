import PropTypes from 'prop-types';
import React from 'react';
import Inspector from 'react-inspector';

import { withTheme } from '@storybook/theming';
import { ActionBar, ActionButton } from '@storybook/components';

import { Actions, Action, Wrapper, InspectorContainer, Countwrap, Counter } from './style';

const ActionLogger = withTheme(({ actions, onClear, theme }) => (
  <Wrapper>
    <Actions>
      {actions.map(action => (
        <Action key={action.id}>
          <Countwrap>{action.count > 1 && <Counter>{action.count}</Counter>}</Countwrap>
          <InspectorContainer>
            <Inspector
              theme={theme.addonActionsTheme || 'chromeLight'}
              sortObjectKeys
              showNonenumerable={false}
              name={action.data.name}
              data={action.data.args || action.data}
            />
          </InspectorContainer>
        </Action>
      ))}
    </Actions>

    <ActionBar>
      <ActionButton onClick={onClear}>CLEAR</ActionButton>
    </ActionBar>
  </Wrapper>
));

ActionLogger.propTypes = {
  onClear: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.node,
      data: PropTypes.shape({
        name: PropTypes.node.isRequired,
        args: PropTypes.any,
      }),
    })
  ).isRequired,
};

export default ActionLogger;
