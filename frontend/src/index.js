import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppStore } from 'store';
import App from 'app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppStore>
      <App />
    </AppStore>
  </React.StrictMode>
);
