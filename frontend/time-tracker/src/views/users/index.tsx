import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "antd";

import {RootState} from "../../redux/store";
import CreateUserModal from "../../components/users/CreateUserModal";
import LayoutPage from "../../layouts/LayoutPage";
import {PERMISSIONS} from "../../constants/permissions.constants";
import {usePermissionCheck} from "../../hooks/use-permissions-check";
import UserTable from "../../components/users/UserTable";

function UsersPage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const {users, totalPages} = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch();

    usePermissionCheck(PERMISSIONS.MANAGE_ALL_MEMBERS);

    useEffect(() => {
        dispatch({type: "GET_ALL_USERS"});
    }, [dispatch]);

    const handleCreateUser = (values: any) => {
        dispatch({type: "CREATE_USER", payload: values});
        setIsModalVisible(false)
    };

    console.log({totalPages, users});

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
            <div className="my-10 space-y-5">
                <UserTable users={users} totalPages={totalPages}/>
            </div>
        </LayoutPage>
    );
}

export default UsersPage;
