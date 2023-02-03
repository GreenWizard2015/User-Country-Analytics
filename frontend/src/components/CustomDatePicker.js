import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomInput = React.forwardRef(({ onReset, value, onClick }, ref) => (
  <div className="input-group">
    <input
      type="text"
      className="form-control"
      value={value}
      onClick={onClick}
      ref={ref}
      readOnly
    />
    <div className="input-group-append">
      <button
        className="btn btn-outline-secondary"
        type="button"
        onClick={onReset}
      >X</button>
    </div>
  </div>
));

class CustomDatePicker extends Component {
  render() {
    const { onChange } = this.props;
    return (
      <DatePicker
        customInput={<CustomInput onReset={() => onChange(null)} />}
        {...this.props}
      />
    );
  }
}

export default CustomDatePicker;