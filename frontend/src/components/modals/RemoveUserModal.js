import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

class RemoveUserModal extends Component {
  render() {
    const { userId } = this.props;
    // modal form request 'Do you want to remove user?' and 'Yes'/'No' buttons
    return (
      <Modal show={true} onHide={this.props.rejected}>
        <Modal.Header closeButton>
          <Modal.Title>Remove user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to remove user #{userId}?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-secondary" onClick={this.props.rejected}>No</Button>
          <Button className="btn btn-primary" onClick={() => this.props.removeUser(userId)}>Yes</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default RemoveUserModal;