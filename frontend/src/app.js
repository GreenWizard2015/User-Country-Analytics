// Almoost whole app is here, except for the intaialization of the store, root div, etc. Used to test the whole app.
import HttpErrorNotification from "components/HttpErrorNotification";
import Routers from "routes/routers";

// styles
import 'styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <>
      <HttpErrorNotification />
      <Routers />
    </>
  );
}