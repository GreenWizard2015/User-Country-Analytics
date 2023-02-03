import { createSlice } from '@reduxjs/toolkit';
import uuid from 'react-uuid';

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    addNotification: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (notification) => {
        return { payload: { ...notification, id: uuid() } };
      },
    },
    removeNotification: (state, action) => {
      return state.filter(notification => notification.id !== action.payload);
    },
  },
});

export const actions = notificationsSlice.actions;
export const { addNotification, removeNotification } = actions;