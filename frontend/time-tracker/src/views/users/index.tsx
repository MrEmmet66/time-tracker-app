import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";

import { RootState } from "../../redux/store";
import UsersList from "../../components/users/UsersList";
import CreateUserModal from "../../components/users/CreateUserModal";
import LayoutPage from "../../layouts/LayoutPage";

function UsersPage() {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch({ type: "GET_ALL_USERS" });
  }, [dispatch]);

  const handleCreateUser = (values: any) => {
    dispatch({ type: "CREATE_USER", payload: values });
  };
  return (
    <LayoutPage>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Create User
      </Button>
      <CreateUserModal
        visible={isModalVisible}
        onCreate={handleCreateUser}
        onCancel={() => setIsModalVisible(false)}
      />
      <UsersList users={users} />
    </LayoutPage>
  );
}

export default UsersPage;
