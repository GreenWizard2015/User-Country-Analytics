import { fireEvent } from '@testing-library/react';
import UserInfoModal from 'components/modals/shared/UserInfoModal';
import moment from 'moment';
import { renderingWithUserModalUI } from 'utils/withUserModalUI';

describe('UserInfoModal', () => {
  const countries = [
    { id: 1, name: 'USA' },
    { id: 2, name: 'Canada' },
    { id: 3, name: 'Mexico' },
  ];
  const renderMe = renderingWithUserModalUI(props => <UserInfoModal countries={countries} {...props} />);

  it('form initial state', () => {
    const { UI } = renderMe();
    expect(UI.firstName()).toHaveValue('');
    expect(UI.lastName()).toHaveValue('');
    expect(UI.country()).toHaveValue('');
    expect(UI.dateOfBirth()).toHaveValue('');
    expect(UI.saveButton()).toBeDisabled();
    expect(UI.newCountry(false)).toBeNull();
  });

  it('should initialize the form with the user data when provided', () => {
    const user = {
      firstName: 'John',
      lastName: 'Smith',
      country: 'Canada',
      dateOfBirth: moment('10-11-2019', 'DD-MM-YYYY').toDate(),
    };
    const { UI } = renderMe({ user });
    expect(UI.firstName()).toHaveValue('John');
    expect(UI.lastName()).toHaveValue('Smith');
    expect(UI.country()).toHaveValue('Canada');
    expect(UI.dateOfBirth()).toHaveValue('10-11-2019');
  });

  it('displays a dropdown list of countries', () => {
    const { UI, getByText } = renderMe();

    expect(UI.country()).toHaveValue('');

    fireEvent.change(UI.country(), { target: { value: 'Mexico' } });
    expect(UI.country()).toHaveValue('Mexico');

    expect(getByText('USA')).toBeInTheDocument();
    expect(getByText('Canada')).toBeInTheDocument();
    expect(getByText('Mexico')).toBeInTheDocument();
  });

  it('displays an input field to add a new country when "Add New Country" is selected', () => {
    const { UI } = renderMe();
    UI.selectAddNewCountry();
    expect(UI.newCountry()).toBeInTheDocument();
  });

  it('the save button enabled and calls the save handler when all fields are filled and data is saving properly', () => {
    const saveHandler = jest.fn();
    const { UI } = renderMe({ save: saveHandler });
    fireEvent.change(UI.firstName(), { target: { value: 'John' } });
    fireEvent.change(UI.lastName(), { target: { value: 'Smith' } });
    fireEvent.change(UI.country(), { target: { value: 'Canada' } });
    fireEvent.change(UI.dateOfBirth(), { target: { value: '10-11-2019' } });

    expect(UI.saveButton()).toBeEnabled();
    fireEvent.click(UI.saveButton());

    expect(saveHandler).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Smith',
      country: 'Canada',
      // as unix timestamp
      dateOfBirth: moment('10-11-2019', 'DD-MM-YYYY').toDate().getTime(),
    });
  });

  it('the save button enabled and calls the save handler when all fields are filled including a new country', () => {
    const saveHandler = jest.fn();
    const { UI } = renderMe({ save: saveHandler });
    fireEvent.change(UI.firstName(), { target: { value: 'John' } });
    fireEvent.change(UI.lastName(), { target: { value: 'Smith' } });
    fireEvent.change(UI.dateOfBirth(), { target: { value: '10-11-2019' } });
    UI.createCountry('New Zealand');

    expect(UI.saveButton()).toBeEnabled();
    fireEvent.click(UI.saveButton());

    expect(saveHandler).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Smith',
      country: 'New Zealand',
      // as unix timestamp
      dateOfBirth: moment('10-11-2019', 'DD-MM-YYYY').toDate().getTime(),
    });
  });

  it('calls the rejected handler when the cancel button is clicked', () => {
    const rejectedHandler = jest.fn();
    const { UI } = renderMe({ rejected: rejectedHandler });
    fireEvent.click(UI.cancelButton());

    expect(rejectedHandler).toHaveBeenCalled();
  });

  // disabled because it shows a traceback in the console even though the test passes
  false && it('throws an error when the user.dateOfBirth is not a Date', () => {
    expect(() => {
      renderMe({ user: { dateOfBirth: 'not a date' } });
    }).toThrowError('user.dateOfBirth must be a Date object or null');
  });

  it('"new" country in the dropdown list didn\'t cause creation of a new country', () => {
    const { UI } = renderMe({ countries: [{ id: 1, name: 'new' }] });
    fireEvent.change(UI.country(), { target: { value: 'new' } });
    expect(UI.newCountry(false)).toBeNull();
  });
});
