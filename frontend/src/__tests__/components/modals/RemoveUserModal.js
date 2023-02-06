import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import RemoveUserModal from 'components/modals/RemoveUserModal';

describe('RemoveUserModal', () => {
  it('renders with message', () => {
    const { getByText } = render(<RemoveUserModal userId={1} />);
    expect(getByText('Do you want to remove user #1?')).toBeInTheDocument();
  });
  
  it('reject on No', async () => {
    const reject = jest.fn();
    const browser = render(<RemoveUserModal rejected={reject} />);
    fireEvent.click(browser.getByText('No'));
    await waitFor(() => expect(reject).toHaveBeenCalled());
  });

  it('removeUser on Yes', async () => {
    const removeUser = jest.fn();
    const browser = render(<RemoveUserModal removeUser={removeUser} />);
    fireEvent.click(browser.getByText('Yes'));
    await waitFor(() => expect(removeUser).toHaveBeenCalled());
  });
});