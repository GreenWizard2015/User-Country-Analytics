import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { fireEvent, waitFor } from '@testing-library/react';
import renderWithProvider from 'utils/renderWithProvider';
import App from 'app';
import { addNotification } from 'store/notificationsSlice';
import { act } from 'react-dom/test-utils';

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
      rest.get('/api/countries', (req, res, ctx) => res(ctx.json([])))
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
    await browser.findByText('Save');
    expect(browser.getByText('Save')).toBeInTheDocument();
    expect(browser.store.getState().router.location.pathname).toBe('/add');
    // Cancel the creation of a new user
    fireEvent.click(browser.getByText('Cancel'));
    // 'Save' button is not present on the / page
    expect(browser.store.getState().router.location.pathname).toBe('/');
    expect(browser.queryByText('Save')).toBeNull();
  });

  it('should create a new user', async () => {
    // mock the api
    let userCreated = false;
    server.use(
      rest.post('/api/users', (req, res, ctx) => {
        userCreated = true;
        return res(ctx.json({}));
      }),
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.json({
          users: [{ id: 1, first_name: 'John', last_name: 'Doe', date_of_birth: '2000-01-02', country_name: 'USA', country_id: 1 }],
          totalPages: 1,
        }));
      })
    );
    ///////////////////////////////
    const browser = renderWithProvider(<App />);
    // wait for the / page to load and click the 'New user' button
    await browser.findByText('New user');
    fireEvent.click(browser.getByText('New user'));
    // wait for the /add page to load and fill in the form
    await browser.findByText('Save');
    fireEvent.change(browser.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(browser.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(browser.getByLabelText('Date of Birth'), { target: { value: '01-02-2000' } });
    fireEvent.change(browser.getByLabelText('Country'), { target: { value: 'new' } });
    fireEvent.change(browser.getByPlaceholderText('Enter new country name'), { target: { value: 'USA' } });
    // 'Save' button is enabled
    expect(browser.getByText('Save')).not.toBeDisabled();
    await act(async () => {
      fireEvent.click(browser.getByText('Save'));
    });
    expect(userCreated).toBe(true);

    // wait for the / page to load and check that the new user is present
    await browser.findByText('John Doe');
    expect(browser.store.getState().router.location.pathname).toBe('/');
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
  });

  false && it('should edit a user', async () => {
    // mock the api
    let userEdited = false;
    server.use(
      rest.put('/api/users/1', (req, res, ctx) => {
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
    // double click the user
    fireEvent.doubleClick(browser.getByText('John Doe'));
    // wait for the /edit page to load and fill in the form
    await browser.findByText('Save');
    fireEvent.change(browser.getByLabelText('First Name'), { target: { value: 'Jane' } });
    // 'Save' button is enabled
    expect(browser.getByText('Save')).not.toBeDisabled();
    await act(async () => {
      fireEvent.click(browser.getByText('Save'));
    });
    expect(userEdited).toBe(true);

    // wait for the / page to load and check that the user is edited
    await browser.findByText('Jane Doe');
    expect(browser.store.getState().router.location.pathname).toBe('/');
    expect(browser.getByText('Jane Doe')).toBeInTheDocument();
  });
});