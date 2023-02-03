import { configureStore } from "@reduxjs/toolkit";
import { createBrowserHistory } from "history";
import { Provider } from "react-redux";
import { createReduxHistoryContext } from "redux-first-history";
import { HistoryRouter } from "redux-first-history/rr6";

// slices
import { countriesSlice } from "./countriesSlice";
import { notificationsSlice } from "./notificationsSlice";
import { UISlice } from "./UISlice";
import { usersSlice } from "./usersSlice";

function storeWithHistory(reducers, initialState) {
  const { routerReducer, routerMiddleware, createReduxHistory } = createReduxHistoryContext({
    history: createBrowserHistory(),
  });

  const store = configureStore({
    reducer: {
      ...reducers,
      router: routerReducer,
    },
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(routerMiddleware),
  });
  const history = createReduxHistory(store);

  return { history, store };
}

function buildAppStore(preloadedState) {
  const slices = {
    users: usersSlice,
    countries: countriesSlice,
    notifications: notificationsSlice,
    UI: UISlice
  };

  const reducers = {};
  const state = {};
  Object.keys(slices).forEach(key => {
    reducers[key] = slices[key].reducer;
    const defaultState = slices[key].getInitialState();
    state[key] = defaultState;

    if (key in preloadedState) {
      // if default state is an object, merge it with the preloaded state
      if (typeof defaultState === 'object') {
        const preloadedStateForKey = preloadedState[key] || {};
        state[key] = { ...defaultState, ...preloadedStateForKey };
      } else { // otherwise, just use the preloaded state
        state[key] = preloadedState[key];
      }
    }
  });

  return { reducers, state };
}

// AppStore is a wrapper component that provides the Redux store to the rest of the application.
// preloadedState is an optional parameter that allows you to pass in an initial state for the store.
const AppStore = ({ children, preloadedState = {}, returnStore = false }) => {
  const { reducers, state } = buildAppStore(preloadedState);
  const { history, store } = storeWithHistory(reducers, state);
  const provider = (
    <Provider store={store}>
      <HistoryRouter history={history}>
        {children}
      </HistoryRouter>
    </Provider>
  );

  if (returnStore) return { store, provider };
  return provider;
};

export { AppStore };