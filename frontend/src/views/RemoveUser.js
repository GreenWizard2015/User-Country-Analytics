import { connect } from "react-redux";
import storeActions from 'store/actions';
import withParams from "utils/withParams";
import RemoveUserModal from "components/modals/RemoveUserModal";

function requiredActions() {
  const { actions: { goHome, }, users: { removeUser } } = storeActions;

  // make anonymous thunk action creator to remove user and go to the home page
  function onRemoveUser(userId) {
    return async function (dispatch) {
      try {
        await dispatch(removeUser(userId));
      } finally {
        await dispatch(goHome());
      }
    };
  }
  return { rejected: goHome, removeUser: onRemoveUser };
}
// just connect the component to the store and route
export default connect(null, requiredActions())(
  withParams(RemoveUserModal)
);