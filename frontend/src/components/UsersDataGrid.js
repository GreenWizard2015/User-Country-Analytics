import React, { Component } from 'react';
import { Col, Container, Pagination, Row, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import storeActions from 'store/actions';
import UsersTable from './UsersTable';

export class UsersDataGrid extends Component {
  async componentDidMount() {
    await this.props.fetchUsers();
  }

  paginationArea() {
    const {
      UI: { page, totalPages },
      setPage,
    } = this.props;
    if (totalPages <= 1) return null;
    const visiblePages = [page];
    for (let d = 1; (d <= 5) && (visiblePages.length < 5); d++) {
      if (page - d > 1) visiblePages.unshift(page - d);
      if (page + d <= totalPages) visiblePages.push(page + d);
    }
    return (
      <Pagination className="my-auto">
        <Pagination.First onClick={() => setPage(1)} />

        {visiblePages.map((p) => (
          <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>
            {p}
          </Pagination.Item>
        ))}
        <Pagination.Last onClick={() => setPage(totalPages)} />
      </Pagination>
    );
  }

  perPageArea() {
    const {
      UI: { perPage },
      setPerPage,
    } = this.props;

    const options = [10, 25, 50, 100];
    return (
      <div className="d-flex justify-content-end align-items-center">
        <span>Pages per page:</span>
        <Form.Control as="select" value={perPage} onChange={e => setPerPage(e.target.value)} className="w-auto">
          {options.map((o) => (<option key={o} value={o}>{o}</option>))}
        </Form.Control>
      </div>
    );
  }

  usersTable() {
    const { users: { data }, viewUser, removeUser } = this.props;
    if (data.length === 0) return (
      <span className="text-muted text-center">No users found</span>
    );
    return (
      <UsersTable users={data} viewUser={viewUser} removeUser={removeUser} />
    );
  }

  addUser = e => {
    e.preventDefault();
    this.props.addUser();
  }

  render() {
    const { users: { loaded, error }, } = this.props;
    if (!loaded) return <h1>Loading...</h1>;
    if (error) return <h1>{error}</h1>;

    // React Bootstrap container with "Users" header, "Pages per page" dropdown at the right, table in the second row and pagination at the bottom
    return (
      <Container>
        <Row>
          <Col>
            <h1>Users</h1>
          </Col>
          <Col className="text-right">
            {this.perPageArea()}
          </Col>
        </Row>

        <Row className='border-bottom pb-3 border-top pt-3'>
          {this.usersTable()}
        </Row>

        <Row className="border-top pt-3">
          <Col className="d-flex justify-content-center">
            {this.paginationArea()}
          </Col>
          <Col className="flex-grow-0">
            <button className="btn btn-primary text-nowrap" onClick={this.addUser}>New user</button>
          </Col>
        </Row>

      </Container>
    );
  }
}

function requiredActions() {
  const { users: { fetchUsers }, UI: { setPage, setTotalPages, setPerPage }, actions: { AddUserDialog, RemoveUserDialog } } = storeActions;
  return { fetchUsers, setPage, setTotalPages, setPerPage, addUser: AddUserDialog, removeUser: RemoveUserDialog };
}

export default connect(
  state => ({
    users: state.users,
    UI: state.UI
  }),
  requiredActions()
)(UsersDataGrid);