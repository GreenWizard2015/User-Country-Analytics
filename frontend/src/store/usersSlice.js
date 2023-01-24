import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('/api/users');
  return response.data;
});

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    fetchUsers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        return [];
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        // Handle the error state
      });
  }
});

export const usersReducer = usersSlice.reducer;
