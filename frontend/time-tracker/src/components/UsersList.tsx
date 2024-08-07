import React from 'react';
import { User } from '../models/user.ts';
import UserItem from './UserItem';

interface UsersListProps {
    users: User[];
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
    return (
        <div>
            {users.map(user => (
                <UserItem key={user.id} user={user} />
            ))}
        </div>
    );
}

export default UsersList;