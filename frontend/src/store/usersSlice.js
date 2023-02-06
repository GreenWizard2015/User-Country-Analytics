import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import UsersService from 'services/UsersService';
import { setTotalPages } from 'store/UISlice';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, thunkAPI) => {
  const { UI: { dateFrom, dateTo, country, page, perPage } } = thunkAPI.getState();
  const response = await UsersService.getUsers({ dateFrom, dateTo, country, page, perPage });
  // set the total number of pages by dispatching the setTotalPages action
  thunkAPI.dispatch(setTotalPages(response.totalPages));
  return response;
});

// removeUser
export const removeUser = createAsyncThunk('users/removeUser', async (id, thunkAPI) => {
  await UsersService.removeUser(id);

  // fetch users again
  await thunkAPI.dispatch(fetchUsers());
});

const INITIAL_STATE = {
  data: [],
  loaded: false,
  error: null
};

export const usersSlice = createSlice({
  name: 'users',
  initialState: INITIAL_STATE,
  reducers: {
    fetchUsers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        return INITIAL_STATE;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.data = action.payload.users;
        state.loaded = true; 
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loaded = true;
        state.error = action.error.message;
        state.data = [];
      });
    // for removeUser
    builder
      .addCase(removeUser.pending, (state) => {
        return INITIAL_STATE;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        // ignore the response because we already fetched users again
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.loaded = true;
        state.error = action.error.message;
        state.data = [];
      });
  }
});

export const actions = { fetchUsers, removeUser };