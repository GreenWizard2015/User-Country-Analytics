import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCountries } from 'services/CountriesService';

export const fetchCountries = createAsyncThunk('countries/fetchCountries', async () => {
  return await getCountries();
});

const INITIAL_STATE = {
  data: [],
  error: null,
  loaded: false,
};

export const countriesSlice = createSlice({
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
        state.error = action.error.message;
        state.data = [];
      });
  }
});

export const actions = { fetchCountries };