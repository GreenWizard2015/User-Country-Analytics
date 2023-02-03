import React from 'react';
import ReactDOM from 'react-dom/client';
import Routers from 'routes/routers';
import { AppStore } from 'store';
import HttpErrorNotification from 'components/HttpErrorNotification';
// styles
import 'styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppStore>
      <HttpErrorNotification />
      <Routers />
    </AppStore>
  </React.StrictMode>
);
