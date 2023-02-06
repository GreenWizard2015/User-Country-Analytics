import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomInput = React.forwardRef(({ value, id, onReset, onClick }, ref) => (
  <div className="input-group">
    <input
      type="text"
      className="form-control"
      id={id}
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
    const { onChange, id } = this.props;
    return (
      <DatePicker
        customInput={<CustomInput onReset={() => onChange(null)} id={id} />}
        {...this.props}
      />
    );
  }
}

export default CustomDatePicker;