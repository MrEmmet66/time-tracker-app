import React from "react";
import {User} from "../../models/user.ts";
import UserItem from "./UserItem";

interface UsersListProps {
    users: User[];
}

const UsersList: React.FC<UsersListProps> = ({users}) => {
    console.log(users);
    return (
        <div className="my-10 space-y-4">
            {users.map((user) => (
                <UserItem key={user.id.toString()} user={user}/>
            ))}
        </div>
    );
};

export default UsersList;
