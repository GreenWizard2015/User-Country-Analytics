import React from 'react';
import UserInfoModal from 'components/modals/shared/UserInfoModal';

export default ({ user, ...props }) => {
  return (
    <UserInfoModal {...props} user={user} title="Edit User" />
  );
}