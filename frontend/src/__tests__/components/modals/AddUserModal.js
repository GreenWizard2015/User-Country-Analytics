import React from 'react';
import AddUserModal from 'components/modals/AddUserModal';
import { renderingWithUserModalUI } from 'utils/withUserModalUI';

describe('AddUserModal', () => {
  const renderMe = renderingWithUserModalUI(args => <AddUserModal countries={[]} {...args} />);

  it('renders the modal with empty data', () => {
    const { UI, getByText } = renderMe();
    expect(UI.firstName()).toHaveValue('');
    expect(UI.lastName()).toHaveValue('');
    expect(UI.country()).toHaveValue('');
    expect(UI.dateOfBirth()).toHaveValue('');
    expect(UI.saveButton()).toBeDisabled();
    expect(UI.newCountry(false)).toBeNull();

    expect(getByText('Create User')).toBeInTheDocument();
    expect(getByText('Create')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });
});
