// Contain high level actions that can be called from components via redux
import { push } from 'redux-first-history';
import UsersService from 'services/UsersService';

export const AddUserDialog = () => (dispatch) => {
  dispatch(push('/add'));
};

export const ViewUserDialog = (id) => (dispatch) => {
  dispatch(push(`/user/${id}`));
};

export const RemoveUserDialog = (id) => (dispatch) => {
  dispatch(push(`/user/${id}/remove`));
};

export const EditUserDialog = (id) => (dispatch) => {
  dispatch(push(`/user/${id}/edit`));
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
  AddUserDialog, RemoveUserDialog, ViewUserDialog, EditUserDialog,
  goHome, createUser
};