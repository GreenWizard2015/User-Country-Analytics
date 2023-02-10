import React, { Component } from 'react';
import { connect } from 'react-redux';
import storeActions from 'store/actions';
import withParams from 'utils/withParams';
import EditUserModal from 'components/modals/EditUserModal';
import { Modal } from 'react-bootstrap';

const Loading = () => (
  <Modal show>
    <Modal.Header>
      <Modal.Title>Edit User</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="text-center">
        Loading...
      </div>
    </Modal.Body>
  </Modal>
);

export class EditUser extends Component {
  state = { user: null };

  // async fetch user
  async componentDidMount() {
    const { userId, fetchUser } = this.props;
    const userRawData = await fetchUser(userId);
    // convert raw data to user object
    const user = {
      firstName: userRawData.first_name,
      lastName: userRawData.last_name,
      country: userRawData.country_name,
      dateOfBirth: new Date(userRawData.date_of_birth),
    };
    this.setState(state => ({ ...state, user }));
  }

  async onUserSave(data) {
    const { updateUser, goHome, userId } = this.props;
    try {
      await updateUser(userId, data);
    } finally {
      await goHome();
    }
  }

  render() {
    const { countries: { data, loaded } } = this.props;
    if (!loaded) return <Loading />;
    if (!this.state.user) return <Loading />;

    return (
      <EditUserModal
        countries={data}
        user={this.state.user}
        rejected={this.props.goHome}
        save={this.onUserSave.bind(this)}
      />
    );
  }
}

function requiredActions() {
  const { actions: { goHome, }, users: { updateUser, fetchUser } } = storeActions;
  return { goHome, updateUser, fetchUser };
}

export default connect(
  state => ({ countries: state.countries }),
  requiredActions()
)(withParams(EditUser));