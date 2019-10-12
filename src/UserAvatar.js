import React from 'react';
import { withUser } from './UserContext';

const UserAvatar = ({ user, size }) => (
    <img
        className={`user-avatar ${size || ""}`}
        alt="user avatar"
        src={user.avatar}
    />
);

export default withUser(UserAvatar);