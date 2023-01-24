import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { usersReducer } from "./usersSlice";
import { countriesReducer } from "./countriesSlice";

function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: {
      users: usersReducer,
      countries: countriesReducer,
    },
    preloadedState,
  });

  return store;
}

// AppStore is a wrapper component that provides the Redux store to the rest of the application.
// preloadedState is an optional parameter that allows you to pass in an initial state for the store.
const AppStore = ({ children, preloadedState = {} }) => {
  const store = configureAppStore(preloadedState);
  return <Provider store={store}>{children}</Provider>;
};

export { AppStore };