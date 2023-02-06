import React, { Component } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import CustomDatePicker from 'components/CustomDatePicker';

class AddUserModal extends Component {
  state = {
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    country: '',
    newCountry: '',
  };

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
      country: country === 'new' ? newCountry : country,
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
          <option value="new">Add New Country</option>
        </Form.Control>
        {this.state.country === 'new' && (
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
          dateFormat="DD-MM-YYYY"
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
    if (country === 'new') {
      if (0 == newCountry.length) return false;
    }
    if (0 == country.length) return false;

    return true;
  }

  render() {
    return (
      <Modal show={true} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Form.Group as={Col} controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
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
          <Button variant="primary" type="submit" onClick={this.handleSubmit} disabled={!this.isValid()}>
            Save
          </Button>

          <Button variant="secondary" onClick={this.handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AddUserModal;