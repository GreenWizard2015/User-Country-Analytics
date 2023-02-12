// events slice that stores how many listeners are subscribed to each event (usersUpdates, countriesUpdates)
import { createAction, createSlice } from "@reduxjs/toolkit";

export const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    usersUpdates: 0,
    _usersVersion: null,
    countriesUpdates: 0
  },
  reducers: {
    // takes object and a flag (true/false).
    usersUpdates: (state, action) => {
      const { payload: { subscribe = true } = {} } = action;
      state.usersUpdates += subscribe ? 1 : -1;
    },
    // takes object and a flag (true/false).
    countriesUpdates: (state, action) => {
      const { payload: { subscribe = true } = {} } = action;
      state.countriesUpdates += subscribe ? 1 : -1;
    }
  }
});

export const actions = {
  ...eventsSlice.actions,
  invalidateAll: createAction("events/invalidateAll")
};
export const { usersUpdates, countriesUpdates, invalidateAll } = actions;