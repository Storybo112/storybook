import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = {
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  height: '25px',
  width: '100%',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: 11,
  padding: '5px',
  color: '#444',
  flex: 1,
};

const formatDate = date => {
  const year = `000${date.getFullYear()}`.slice(-4);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  return `${year}-${month}-${day}`;
};
const formatTime = date => {
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);

  return `${hours}:${minutes}`;
};

class DateType extends Component {
  static getDerivedStateFromProps() {
    console.log('should be true');
    return { valid: true };
  }

  state = {
    valid: undefined,
  };

  componentDidUpdate() {
    const value = new Date(this.props.knob.value);

    if (this.state.valid !== false) {
      this.dateInput.value = formatDate(value);
      this.timeInput.value = formatTime(value);
    }
  }

  onDateChange = e => {
    let valid = false;
    const [year, month, day] = e.target.value.split('-');
    const result = new Date(this.props.knob.value);
    if (result.getTime()) {
      result.setFullYear(parseInt(year, 10));
      result.setMonth(parseInt(month, 10) - 1);
      result.setDate(parseInt(day, 10));
      if (result.getTime()) {
        valid = true;
        this.props.onChange(result.getTime());
      }
    }
    if (valid !== this.state.valid) {
      this.setState({ valid });
    }
  };
  onTimeChange = e => {
    let valid = false;
    const [hours, minutes] = e.target.value.split(':');
    const result = new Date(this.props.knob.value);
    if (result.getTime()) {
      result.setHours(parseInt(hours, 10));
      result.setMinutes(parseInt(minutes, 10));
      if (result.getTime()) {
        this.props.onChange(result.getTime());
        valid = true;
      }
    }
    if (valid !== this.state.valid) {
      this.setState({ valid });
    }
  };

  render() {
    const { knob } = this.props;
    const { name } = knob;
    const { valid } = this.state;

    return name ? (
      <div style={{ display: 'flex' }}>
        <input
          style={styles}
          type="date"
          max="9999-12-31" // I do this because of a rendering bug in chrome
          ref={el => {
            this.dateInput = el;
          }}
          id={`${name}date`}
          onChange={this.onDateChange}
        />
        <input
          style={styles}
          type="time"
          id={`${name}time`}
          ref={el => {
            this.timeInput = el;
          }}
          onChange={this.onTimeChange}
        />
        {!valid ? <div>invalid</div> : null}
      </div>
    ) : null;
  }
}

DateType.defaultProps = {
  knob: {},
  onChange: value => value,
};

DateType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number,
  }),
  onChange: PropTypes.func,
};

DateType.serialize = value => new Date(value).getTime() || new Date().getTime();
DateType.deserialize = value => new Date(value).getTime() || new Date().getTime();

export default DateType;
