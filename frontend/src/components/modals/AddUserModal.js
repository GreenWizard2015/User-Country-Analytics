import React from 'react';
import UserInfoModal from 'components/modals/shared/UserInfoModal';

export default (props) => {
  return (
    <UserInfoModal {...props} user={{ /* empty data */ }} title="Create User" saveText="Create" />
  );
}