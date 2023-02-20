import React, { Component } from 'react';
import { connect } from 'react-redux';
import { countriesUpdates } from 'store/events';
import { setCountry } from 'store/UISlice';
import ReactEcharts from 'echarts-for-react';

function getPieChartOption(countries, activeCountry) {
  const selectedMap = activeCountry ? { [activeCountry]: true } : {};
  return {
    title: {
      text: 'Number of Users by Country',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    series: [
      {
        name: 'Country',
        type: 'pie',
        radius: '85%',
        center: ['50%', '50%'],
        data: countries.map(country => ({ value: country.users_count, name: country.name })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        selectedMode: 'single',
        selectedMap
      }
    ]
  };
}

export class UsersChart extends Component {
  _echartRef = null;

  componentDidMount() {
    this.props.countriesUpdates(true);
  }

  componentWillUnmount() {
    this.props.countriesUpdates(false);
  }

  onEvents = {
    'click': (e) => {
      const chart = this._echartRef.getEchartsInstance();
      const selectedMap = chart.getModel().getComponent('series', 0).get('selectedMap');
      // find first key with value true or undefined
      const selectedCountry = Object.keys(selectedMap).find(key => selectedMap[key]);
      this.props.setCountry(selectedCountry);
    },
  };

  render() {
    const { countries, activeCountry } = this.props;
    if (!countries.loaded) {
      return <h1>Loading...</h1>;
    }
    if (countries.error) {
      return <h1>{countries.error}</h1>;
    }
    return (
      <div data-testid="users-chart">
        <ReactEcharts
          ref={(e) => { this._echartRef = e; }}
          option={getPieChartOption(countries.data, activeCountry)}
          onEvents={this.onEvents}
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    countries: state.countries,
    activeCountry: state.UI.country,
  }),
  { countriesUpdates, setCountry }
)(UsersChart);

// for testing
export { getPieChartOption };