import { render } from '@testing-library/react';
import { AppStore } from 'store';

const renderWithStore = (component, initialState = {}) => {
  return {
    ...render(
      <AppStore preloadedState={initialState}>
        {component}
      </AppStore>
    )
  };
};

export default renderWithStore;