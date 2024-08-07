import {User} from "../models/user.ts";

interface UserPermissionModalProps {
    visible: boolean;
    user: User;
    onCreate: (values: any) => void;
    onCancel: () => void;
}

import React from 'react';

const UserPermissionsModal: React.FC<UserPermissionModalProps> = ({visible, user, onCreate, onCancel}) => {
    return (
        <div></div>
    );
}

export default UserPermissionsModal;