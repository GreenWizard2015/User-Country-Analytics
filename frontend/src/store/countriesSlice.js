import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCountries = createAsyncThunk('countries/fetchCountries', async () => {
  const countries = [
    { id: 1, name: "USA", users_count: 10 },
    { id: 2, name: "Canada", users_count: 20 },
    { id: 3, name: "Mexico", users_count: 15 },
  ];
  return countries;
  const response = await axios.get('/api/countries');
  return response.data;
});

const INITIAL_STATE = {
  data: [],
  error: null,
  loaded: false,
};

const countriesSlice = createSlice({
  name: 'countries',
  initialState: INITIAL_STATE,
  reducers: {
    fetchCountries
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        return INITIAL_STATE;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loaded = true;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loaded = true;
        state.error = action.error;
        state.data = [];
      });
  }
});

export const countriesReducer = countriesSlice.reducer;
