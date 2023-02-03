import { fireEvent, render, waitFor } from '@testing-library/react';
import { UsersDataGrid } from 'components/UsersDataGrid';

describe('UsersDataGrid', () => {
  const DEFAULT_PROPS = {
    users: {
      data: [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          country_name: 'USA',
          age: 25,
        },
        {
          id: 2,
          first_name: 'Jane',
          last_name: 'Doe',
          country_name: 'Canada',
          age: 23,
        },
      ],
      loaded: true,
      error: null,
    },
    UI: {
      page: 1,
      totalPages: 1,
      perPage: 10,
    },
    fetchUsers: async () => { },
    setPage: i => { },
    setTotalPages: i => { },
    setPerPage: i => { },
    viewUser: i => { },
    removeUser: i => { },
    addUser: () => { },
  };

  it('should render the table with the users', () => {
    const { container } = render(<UsersDataGrid {...DEFAULT_PROPS} />);
    const table = container.querySelector('table');
    expect(table).toHaveTextContent('John Doe');
    expect(table).toHaveTextContent('Jane Doe');
  });

  it('should render text "No users found" when there are no users', () => {
    const props = { ...DEFAULT_PROPS, users: { ...DEFAULT_PROPS.users, data: [] } };
    const { container } = render(<UsersDataGrid {...props} />);
    expect(container).toHaveTextContent('No users found');
  });

  it('should set the perPage to 100', () => {
    setPerPage = jest.fn();
    const props = { ...DEFAULT_PROPS, setPerPage };
    const { container } = render(<UsersDataGrid {...props} />);
    const select = container.querySelector('select');
    fireEvent.change(select, { target: { value: '100' } });
    expect(setPerPage).toHaveBeenCalledWith('100');
  });

  it('should call viewUser with the user id when clicking on the row', () => {
    const viewUser = jest.fn();
    const user = { id: 123, first_name: 'Test', last_name: 'User', country_name: 'USA', age: 25 };
    const props = { 
      ...DEFAULT_PROPS, 
      viewUser,
      users: { ...DEFAULT_PROPS.users, data: [...DEFAULT_PROPS.users.data, user] },
     };
    const { container } = render(<UsersDataGrid {...props} />);
    const row = container.querySelector('tr:nth-child(3)');
    fireEvent.click(row);
    expect(viewUser).toHaveBeenCalledWith(user.id);
  });

  it('should call removeUser with the user id when clicking on the remove button', () => {
    const removeUser = jest.fn();
    const user = { id: 123, first_name: 'Test', last_name: 'User', country_name: 'USA', age: 25 };
    const props = {
      ...DEFAULT_PROPS,
      removeUser,
      users: { ...DEFAULT_PROPS.users, data: [...DEFAULT_PROPS.users.data, user] },
    };
    const { container } = render(<UsersDataGrid {...props} />);
    const button = container.querySelector('tr:nth-child(3) button');
    fireEvent.click(button);
    expect(removeUser).toHaveBeenCalledWith(user.id);
  });

  it('should be add "New user" button that calls addUser', () => {
    const addUser = jest.fn();
    const props = { ...DEFAULT_PROPS, addUser };
    const { getByText } = render(<UsersDataGrid {...props} />);
    const button = getByText('New user');
    fireEvent.click(button);
    expect(addUser).toHaveBeenCalled();
  });

  // section for pagination tests
  describe('pagination', () => {
    it('should hide the pagination when there is only one page', () => {
      const props = { ...DEFAULT_PROPS, UI: { ...DEFAULT_PROPS.UI, totalPages: 1 } };
      const { container } = render(<UsersDataGrid {...props} />);
      const pagination = container.querySelector('.pagination');
      expect(pagination).toBeNull();
    });

    it('should show in the pagination 2 pages before and 2 pages after the current page', () => {
      const props = { ...DEFAULT_PROPS, UI: { ...DEFAULT_PROPS.UI, totalPages: 30, page: 15 } };
      const { container } = render(<UsersDataGrid {...props} />);
      const pagination = container.querySelector('.pagination');
      for (let i = 13; i <= 17; i++) {
        expect(pagination).toHaveTextContent(i);
      }
    });

    it('should show pages 1-5 when the current page is 1', () => {
      const props = { ...DEFAULT_PROPS, UI: { ...DEFAULT_PROPS.UI, totalPages: 30, page: 1 } };
      const { container } = render(<UsersDataGrid {...props} />);
      const pagination = container.querySelector('.pagination');
      for (let i = 1; i <= 5; i++) {
        expect(pagination).toHaveTextContent(i);
      }
    });

    it('should show pages 26-30 when the current page is 28', () => {
      const props = { ...DEFAULT_PROPS, UI: { ...DEFAULT_PROPS.UI, totalPages: 30, page: 28 } };
      const { container } = render(<UsersDataGrid {...props} />);
      const pagination = container.querySelector('.pagination');
      for (let i = 26; i <= 30; i++) {
        expect(pagination).toHaveTextContent(i);
      }
    });

    it('should call setPage when clicking on pagination', async () => {
      const setPage = jest.fn();
      const props = { ...DEFAULT_PROPS, setPage, UI: { ...DEFAULT_PROPS.UI, totalPages: 30 } };
      const { container, getByText } = render(<UsersDataGrid {...props} />);
      const last = getByText('Last');
      fireEvent.click(last);

      await waitFor(() => {
        expect(setPage).toHaveBeenCalledWith(30);
      });
    });
  });
});