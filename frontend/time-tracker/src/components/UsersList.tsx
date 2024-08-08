import React from 'react';
import { User } from '../models/user.ts';
import UserItem from './UserItem';

interface UsersListProps {
    users: User[];
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
    if (!users || users.length === 0) {
        return <p></p>;
    }
    console.log(users)
    return (
        <>
            {users.map(user => (
                <UserItem key={user.id.toString()} user={user} />
            ))}
        </>
    );
}

export default UsersList;