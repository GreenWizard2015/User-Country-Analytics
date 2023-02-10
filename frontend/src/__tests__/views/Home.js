import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { waitFor } from '@testing-library/react';
import renderWithProvider from 'utils/renderWithProvider';
import Home from 'views/Home';

describe('Home View', () => {
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

  it('should fetch and display the correct data for each user', async () => {
    const users = [
      { id: 1, first_name: 'John', last_name: 'Doe', country_id: 1, date_of_birth: '1990-01-01' },
      { id: 2, first_name: 'Jane', last_name: 'Smith', country_id: 2, date_of_birth: '1995-05-05' },
      { id: 3, first_name: 'Bob', last_name: 'Johnson', country_id: 3, date_of_birth: '1985-10-10' },
    ];
    // Mock the API call
    server.use(
      rest.get('/api/users', (req, res, ctx) => res(ctx.json({ users, totalPages: 1 })))
    );
    /////////////////////////////////////////
    const browser = renderWithProvider(<Home />);

    const fullNames = users.map((user) => user.first_name + ' ' + user.last_name);
    // Wait for the data to be fetched and displayed
    await waitFor(() => browser.findByText(fullNames[0]));

    // Check that the correct data is displayed for each user
    fullNames.forEach((fullName) => {
      expect(browser.getByText(fullName)).toBeInTheDocument();
    });
  });

  it("should display a users chart when loaded", async () => {
    // Mock the API call
    server.use(
      rest.get("/api/countries", (req, res, ctx) => {
        return res(ctx.json(
          [{ id: 1, name: "USA", users_count: 10 },]
        ));
      })
    );

    // Render the Home component
    const browser = renderWithProvider(<Home />);

    // Wait for the chart to be rendered and check that it is displayed
    const chartSelector = "users-chart";
    await waitFor(() => browser.findByTestId(chartSelector));
    expect(browser.getByTestId(chartSelector)).toBeInTheDocument();
  });

  it('should call /api/users with the correct query parameters from the UI slice and set total pages', async () => {
    const UIParams = {
      // as unix timestamp
      dateFrom: new Date('1990-01-01').getTime(),
      dateTo: new Date('1995-05-05').getTime(),
      country: 1,
      page: 1,
      perPage: 10,
    };
    const totalPages = 10;
    // Mock the API call and store the query parameters to check them later, because the assertions in the mock handler are not executed
    let requestParams = {};
    server.use(
      rest.get('/api/users', async (req, res, ctx) => {
        req.url.searchParams.forEach((value, key) => {
          requestParams[key] = value;
        });

        return res(ctx.json({
          users: [
            { id: 1, first_name: 'John', last_name: 'Doe', country_id: 1, date_of_birth: '1990-01-01' },
          ],
          totalPages: totalPages,
        }));
      })
    );

    // Render the Home component
    const browser = renderWithProvider(<Home />, { UI: UIParams });

    // Wait for the data to be fetched and displayed
    await waitFor(() => browser.findByText('John Doe'));

    // Check request parameters
    expect(requestParams).toEqual({
      dateFrom: UIParams.dateFrom.toString(),
      dateTo: UIParams.dateTo.toString(),
      country: UIParams.country.toString(),
      page: UIParams.page.toString(),
      perPage: UIParams.perPage.toString(),
    });

    // Check that the total pages are set in the store
    const { store } = browser;
    expect(store.getState().UI.totalPages).toEqual(totalPages);
  });
});