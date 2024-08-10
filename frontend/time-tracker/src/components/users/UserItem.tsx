import React, { useState } from "react";
import { User } from "../../models/user.ts";
import { Card } from "antd";
import { useDispatch } from "react-redux";
import UserEditModal from "./UserEditModal.tsx";

interface UserItemProps {
  user: User;
}

const UserItem: React.FC<UserItemProps> = ({ user }) => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleUpdateUser = (values: any) => {
    const updatedUser = { ...user, ...values };
    dispatch({ type: "UPDATE_USER", payload: updatedUser });
    setIsModalVisible(false);
  };

  return (
    <>
      <Card
        hoverable={true}
        title={`${user.firstName} ${user.lastName}`}
        onClick={() => setIsModalVisible(true)}
      >
        <p>Email: {user.email}</p>
        <p>First Name: {user.firstName}</p>
        <p>Last Name: {user.lastName}</p>
      </Card>
      <UserEditModal
        visible={isModalVisible}
        onSave={handleUpdateUser}
        onCancel={() => setIsModalVisible(false)}
        user={user}
      />
    </>
  );
};

export default UserItem;
