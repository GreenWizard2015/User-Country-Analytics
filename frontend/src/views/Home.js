// Home view - This view displays the main content of the application which includes the Pie Chart, Date Filter Inputs, and User Data Grid. 
// The pie chart is built using the echarts library and shows the number of users in each country. The date filter inputs allow the user to filter the data by selecting a date range. The user data grid shows the filtered data and allows the user to interact with the data. The grid also shows a pagination if the data is large.
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUsers } from 'store/usersSlice';
import UsersChart from 'components/UsersChart';

class Home extends Component {
  async componentDidMount() {
    await this.props.fetchUsers();
  }
  
  usersDataGrid() {
    const { users } = this.props;
    if (!users.length) {
      return <h1>Loading...</h1>;
    }
    return (
      <div>
        <h1>Users</h1>
        <ul>
          {
            users.map(user => (
              <li key={user.id}>{user.first_name + ' ' + user.last_name}</li>
            ))
          }
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div className="container-fluid min-vh-100">
        <div className="row">
          <div className="col-4">
            <UsersChart id="users-chart" />
          </div>
          <div className="col-8">
            {this.usersDataGrid()}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    users: state.users,
  }),
  { fetchUsers }
)(Home);