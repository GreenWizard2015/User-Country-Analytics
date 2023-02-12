import React from "react";
import { useTable } from "react-table";

function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  age = age ?? 0;
  // force cast to string
  return age + "";
}

export default function UsersTable({ users, viewUser, removeUser }) {
  function makeHandler(f) {
    return (id) => {
      return (ev) => {
        ev.stopPropagation();
        f(id);
      };
    };
  }
  const onRowClick = React.useMemo(() => makeHandler(viewUser), [viewUser]);
  const onRemoveUser = React.useMemo(() => makeHandler(removeUser), [removeUser]);

  // memoize the users data and columns
  const data = React.useMemo(() => users, [users]);
  const columns = React.useMemo(() => [
    {
      Header: 'User',
      Cell: ({ row: { original: { first_name, last_name } } }) => <span>{first_name + ' ' + last_name}</span>
    },
    {
      Header: 'Country',
      accessor: 'country_name',
    },
    {
      Header: 'Age',
      Cell: ({ row: { original: { date_of_birth } } }) => <span>{calculateAge(date_of_birth)}</span>
    },
    {
      Header: () => <span className='float-end'>Actions</span>,
      id: 'UserActions',
      Cell: ({ row: { original: { id } } }) => <button className='btn btn-danger float-end' onClick={onRemoveUser(id)}>Remove</button>
    }
  ], [onRemoveUser]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} onClick={onRowClick(row.original.id)}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};