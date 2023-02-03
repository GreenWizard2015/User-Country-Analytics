import { createSlice } from '@reduxjs/toolkit';

export const UISlice = createSlice({
  name: 'UI',
  initialState: {
    dateFrom: null,
    dateTo: null,
    country: null,
    page: 1,
    totalPages: 0,
    perPage: 10
  },
  reducers: {
    setDateFrom: (state, action) => {
      state.dateFrom = action.payload;
    },
    setDateTo: (state, action) => {
      state.dateTo = action.payload;
    },
    setCountry: (state, action) => {
      state.country = action.payload;
    },
    setPage: (state, action) => {
      const page = action.payload;
      // should not be less than 1 and not greater than the number of pages
      state.page = Math.min(Math.max(page, 1), state.totalPages);
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
      // if the number of pages is less than the current page, set the current page to the first page
      if (state.totalPages < state.page) {
        state.page = 1;
      }
    },
    setPerPage: (state, action) => {
      state.perPage = action.payload;
    }
  }
});

export const actions = UISlice.actions;
export const { setDateFrom, setDateTo, setCountry, setPage, setTotalPages, setPerPage } = actions;