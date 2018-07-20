import PropTypes from 'prop-types';
import React from 'react';

import { Textarea } from '@storybook/components';

function formatArray(value, separator) {
  if (value === '') {
    return [];
  }
  return value.split(separator);
}

class ArrayType extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.knob.value !== this.props.knob.value;
  }

  handleChange = e => {
    const { knob } = this.props;
    const { value } = e.target;
    const newVal = formatArray(value, knob.separator);
    this.props.onChange(newVal);
  };

  render() {
    const { knob } = this.props;

    return <Textarea id={knob.name} value={knob.value} onChange={this.handleChange} size="flex" />;
  }
}

ArrayType.defaultProps = {
  knob: {},
  onChange: value => value,
};

ArrayType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.array,
    separator: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

ArrayType.serialize = value => value;
ArrayType.deserialize = value => {
  if (Array.isArray(value)) return value;

  return Object.keys(value)
    .sort()
    .reduce((array, key) => [...array, value[key]], []);
};

export default ArrayType;
