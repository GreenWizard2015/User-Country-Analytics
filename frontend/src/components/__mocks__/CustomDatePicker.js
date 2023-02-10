import React, { Component } from 'react';
import moment from 'moment/moment';

// posible props: selected, onChange, selectsStart, startDate, endDate
// CustomDatePicker for testing purposes
class CustomDatePicker extends Component {
  render() {
    const {
      onChange, selected, dateFormat,
      selectsStart = null, selectsEnd = null, minDate = null, startDate = null, endDate = null, placeholderText = null,
      ...props
    } = this.props;
    // assert some props are of type Date or null
    if (startDate !== null) {
      expect(startDate).toBeInstanceOf(Date);
    }
    if (endDate !== null) {
      expect(endDate).toBeInstanceOf(Date);
    }
    if (minDate !== null) {
      expect(minDate).toBeInstanceOf(Date);
    }
    if (selected !== null) {
      expect(selected).toBeInstanceOf(Date);
    }

    // just as a hack, real CustomDatePicker should use dd-MM-yyyy format, which is equal to DD-MM-YYYY in moment.js
    expect(dateFormat).toBe('dd-MM-yyyy');

    const value = selected ? moment(selected).format('DD-MM-YYYY') : '';
    function handleChange(event) {
      const date = event.target.value ? moment(event.target.value, 'DD-MM-YYYY').toDate() : null;
      onChange(date);
    }
    return (
      <input type="text" {...props} onChange={handleChange} value={value} />
    );
  }
}
export default CustomDatePicker;