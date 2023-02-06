import { connect } from "react-redux";
import storeActions from 'store/actions';
import withParams from "utils/withParams";
import RemoveUserModal from "components/modals/RemoveUserModal";

function requiredActions() {
  const { actions: { goHome, }, users: { removeUser } } = storeActions;
  return { rejected: goHome, removeUser };
}
// just connect the component to the store and route
export default connect(null, requiredActions())(
  withParams(RemoveUserModal)
);