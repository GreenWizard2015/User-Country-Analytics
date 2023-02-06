// User Service - This service is responsible for handling all the CRUD operations related to users, such as creating new users, reading existing users, updating existing users, and deleting users.
import axios from 'axios';
import { API_URL } from 'config';

export async function getUsers(params) {
  const response = await axios.get(`${API_URL}/users`, { params: params });
  return response.data;
};

// POST /users - This endpoint is used to create a new user in the database. The client should send the user information in the request body.
export async function createUser(user) {
  const response = await axios.post(`${API_URL}/users`, { params: user });
  return response.data;
};

// DELETE /users/{id} - This endpoint is used to delete a specific user from the database. The {id} path parameter should be replaced with the id of the user you want to delete.
export async function removeUser(userId) {
  const response = await axios.delete(`${API_URL}/users/${userId}`);
  return response.data;
};

export default { getUsers, createUser, removeUser };