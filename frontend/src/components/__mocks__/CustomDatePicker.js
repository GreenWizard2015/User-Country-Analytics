import React, { Component } from 'react';
import moment from 'moment/moment';

// posible props: selected, onChange, selectsStart, startDate, endDate
// CustomDatePicker for testing purposes
class CustomDatePicker extends Component {
  render() {
    const {
      onChange, selected, dateFormat,
      selectsStart = null, selectsEnd=null, minDate=null, startDate=null, endDate=null, placeholderText=null,
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
    
    const value = selected ? moment(selected).format(dateFormat) : '';
    function handleChange(event) {
      const date = event.target.value ? moment(event.target.value, dateFormat).toDate() : null;
      onChange(date);
    }
    return (
      <input type="text" {...props} onChange={handleChange} value={value} />
    );
  }
}
export default CustomDatePicker;