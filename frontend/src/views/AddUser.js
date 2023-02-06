// Add User view - This view displays a form that allows the user to add new users. The form includes inputs for first name, last name, date of birth, and relation to the country. The form is validated and data is sent to the backend to be added to the database.
// Modal shown when countries are loaded
import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddUserModal from 'components/modals/AddUserModal';
import storeActions from 'store/actions';

export class AddUser extends Component {
  render() {
    const { countries: { data, loaded } } = this.props;
    if (!loaded) return null;
    return (
      <>
        <AddUserModal
          countries={data}
          rejected={this.props.goHome}
          save={this.props.createUser}
        />
      </>
    );
  }
}

function requiredActions() {
  const { actions: { goHome, createUser } } = storeActions;
  return { goHome, createUser };
}

export default connect(
  state => ({ countries: state.countries }),
  requiredActions()
)(AddUser);