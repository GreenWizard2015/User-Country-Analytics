// Add User view - This view displays a form that allows the user to add new users. The form includes inputs for first name, last name, date of birth, and relation to the country. The form is validated and data is sent to the backend to be added to the database.
// Modal shown when countries are loaded
import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddUserModal from 'components/modals/AddUserModal';
import { push as navigateTo } from 'redux-first-history';

export class AddUser extends Component {
  render() {
    const { countries: { data, loaded } } = this.props;
    if (!loaded) return null;
    return (
      <>
        <AddUserModal countries={data} goHome={() => this.props.navigateTo('/')} />
      </>
    );
  }
}

export default connect(
  state => ({ countries: state.countries }),
  { navigateTo }
)(AddUser);