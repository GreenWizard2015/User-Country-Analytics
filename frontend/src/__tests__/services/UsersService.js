import moment from 'moment';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import UsersService from 'services/UsersService';

describe('Users Service', () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  beforeEach(() => {
    server.resetHandlers();
  });
  afterAll(() => server.close());

  function makeDate(date) {
    const dateOfBirth = moment(date, 'DD-MM-YYYY').toDate().getTime(); // JS timestamp not rounded
    const PHPTimestamp = Math.floor(dateOfBirth / 1000); // PHP timestamp rounded
    return {
      PHPTimestamp,
      JSTimestamp: PHPTimestamp * 1000,
      JSDate: new Date(PHPTimestamp * 1000),
    };
  }

  it('should fetch users', async () => {
    const dateOfBirth = makeDate('01-02-2000');
    function users(timestamp) { // populate users with the same date of birth
      return [
        { id: 1, first_name: 'John', last_name: 'Doe', country_id: 1, country_name: 'USA', date_of_birth: timestamp },
        { id: 2, first_name: 'Jane', last_name: 'Doe', country_id: 1, country_name: 'USA', date_of_birth: timestamp },
      ];
    }
    const totalPages = 2;
    server.use(
      rest.get('/api/users', (req, res, ctx) => res(ctx.json({ users: users(dateOfBirth.PHPTimestamp), totalPages })))
    );
    const response = await UsersService.getUsers();
    expect(response).toEqual({ users: users(dateOfBirth.JSTimestamp), totalPages });
  });

  it('should fetch a user data and convert to the correct format', async () => {
    const dateOfBirth = makeDate('01-02-2000');
    server.use(
      rest.get('/api/users/13', (req, res, ctx) => {
        return res(ctx.json({
          id: 13, first_name: 'John', last_name: 'Doe', country_id: 1, country_name: 'USA', date_of_birth: dateOfBirth.PHPTimestamp,
        }));
      })
    );

    const response = await UsersService.getUser(13);
    expect(response).toEqual({
      id: 13, first_name: 'John', last_name: 'Doe', country_id: 1, country_name: 'USA', date_of_birth: dateOfBirth.JSDate,
    });
  });

  it('should send a request to create a user in the correct format', async () => {
    const dateOfBirth = makeDate('21-02-2000');
    let request;
    server.use(
      rest.post('/api/users', async (req, res, ctx) => {
        request = await req.json();
        return res(ctx.json({}));
      })
    );
    await UsersService.createUser({
      firstName: 'John', lastName: 'Doe', country: 'USA', dateOfBirth: dateOfBirth.JSTimestamp,
    });

    expect(request).toEqual({
      first_name: 'John', last_name: 'Doe', country_name: 'USA', date_of_birth: dateOfBirth.PHPTimestamp,
    });
  });

  it('should send a request to edit a user in the correct format', async () => {
    const dateOfBirth = makeDate('21-02-2000');
    let request;
    server.use(
      rest.patch('/api/users/13', async (req, res, ctx) => {
        request = await req.json();
        return res(ctx.json({}));
      })
    );
    await UsersService.updateUser(13, {
      firstName: 'John', lastName: 'Doe', country: 'USA', dateOfBirth: dateOfBirth.JSTimestamp,
    });

    expect(request).toEqual({
      first_name: 'John', last_name: 'Doe', country_name: 'USA', date_of_birth: dateOfBirth.PHPTimestamp,
    });
  });

  it('should receive a timestamp in PHP format but return it in JS format', async () => {
    const dateOfBirth = makeDate('16-02-2000');
    server.use(
      rest.get('/api/users/13', (req, res, ctx) => {
        return res(ctx.json({
          id: 13, first_name: 'John', last_name: 'Doe', country_id: 1, country_name: 'USA', date_of_birth: dateOfBirth.PHPTimestamp,
        }));
      })
    );

    const response = await UsersService.getUser(13);
    expect(response.date_of_birth).toEqual(dateOfBirth.JSDate);
  });
});