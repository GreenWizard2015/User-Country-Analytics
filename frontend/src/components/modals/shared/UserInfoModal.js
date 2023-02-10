import React, { Component } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import CustomDatePicker from 'components/CustomDatePicker';
import uuid from 'react-uuid';

class UserInfoModal extends Component {
  constructor(props) {
    super(props);
    const DEFAULT_STATE = {
      firstName: '',
      lastName: '',
      dateOfBirth: null,
      country: '',
      newCountry: '',
      newCountryUUID: uuid(),
    };

    const userProp = this.props.user || {};
    this.state = { ...DEFAULT_STATE, ...userProp, };
    // ensure that dateOfBirth is a Date object
    const { dateOfBirth } = this.state;
    if (dateOfBirth && !(dateOfBirth instanceof Date)) {
      throw new Error('user.dateOfBirth must be a Date object or null');
    }

    // ensure that only valid keys are in the state
    const validKeys = Object.keys(DEFAULT_STATE);
    const stateKeys = Object.keys(this.state);
    const invalidKeys = stateKeys.filter(key => !validKeys.includes(key));
    if (0 < invalidKeys.length) {
      throw new Error(`Invalid keys in state: ${invalidKeys.join(', ')}`);
    }
  }

  handleDateChange = date => {
    this.setState({ dateOfBirth: date });
  };

  handleClose = () => {
    this.props.rejected();
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { firstName, lastName, dateOfBirth, country, newCountry } = this.state;
    const data = {
      firstName,
      lastName,
      dateOfBirth: dateOfBirth.getTime(),
      country: (country === this.state.newCountryUUID) ? newCountry : country,
    };
    this.props.save(data);
  };

  countryField() {
    const { countries } = this.props;
    return (
      <Form.Group controlId="formCountryId">
        <Form.Label>Country</Form.Label>
        <Form.Control
          as="select"
          name="country"
          onChange={this.handleChange}
          value={this.state.country}
          required
        >
          <option value="">-- select a country --</option>
          {countries.map(country => (
            <option key={country.id} value={country.name}>
              {country.name}
            </option>
          ))}
          <option value={this.state.newCountryUUID}>Add New Country</option>
        </Form.Control>
        {(this.state.country === this.state.newCountryUUID) && (
          <Form.Control
            type="text"
            name="newCountry"
            placeholder="Enter new country name"
            onChange={this.handleChange}
            value={this.state.newCountry}
          />
        )}
      </Form.Group>
    );
  }

  dateOfBirthField() {
    return (
      <Form.Group as={Col} controlId="formDateOfBirth">
        <Form.Label>Date of Birth</Form.Label>
        <CustomDatePicker
          id="formDateOfBirth"
          dateFormat="dd-MM-yyyy"
          selected={this.state.dateOfBirth}
          onChange={this.handleDateChange}
          className="form-control"
          required
        />
      </Form.Group>
    );
  }

  isValid() {
    const { firstName, lastName, dateOfBirth } = this.state;
    // invalid when firstName, lastName or dateOfBirth is empty
    if (0 == firstName.length) return false;
    if (0 == lastName.length) return false;
    if (null == dateOfBirth) return false;

    // validate country
    const { country, newCountry } = this.state;
    if (country === this.state.newCountryUUID) {
      if (0 == newCountry.length) return false;
    }
    if (0 == country.length) return false;

    return true;
  }

  render() {
    return (
      <Modal show={true} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Form.Group as={Col} controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={this.state.lastName}
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
            </Row>

            <Row>
              {this.dateOfBirthField()}
              {this.countryField()}
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" type="submit" onClick={this.handleSubmit} disabled={!this.isValid()} data-testid="save-button">
            {this.props.saveText || 'Save'}
          </Button>

          <Button variant="secondary" onClick={this.handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default UserInfoModal;