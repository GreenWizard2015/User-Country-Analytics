// User Service - This service is responsible for handling all the CRUD operations related to users, such as creating new users, reading existing users, updating existing users, and deleting users.
import axios from 'axios';
import { API_URL } from 'config';

async function getUsers(params) {
  const response = await axios.get(`${API_URL}/users`, { params: params });
  return response.data;
}

export {
  getUsers
};