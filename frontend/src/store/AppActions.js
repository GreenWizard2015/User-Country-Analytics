// Contain high level actions that can be called from components via redux
import { push } from 'redux-first-history';
import UsersService from 'services/UsersService';

// dialog actions:
// AddUserDialog - triggers the add user modal
// ViewUserDialog - triggers the view user modal
// RemoveUserDialog - triggers the remove user modal
export const AddUserDialog = () => (dispatch) => {
  dispatch(push('/add'));
};

export const RemoveUserDialog = (id) => (dispatch) => {
  dispatch(push(`/remove/${id}`));
};
///////////////////////////////////////////////////////////////////////////////////////
export const goHome = () => (dispatch) => {
  dispatch(push('/'));
};

// trigger the process of creating a new user
export const createUser = (user) => async (dispatch) => {
  try {
    const { data } = await UsersService.createUser(user);
    return data;
  } finally {
    await dispatch(goHome());
  }
};

export const actions = {
  AddUserDialog, RemoveUserDialog,
  goHome, createUser
};