import { act, render, waitFor } from '@testing-library/react';
import moment from 'moment/moment';
import withUserModalUI from 'utils/withUserModalUI';
import { EditUser } from 'views/EditUser';

describe('Edit User View', () => {
  const DEFAULT_RESPONSE = {
    // in the server raw format
    id: 1, first_name: 'John', last_name: 'Doe', country_id: 1, country_name: 'USA',
    date_of_birth: moment('01-02-2000', 'DD-MM-YYYY').toDate().getTime(),
  };
  const DEFAULT_PROPS = {
    countries: {
      data: [{ id: 1, name: 'USA' },],
      loaded: true
    },
    userId: 1,
    goHome: () => { },
    updateUser: () => { },
    fetchUser: () => DEFAULT_RESPONSE,
  };

  async function renderEditUser(props = {}) {
    let browser;
    await act(async () => {
      props = { ...DEFAULT_PROPS, ...props };
      browser = render(<EditUser {...props} />);
    });
    return withUserModalUI(browser);
  }

  it('should show "Loading..." while fetching countries', async () => {
    const browser = await renderEditUser({ countries: { data: [], loaded: false } });
    expect(browser.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show "Loading..." while fetching user', async () => {
    let finished = false;
    let started = false;
    const browser = await renderEditUser({
      fetchUser: async () => {
        started = true;
        // pending
        while (!finished) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
        return DEFAULT_RESPONSE;
      }
    });
    await waitFor(() => expect(started).toBe(true));
    expect(browser.getByText('Loading...')).toBeInTheDocument();
    finished = true;
    await waitFor(() => expect(browser.UI.firstName()).toBeInTheDocument());
  });

  it('should fetch user when mounted', async () => {
    const fetchUser = jest.fn(() => DEFAULT_RESPONSE);
    await renderEditUser({ fetchUser, userId: 123 });
    expect(fetchUser).toHaveBeenCalledWith(123);
  });

  it('should show "Edit User" modal when user is loaded with proper fields', async () => {
    const { UI, getByText } = await renderEditUser({
      fetchUser: () => DEFAULT_RESPONSE,
    });

    expect(getByText('Edit User')).toBeInTheDocument();
    expect(UI.firstName()).toHaveValue('John');
    expect(UI.lastName()).toHaveValue('Doe');
    expect(UI.country()).toHaveValue('USA');
    expect(UI.dateOfBirth()).toHaveValue('01-02-2000');
  });
});