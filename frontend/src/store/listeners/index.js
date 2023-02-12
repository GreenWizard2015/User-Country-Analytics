import { createListenerMiddleware } from "@reduxjs/toolkit";
import { fetchCountries } from "store/countriesSlice";
import { invalidateAll } from "store/events";
import { fetchUsers } from "store/usersSlice";

function _getSettings(state) {
  const { UI: { dateFrom, dateTo, country, page, perPage } } = state;
  return { dateFrom, dateTo, country, page, perPage };
}

function createListener() {
  const eventsListener = createListenerMiddleware({});

  // listen to events.usersUpdates and fetch users when it changes
  eventsListener.startListening({
    predicate: (action, state, prevState) => {
      if (state.events.usersUpdates <= 0) return false; // no listeners
      if (prevState.events.usersUpdates === 0) return true; // first time always fetch
      if (invalidateAll.match(action)) return true; // invalidateAll action always fetch

      const settings = _getSettings(state);
      const prevSettings = _getSettings(prevState);

      return Object.keys(settings).some((key) => settings[key] !== prevSettings[key]);
    },
    effect: async (action, listenerApi) => {
      await listenerApi.dispatch(fetchUsers());
    }
  });

  // listen to events.countriesUpdates and fetch countries when it invalidates or at first subscription
  eventsListener.startListening({
    predicate: (action, state, prevState) => {
      if (state.events.countriesUpdates <= 0) return false; // no listeners
      if (prevState.events.countriesUpdates === 0) return true; // first time always fetch
      if (invalidateAll.match(action)) return true; // invalidateAll action always fetch
      return false;
    },
    effect: async (action, listenerApi) => {
      await listenerApi.dispatch(fetchCountries());
    }
  });

  return eventsListener;
}

export const eventsListener = createListener();