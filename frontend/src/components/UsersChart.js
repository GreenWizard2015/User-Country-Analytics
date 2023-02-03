import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCountries } from 'store/countriesSlice';
import ReactEcharts from 'echarts-for-react';

function getPieChartOption(countries) {
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
        }
      }
    ]
  };
}

class UsersChart extends Component {
  async componentDidMount() {
    await this.props.fetchCountries();
  }
  
  render() {
    const { countries } = this.props;
    if (!countries.loaded) {
      return <h1>Loading...</h1>;
    }
    if (countries.error) {
      return <h1>{countries.error}</h1>;
    }
    return (
      <div data-testid="users-chart">
        <ReactEcharts option={getPieChartOption(countries.data)} />
      </div>
    );
  }
}

export default connect(
  state => ({
    countries: state.countries
  }),
  { fetchCountries }
)(UsersChart);

// for testing
export { getPieChartOption };