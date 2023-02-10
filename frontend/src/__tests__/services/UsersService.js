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

  it('should fetch users', async () => {
    const users = [
      { id: 1, first_name: 'John', last_name: 'Doe', country_id: 1, country_name: 'USA' },
      { id: 2, first_name: 'Jane', last_name: 'Doe', country_id: 1, country_name: 'USA' },
    ];
    const totalPages = 2;
    server.use(
      rest.get('/api/users', (req, res, ctx) => res(ctx.json({ users, totalPages })))
    );
    const response = await UsersService.getUsers();
    expect(response).toEqual({ users, totalPages });
  });

  it('should fetch a user data and convert to the correct format', async () => {
    const dateOfBirth = moment('01-02-2000', 'DD-MM-YYYY').toDate();
    server.use(
      rest.get('/api/users/13', (req, res, ctx) => {
        return res(ctx.json({
          id: 13, first_name: 'John', last_name: 'Doe', country_id: 1, country_name: 'USA', date_of_birth: dateOfBirth.getTime(),
        }));
      })
    );

    const response = await UsersService.getUser(13);
    expect(response).toEqual({
      id: 13, first_name: 'John', last_name: 'Doe', country_id: 1, country_name: 'USA', date_of_birth: dateOfBirth,
    });
  });

  it('should send a request to create a user in the correct format', async () => {
    const dateOfBirth = moment('01-02-2000', 'DD-MM-YYYY').toDate();
    let request;
    server.use(
      rest.post('/api/users', async (req, res, ctx) => {
        request = await req.json();
        return res(ctx.json({}));
      })
    );
    await UsersService.createUser({
      firstName: 'John', lastName: 'Doe', country: 'USA', dateOfBirth: dateOfBirth.getTime(),
    });

    expect(request).toEqual({
      first_name: 'John', last_name: 'Doe', country_name: 'USA', date_of_birth: dateOfBirth.getTime(),
    });
  });

  it('should send a request to edit a user in the correct format', async () => {
    const dateOfBirth = moment('01-02-2000', 'DD-MM-YYYY').toDate();
    let request;
    server.use(
      rest.patch('/api/users/13', async (req, res, ctx) => {
        request = await req.json();
        return res(ctx.json({}));
      })
    );
    await UsersService.updateUser(13, {
      firstName: 'John', lastName: 'Doe', country: 'USA', dateOfBirth: dateOfBirth.getTime(),
    });

    expect(request).toEqual({
      first_name: 'John', last_name: 'Doe', country_name: 'USA', date_of_birth: dateOfBirth.getTime(),
    });
  });
});