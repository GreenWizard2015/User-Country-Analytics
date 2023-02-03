// centralizes all the actions to simplify the import
import { actions as usersActions } from 'store/usersSlice';
import { actions as countriesActions } from 'store/countriesSlice';
import { actions as UIActions } from 'store/UISlice';
import { actions as notificationsActions } from 'store/notificationsSlice';
import { push } from 'redux-first-history';

const actions = {
  users: usersActions,
  countries: countriesActions,
  UI: UIActions,
  notifications: notificationsActions,
  router: {
    navigateTo: push
  }
};
export default actions;