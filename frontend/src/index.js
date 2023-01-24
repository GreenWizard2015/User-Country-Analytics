import React from 'react';
import ReactDOM from 'react-dom/client';
import Routers from 'routes/routers';
import { AppStore } from 'store';
// styles
import 'styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppStore>
      <Routers />
    </AppStore>
  </React.StrictMode>
);
