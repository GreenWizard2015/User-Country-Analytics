// User Service - This service is responsible for handling all the CRUD operations related to users, such as creating new users, reading existing users, updating existing users, and deleting users.
import axios from 'axios';
import { API_URL } from 'config';

function JSTimestampToPHPTimestamp(timestamp) {
  return Math.floor(timestamp / 1000);
}

export async function getUsers(params) {
  const { dateFrom = null, dateTo = null, ...restParams } = params || {};
  if (dateFrom) {
    restParams.dateFrom = JSTimestampToPHPTimestamp(dateFrom);
  }
  if (dateTo) {
    restParams.dateTo = JSTimestampToPHPTimestamp(dateTo);
  }

  const { data: { users, ...rest } } = await axios.get(`${API_URL}/users`, { params: restParams, });
  return {
    // convert PHP timestamp to JS timestamp, which is in milliseconds
    users: users.map(user => {
      const { date_of_birth, ...rest } = user;
      return {
        ...rest,
        date_of_birth: date_of_birth * 1000
      };
    }),
    ...rest
  };
};

function _prepareUser(user) {
  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  const { firstName, lastName, country, dateOfBirth } = user;
  //////////////////////////
  // asserts
  assert(typeof firstName === 'string', 'firstName should be a string');
  assert(typeof lastName === 'string', 'lastName should be a string');
  assert(typeof country === 'string', 'country should be a string');
  assert(typeof dateOfBirth === 'number', 'dateOfBirth should be a number');
  // strings should not be empty
  assert(0 < firstName.length, 'firstName should not be empty');
  assert(0 < lastName.length, 'lastName should not be empty');
  assert(0 < country.length, 'country should not be empty');
  //////////////////////////
  return {
    first_name: firstName,
    last_name: lastName,
    country_name: country,
    date_of_birth: JSTimestampToPHPTimestamp(dateOfBirth)
  };
}

// POST /users - This endpoint is used to create a new user in the database. The client should send the user information in the request body.
export async function createUser(user) {
  const response = await axios.post(
    `${API_URL}/users`,
    _prepareUser(user)
  );
  return response.data;
};

// DELETE /users/{id} - This endpoint is used to delete a specific user from the database. The {id} path parameter should be replaced with the id of the user you want to delete.
export async function removeUser(userId) {
  const response = await axios.delete(`${API_URL}/users/${userId}`);
  return response.data;
};

// GET /users/{id} - This endpoint is used to retrieve a specific user from the database. The {id} path parameter should be replaced with the id of the user you want to retrieve.
export async function getUser(userId) {
  const response = await axios.get(`${API_URL}/users/${userId}`);
  const { date_of_birth, ...user } = response.data;
  return {
    ...user,
    date_of_birth: new Date(date_of_birth * 1000)
  };
};

// PATCH /users/{id} - This endpoint is used to update a specific user in the database. The {id} path parameter should be replaced with the id of the user you want to update and the client should send the updated information in the request body.
export async function updateUser(userId, user) {
  const response = await axios.patch(
    `${API_URL}/users/${userId}`,
    _prepareUser(user)
  );
  return response.data;
};

const UsersService = { getUsers, createUser, removeUser, getUser, updateUser };
export default UsersService;