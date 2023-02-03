import { render } from '@testing-library/react';
import { AppStore } from 'store';

const renderWithStore = (component, initialState = {}) => {
  const { store, provider } = AppStore({ children: component, preloadedState: initialState, returnStore: true });
  return {
    ...render(provider),
    store,
  };
};

export default renderWithStore;