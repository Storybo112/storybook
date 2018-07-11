import { document } from 'global';
import PropTypes from 'prop-types';
import React from 'react';
import { SketchPicker } from 'react-color';

import styled from 'react-emotion';

import { Button } from '@storybook/components';

const Swatch = styled('div')({
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 3,
  width: 28,
});
const Popover = styled('div')({
  position: 'absolute',
  zIndex: '2',
});

class ColorType extends React.Component {
  state = {
    displayColorPicker: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (!state || props.knob.value !== state.value) {
      return { value: props.knob.value };
    }
    return null;
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleWindowMouseDown);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleWindowMouseDown);
  }

  handleWindowMouseDown = e => {
    if (!this.state.displayColorPicker) return;
    if (this.popover.contains(e.target)) return;

    this.setState({
      displayColorPicker: false,
    });
  };

  handleClick = () => {
    this.setState({
      displayColorPicker: !this.state.displayColorPicker,
    });
  };

  handleChange = color => {
    this.setState({
      value: color,
    });

    this.props.onChange(`rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`);
  };

  render() {
    const { knob } = this.props;
    const { displayColorPicker, value } = this.state;
    const colorStyle = {
      background: knob.value,
    };

    return (
      <Button type="button" onClick={this.handleClick} size="flex">
        {knob.value}
        <Swatch style={colorStyle} />
        {displayColorPicker ? (
          <Popover
            innerRef={e => {
              this.popover = e;
            }}
          >
            <SketchPicker color={value} onChange={this.handleChange} />
          </Popover>
        ) : null}
      </Button>
    );
  }
}

ColorType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }),
  onChange: PropTypes.func,
};
ColorType.defaultProps = {
  knob: {},
  onChange: value => value,
};

ColorType.serialize = value => value;
ColorType.deserialize = value => value;

export default ColorType;
