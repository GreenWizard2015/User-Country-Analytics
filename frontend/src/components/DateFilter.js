import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setDateFrom, setDateTo } from 'store/UISlice';
import CustomDatePicker from './CustomDatePicker';

const acceptTimestamp = f => date => f(date ? date.getTime() : null);

class DateFilter extends Component {
  render() {
    let { dateFrom, dateTo } = this.props;
    dateFrom = dateFrom ? new Date(dateFrom) : null;
    dateTo = dateTo ? new Date(dateTo) : null;

    return (
      <div className="row date-filter">
        <div className="col-md-5 col-12">
          <CustomDatePicker
            selected={dateFrom}
            onChange={acceptTimestamp(this.props.setDateFrom)}
            selectsStart
            startDate={dateFrom}
            endDate={dateTo}
            placeholderText="From"
            className="form-control"
          />
        </div>

        <div className="col-md-5 col-12">
          <CustomDatePicker
            selected={dateTo}
            onChange={acceptTimestamp(this.props.setDateTo)}
            selectsEnd
            startDate={dateFrom}
            endDate={dateTo}
            minDate={dateFrom}
            placeholderText="To"
            className="form-control"
          />
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    dateFrom: state.UI.dateFrom,
    dateTo: state.UI.dateTo
  }),
  { setDateFrom, setDateTo }
)(DateFilter);
