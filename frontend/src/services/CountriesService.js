// Country Service - This service is responsible for handling all the CRUD operations related to countries, such as reading existing countries, updating existing countries, and deleting countries.
import axios from 'axios';
import { API_URL } from 'config';

async function getCountries() {
  const response = await axios.get(`${API_URL}/countries`);
  return response.data;
}

export {
  getCountries
};