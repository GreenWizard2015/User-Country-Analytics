import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { waitFor } from '@testing-library/react';
import renderWithProvider from 'utils/renderWithProvider';
import Home from 'views/Home';

describe('Home', () => {
  const server = setupServer();
  
  beforeAll(() => server.listen());
  beforeEach(() => {
    server.resetHandlers();
    // default handlers for /api/users and /api/countries
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.json([]));
      })
    );
    server.use(
      rest.get('/api/countries', (req, res, ctx) => {
        return res(ctx.json([]));
      })
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
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.json(users));
      })
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

  it("should display a pie chart showing the number of users in each country", async () => {
    const countries = [
      { id: 1, name: "USA", users_count: 10 },
      { id: 2, name: "Canada", users_count: 20 },
      { id: 3, name: "Mexico", users_count: 15 },
    ];
    // Mock the API call
    server.use(
      rest.get("/api/countries", (req, res, ctx) => {
        return res(ctx.json(countries));
      })
    );

    // Render the Home component
    const browser = renderWithProvider(<Home />);

    // Wait for the pie chart to be displayed
    await waitFor(() => browser.findByTestId("users-chart"));
    const pieChart = await findByTestId("users-chart");

    // Check that the correct data is displayed in the pie chart
    countries.forEach((country) => {
      expect(pieChart).toHaveTextContent(`${country.name}: ${country.users_count}`);
    });
  });
});