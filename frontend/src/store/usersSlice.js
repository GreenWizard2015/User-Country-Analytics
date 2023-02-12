import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import UsersService from 'services/UsersService';
import { setTotalPages } from 'store/UISlice';
import { invalidateAll } from './events';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, thunkAPI) => {
  const { UI: { dateFrom, dateTo, country, page, perPage } } = thunkAPI.getState();
  const response = await UsersService.getUsers({ dateFrom, dateTo, country, page, perPage });
  // set the total number of pages by dispatching the setTotalPages action
  thunkAPI.dispatch(setTotalPages(response.totalPages));
  return response;
});

// removeUser simple thunk
export const removeUser = (id) => async (dispatch) => {
  await UsersService.removeUser(id);
  await dispatch(invalidateAll());
};

// updateUser(userId, data) simple thunk
export const updateUser = (userId, data) => async (dispatch) => {
  await UsersService.updateUser(userId, data);
  await dispatch(invalidateAll());
};

// fetchUser(userId) simple thunk
export const fetchUser = (userId) => async (dispatch) => {
  const response = await UsersService.getUser(userId);
  return response;
};

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
  }
});

export const actions = { fetchUsers, removeUser, updateUser, fetchUser };