import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { Tabs, Icons } from '@storybook/components';

class SafeTab extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    // eslint-disable-next-line no-console
    console.error(error, info);
  }

  render() {
    const { hasError } = this.state;
    const { children, title, id } = this.props;
    if (hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <div id={id} title={title}>
        {children}
      </div>
    );
  }
}
SafeTab.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
SafeTab.defaultProps = {
  children: null,
};

const ToolButton = styled.button({
  background: 'none',
  border: '0 none',
  padding: 0,
  color: 'inherit',

  '&:hover, &:focus': {
    color: '#300aaff',
    outline: '0 none',
    cursor: 'pointer',
  },
});

export const Separator = styled.span({
  width: 1,
  height: 24,
  background: '#eee',
});

// eslint-disable-next-line react/no-multi-comp
const AddonPanel = React.memo(({ panels, actions, selectedPanel, panelPosition }) => (
  <Tabs
    absolute
    selected={selectedPanel}
    actions={actions}
    flex
    tools={
      <Fragment>
        <Separator key="1" />
        <ToolButton key="position" onClick={actions.togglePosition}>
          <Icons icon={panelPosition === 'bottom' ? 'bottombar' : 'sidebaralt'} />
        </ToolButton>
        <ToolButton key="visibility" onClick={actions.toggleVisibility}>
          <Icons icon="close" />
        </ToolButton>
      </Fragment>
    }
    id="storybook-panel-root"
  >
    {Object.entries(panels).map(([k, v]) => (
      <SafeTab key={k} id={k} title={v.title}>
        {v.render}
      </SafeTab>
    ))}
  </Tabs>
));
AddonPanel.displayName = 'AddonPanel';
AddonPanel.propTypes = {
  selectedPanel: PropTypes.string,
  actions: PropTypes.shape({}).isRequired,
  panels: PropTypes.shape({}).isRequired,
  panelPosition: PropTypes.oneOf(['bottom', 'right']),
};
AddonPanel.defaultProps = {
  selectedPanel: null,
  panelPosition: 'right',
};

export default AddonPanel;
