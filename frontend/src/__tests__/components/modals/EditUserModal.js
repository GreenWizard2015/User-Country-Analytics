import { fireEvent, waitFor } from '@testing-library/react';
import EditUserModal from 'components/modals/EditUserModal';
import moment from 'moment';
import { renderingWithUserModalUI } from 'utils/withUserModalUI';

describe('EditUserModal', () => {
  const renderMe = renderingWithUserModalUI(EditUserModal);

  it('displays the old user data', () => {
    const { UI, getByText } = renderMe({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: moment('1990-01-01').toDate(),
        country: 'USA',
      },
      countries: [{ id: 1, name: 'USA' },],
    });

    expect(UI.firstName()).toHaveValue('John');
    expect(UI.lastName()).toHaveValue('Doe');
    expect(UI.country()).toHaveValue('USA');
    expect(UI.dateOfBirth()).toHaveValue('01-01-1990');

    expect(getByText('Edit User')).toBeInTheDocument();
    expect(getByText('Save')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });

  it('saves the new user data', async () => {
    const onSave = jest.fn();
    const { UI } = renderMe({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: moment('1990-01-01').toDate(),
        country: 'USA',
      },
      countries: [{ id: 1, name: 'USA' },],
      save: onSave,
    });

    fireEvent.change(UI.firstName(), { target: { value: 'Jane' } });
    fireEvent.change(UI.lastName(), { target: { value: 'O' } });
    UI.createCountry('Canada');
    fireEvent.change(UI.dateOfBirth(), { target: { value: '10-11-2019' } });

    fireEvent.click(UI.saveButton());
    await waitFor(() => expect(onSave).toBeCalledWith({
      firstName: 'Jane',
      lastName: 'O',
      country: 'Canada',
      dateOfBirth: moment('10-11-2019', 'DD-MM-YYYY').toDate().getTime(),
    }));
  });
});
