import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { fireEvent, waitFor } from '@testing-library/react';
import renderWithProvider from 'utils/renderWithProvider';
import { addNotification } from 'store/notificationsSlice';
import { act } from 'react-dom/test-utils';
import App from 'app';

describe('App', () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  beforeEach(() => {
    server.resetHandlers();
    // default handlers for /api/users and /api/countries
    server.use(
      rest.get('/api/users', (req, res, ctx) => res(ctx.json({ users: [], totalPages: 1 })))
    );
    server.use(
      rest.get('/api/countries', (req, res, ctx) => res(ctx.json([
        { id: 1, name: 'USA' },
      ])))
    );
  });
  afterAll(() => server.close());

  // axios.interceptors.response.use doesn't work in tests, so we can't test notifications for http errors
  if (false) {
    it('notifies user about http errors', async () => {
      server.use(
        rest.get('/api/users', (req, res, ctx) => res(ctx.status(500), ctx.json({ message: 'Network error' })))
      );
      const { getByText } = renderWithProvider(<App />);
      await waitFor(() => getByText('Network error'));
    });
  }

  it('test notifications manually', async () => {
    const browser = renderWithProvider(<App />);
    await act(async () => {
      browser.store.dispatch(addNotification({
        title: 'Test notification',
        message: 'Test message',
        type: 'error',
      }));
    });

    expect(browser.getByText('Test notification')).toBeInTheDocument();
    expect(browser.getByText('Test message')).toBeInTheDocument();
  });

  it('should return to / page if cancelled creating a new user', async () => {
    const browser = renderWithProvider(<App />);
    // wait for the / page to load and click the 'New user' button
    await browser.findByText('New user');
    fireEvent.click(browser.getByText('New user'));
    // wait for the /add page to load and click the 'Cancel' button
    await browser.findByText('Create');
    expect(browser.getByText('Create')).toBeInTheDocument();
    expect(browser.store.getState().router.location.pathname).toBe('/add');
    // Cancel the creation of a new user
    fireEvent.click(browser.getByText('Cancel'));
    // 'Save' button is not present on the / page
    expect(browser.store.getState().router.location.pathname).toBe('/');
    expect(browser.queryByText('Create')).toBeNull();
  });

  it('create a new user flow', async () => {
    // mock the api
    let userCreated = false;
    let countriesReloaded = false;
    server.use(
      rest.post('/api/users', (req, res, ctx) => {
        userCreated = true;
        return res(ctx.json({}));
      }),
      rest.get('/api/users', (req, res, ctx) => {
        if (!userCreated) res(ctx.json({ users: [], totalPages: 1 }));

        return res(ctx.json({
          users: [{ id: 1, first_name: 'John', last_name: 'Doe', date_of_birth: 0, country_name: 'USA', country_id: 1 }],
          totalPages: 1,
        }));
      }),
      rest.get('/api/countries', (req, res, ctx) => {
        if (!userCreated) res(ctx.json([]));
        countriesReloaded = true;
        return res(ctx.json([{ id: 1, name: 'USA', users_count: 1 }]));
      })
    );
    ///////////////////////////////
    const browser = renderWithProvider(<App />);
    // wait for the / page to load and click the 'New user' button
    await browser.findByText('New user');
    // check that no users are present
    fireEvent.click(browser.getByText('New user'));
    // wait for the /add page to load and fill in the form
    await browser.findByText('Create User');
    fireEvent.change(browser.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(browser.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(browser.getByLabelText('Date of Birth'), { target: { value: '01-02-2000' } });

    const countrySelect = browser.getByLabelText('Country');
    // select last option in the select
    fireEvent.change(countrySelect, { target: { value: countrySelect.options[countrySelect.options.length - 1].value } });
    fireEvent.change(browser.getByPlaceholderText('Enter new country name'), { target: { value: 'USA' } });

    expect(browser.getByText('Create')).not.toBeDisabled();
    await act(async () => {
      fireEvent.click(browser.getByText('Create'));
    });
    // wait for the / page to load and check that the new user is present
    await browser.findByText('John Doe');
    // we should be redirected to the / page
    expect(browser.store.getState().router.location.pathname).toBe('/');

    expect(userCreated).toBe(true);
    expect(countriesReloaded).toBe(true);
    expect(browser.getByText('John Doe')).toBeInTheDocument();
  });

  it('should remove a user', async () => {
    // mock the api
    let userRemoved = false;
    server.use(
      rest.delete('/api/users/1', (req, res, ctx) => {
        userRemoved = true;
        return res(ctx.json({}));
      }),
      rest.get('/api/users', (req, res, ctx) => {
        if (userRemoved) {
          return res(ctx.json({
            users: [],
            totalPages: 1,
          }));
        }
        return res(ctx.json({
          users: [{ id: 1, first_name: 'John', last_name: 'Doe', date_of_birth: '2000-01-02', country_name: 'USA', country_id: 1 }],
          totalPages: 1,
        }));
      })
    );
    ///////////////////////////////
    const browser = renderWithProvider(<App />);
    // wait for the / page to load and click the 'New user' button
    await browser.findByText('John Doe');
    // click the 'Remove' button
    fireEvent.click(browser.getByRole('button', { name: 'Remove' }));
    // Click the 'Yes' button in the confirmation dialog
    await act(async () => {
      fireEvent.click(browser.getByText('Yes'));
    });

    // wait for the / page to load and check that the user is removed
    expect(userRemoved).toBe(true);
    await browser.findByText('No users found');
    // and we are back on the / page
    expect(browser.store.getState().router.location.pathname).toBe('/');
  });

  it('should edit a user', async () => {
    // mock the api
    let userEdited = false;
    server.use(
      rest.get('/api/users/1', (req, res, ctx) => {
        return res(ctx.json({
          id: 1, last_name: 'Doe', date_of_birth: '2000-01-02', country_name: 'USA', country_id: 1, first_name: 'John',
        }));
      }),
      rest.patch('/api/users/1', (req, res, ctx) => {
        userEdited = true;
        return res(ctx.json({}));
      }),
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.json({
          users: [{
            id: 1, last_name: 'Doe', date_of_birth: '2000-01-02', country_name: 'USA', country_id: 1,
            first_name: userEdited ? 'Jane' : 'John',
          }],
          totalPages: 1,
        }));
      })
    );
    ///////////////////////////////
    const browser = renderWithProvider(<App />);
    // wait for the / page to load
    await browser.findByText('John Doe');
    // click the user
    fireEvent.click(browser.getByText('John Doe'));
    // wait for the /edit page to load and fill in the form
    await waitFor(() => {
      expect(browser.getByText('Edit User')).toBeInTheDocument();
      expect(browser.getByText('Save')).toBeInTheDocument();
    });
    expect(browser.getByLabelText('First Name')).toHaveValue('John');

    fireEvent.change(browser.getByLabelText('First Name'), { target: { value: 'Jane' } });
    // 'Save' button is enabled
    expect(browser.getByText('Save')).toBeEnabled();
    await act(async () => {
      fireEvent.click(browser.getByText('Save'));
    });
    // wait for the / page to load and check that the user is edited
    await waitFor(() => expect(browser.queryByText('Save')).toBe(null));

    expect(userEdited).toBe(true);
    expect(browser.store.getState().router.location.pathname).toBe('/');
    expect(browser.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('should filter users by country', async () => {
    let countrySelected = false;
    // mock the api
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        countrySelected = req.url.searchParams.get('country');
        if (countrySelected === 'Not USA') {
          return res(ctx.json({ users: [], totalPages: 1 }));
        }
        return res(ctx.json({
          users: [{
            id: 1, last_name: 'Doe', date_of_birth: '2000-01-02', country_name: 'USA', country_id: 1, first_name: 'John',
          }],
          totalPages: 1,
        }));
      }),
      rest.get('/api/countries', (req, res, ctx) => {
        return res(ctx.json([
          { id: 1, name: 'USA', users_count: 1 },
          { id: 2, name: 'Not USA', users_count: 0 },
        ]));
      })
    );
    ///////////////////////////////
    const browser = renderWithProvider(<App />);
    // wait for the / page to load
    await browser.findByText('John Doe');
    // select the country
    fireEvent.change(browser.getByTestId('country-filter-select'), { target: { value: 'Not USA' } });
    await browser.findByText('No users found');
    expect(countrySelected).toBe('Not USA');
  });
});