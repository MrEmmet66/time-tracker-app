import React, { useState } from 'react';
import { User } from '../models/user.ts';
import { Card, Dropdown, Menu, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { removeUser, updateUser } from '../redux/features/usersSlice.ts';
import CreateUserModal from './CreateUserModal';
import UserPermissionsModal from "./UserPermissionsModal.tsx";

interface UserItemProps {
    user: User;
}

const UserItem: React.FC<UserItemProps> = ({ user }) => {
    const dispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleMenuClick = (e: any) => {
        if (e.key === 'delete') {
            dispatch({ type: 'REMOVE_USER', payload: user.id })
        } else if (e.key === 'editPermissions') {
            setIsModalVisible(true);
        }
    };

    const handleUpdateUser = (values: any) => {
        const updatedUser = { ...user, ...values };
        dispatch({ type: 'UPDATE_USER', payload: updatedUser});
        setIsModalVisible(false);
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="editPermissions">Edit Permissions</Menu.Item>
            <Menu.Item key="delete">Delete User</Menu.Item>
        </Menu>
    );

    return (
        <>
            <Card
                title={`${user.firstName} ${user.lastName}`}
                extra={
                    <Dropdown menu={menu} trigger={['click']}>
                        <Button icon={<EllipsisOutlined />} />
                    </Dropdown>
                }
            >
                <p>Email: {user.email}</p>
                <p>First Name: {user.firstName}</p>
                <p>Last Name: {user.lastName}</p>
                <p>Permissions: {user.permissions}</p>
            </Card>
            <UserPermissionsModal
                visible={isModalVisible}
                onCreate={handleUpdateUser}
                onCancel={() => setIsModalVisible(false)}
                user={user}/>
        </>
    );
};

export default UserItem;