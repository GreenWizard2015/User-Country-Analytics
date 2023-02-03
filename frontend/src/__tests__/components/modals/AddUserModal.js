import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import AddUserModal from 'components/modals/AddUserModal';

describe('AddUserModal', () => {
  const countries = [
    { id: 1, name: 'USA' },
    { id: 2, name: 'Canada' },
    { id: 3, name: 'Mexico' },
  ];
  function fakeDatePicker({ onChange, ...props }) {
    function handleChange(event) {
      onChange(event.target.value);
    }
    return <input type="text" {...props} data-testid="dateOfBirth" onChange={handleChange} />;
  }

  function renderAddUserModal(args = {}) {
    const browser = render(<AddUserModal countries={countries} datePickerComponent={fakeDatePicker} {...args} />);
    const METHOD = {
      'text': { true: browser.getByText, false: browser.queryByText },
      'labelText': { true: browser.getByLabelText, false: browser.queryByLabelText },
      'placeholderText': { true: browser.getByPlaceholderText, false: browser.queryByPlaceholderText },
      'testId': { true: browser.getByTestId, false: browser.queryByTestId },
    };
    return {
      ...browser,
      UI: {
        firstName: (raise = true) => METHOD['labelText'][raise]('First Name'),
        lastName: (raise = true) => METHOD['labelText'][raise]('Last Name'),
        country: (raise = true) => METHOD['labelText'][raise]('Country'),
        newCountry: (raise = true) => METHOD['placeholderText'][raise]('Enter new country name'),
        dateOfBirth: (raise = true) => METHOD['testId'][raise]('dateOfBirth'),
        saveButton: (raise = true) => METHOD['text'][raise]('Save'),
        cancelButton: (raise = true) => METHOD['text'][raise]('Cancel'),
      }
    };
  }

  it('form initial state', () => {
    const { UI } = renderAddUserModal();
    expect(UI.firstName()).toHaveValue('');
    expect(UI.lastName()).toHaveValue('');
    expect(UI.country()).toHaveValue('');
    expect(UI.dateOfBirth()).toHaveValue('');
    expect(UI.saveButton()).toBeDisabled();
    expect(UI.newCountry(false)).toBeNull();
  });

  it('displays a dropdown list of countries', () => {
    const { getByText, getByLabelText } = render(
      <AddUserModal countries={countries} />
    );

    const countrySelect = getByLabelText('Country');
    expect(countrySelect).toHaveValue('');

    fireEvent.change(countrySelect, { target: { value: 'Mexico' } });
    expect(countrySelect).toHaveValue('Mexico');

    expect(getByText('USA')).toBeInTheDocument();
    expect(getByText('Canada')).toBeInTheDocument();
    expect(getByText('Mexico')).toBeInTheDocument();
  });

  it('displays an input field to add a new country when "Add New Country" is selected', () => {
    const { UI } = renderAddUserModal();
    fireEvent.change(UI.country(), { target: { value: 'new' } });

    expect(UI.newCountry()).toBeInTheDocument();
  });

  it('the save button enabled and calls the save handler when all fields are filled', () => {
    const saveHandler = jest.fn();
    const { UI } = renderAddUserModal({ save: saveHandler });
    fireEvent.change(UI.firstName(), { target: { value: 'John' } });
    fireEvent.change(UI.lastName(), { target: { value: 'Smith' } });
    fireEvent.change(UI.country(), { target: { value: 'Canada' } });
    fireEvent.change(UI.dateOfBirth(), { target: { value: '2019-10-10' } });

    expect(UI.saveButton()).toBeEnabled();
    fireEvent.click(UI.saveButton());

    expect(saveHandler).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Smith',
      country: 'Canada',
      dateOfBirth: '2019-10-10',
    });
  });

  it('the save button enabled and calls the save handler when all fields are filled including a new country', () => {
    const saveHandler = jest.fn();
    const { UI } = renderAddUserModal({ save: saveHandler });
    fireEvent.change(UI.firstName(), { target: { value: 'John' } });
    fireEvent.change(UI.lastName(), { target: { value: 'Smith' } });
    fireEvent.change(UI.dateOfBirth(), { target: { value: '2019-10-10' } });
    fireEvent.change(UI.country(), { target: { value: 'new' } });
    fireEvent.change(UI.newCountry(), { target: { value: 'New Zealand' } });

    expect(UI.saveButton()).toBeEnabled();
    fireEvent.click(UI.saveButton());

    expect(saveHandler).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Smith',
      country: 'New Zealand',
      dateOfBirth: '2019-10-10',
    });
  });

  it('calls the rejected handler when the cancel button is clicked', () => {
    const rejectedHandler = jest.fn();
    const { UI } = renderAddUserModal({ rejected: rejectedHandler });
    fireEvent.click(UI.cancelButton());

    expect(rejectedHandler).toHaveBeenCalled();
  });
});
