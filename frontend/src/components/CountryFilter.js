// CountryFilter is a component that is used in the Home view. It is a dropdown menu that allows the user to filter the data by country. The component is connected to the redux store and dispatches an action when the user selects a country. The action is handled by the reducer and updates the state of the application. This component very similar to DateFilter.
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCountry } from 'store/UISlice';
import { countriesUpdates } from 'store/events';
import uuid from 'react-uuid';

class CountryFilter extends Component {
  _emptyFilter = uuid();

  componentDidMount() {
    this.props.countriesUpdates(true);
  }

  componentWillUnmount() {
    this.props.countriesUpdates(false);
  }

  onChange = e => {
    const value = e.target.value;
    this.props.setCountry((value === this._emptyFilter) ? null : value);
  };

  render() {
    const { countries, activeCountry } = this.props;
    if (!countries.loaded) return null;
    return (
      <div className="row pt-3">
        <select
          className="form-control"
          onChange={this.onChange}
          value={activeCountry || this._emptyFilter}
          data-testid="country-filter-select"
        >
          <option value={this._emptyFilter}>All countries</option>
          {countries.data.map(({ id, name }) => (
            <option key={id} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default connect(
  state => ({
    countries: state.countries,
    activeCountry: state.UI.country,
  }),
  { setCountry, countriesUpdates }
)(CountryFilter);