// Home view - This view displays the main content of the application which includes the Pie Chart, Date Filter Inputs, and User Data Grid. 
// The pie chart is built using the echarts library and shows the number of users in each country. The date filter inputs allow the user to filter the data by selecting a date range. The user data grid shows the filtered data and allows the user to interact with the data. The grid also shows a pagination if the data is large.
import React, { Component } from 'react';
import { Outlet } from 'react-router-dom';
import UsersChart from 'components/UsersChart';
import DateFilter from 'components/DateFilter';
import UsersDataGrid from 'components/UsersDataGrid';
import CountryFilter from 'components/CountryFilter';

class Home extends Component {
  render() {
    return (
      <div className="container-fluid min-vh-100">
        <div className="col main-area mx-auto">
          <div className="row">
            <div className="col-6">
              <UsersChart />
            </div>
            <div className="col-6">
              <DateFilter />
              <CountryFilter />
            </div>
          </div>
          <div className="row">
            <UsersDataGrid />
          </div>
        </div>

        <Outlet />
      </div>
    );
  }
}

export default Home;