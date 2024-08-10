import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";

import {RootState} from "../../redux/store";
import UsersList from "../../components/users/UsersList";
import CreateUserModal from "../../components/users/CreateUserModal";
import LayoutPage from "../../layouts/LayoutPage";
import {jwtDecode} from "jwt-decode";
import {getToken} from "../../utils/token";
import {PAGES} from "../../constants/pages.constants";
import {IPermission, User} from "../../models/user";
import {PERMISSIONS} from "../../constants/permissions.constants";
import {userHasAccess} from "../../utils/user";

function UsersPage() {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.users.users);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const user: User = jwtDecode(getToken());

            if (user) {
                const permissions: IPermission[] = JSON.parse(
                    user.permissions.toString().toLowerCase()
                );
                const haveAccess = userHasAccess(
                    permissions,
                    PERMISSIONS.MANAGE_ALL_MEMBERS
                );

                if (!haveAccess) {
                    navigate(PAGES.HOME);
                }
            }
        } catch {
            navigate(PAGES.LOGIN);
        }
    }, [navigate]);

    useEffect(() => {
        dispatch({type: "GET_ALL_USERS"});
    }, [dispatch]);

    const handleCreateUser = (values: any) => {
        dispatch({type: "CREATE_USER", payload: values});
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
            <UsersList users={users}/>
        </LayoutPage>
    );
}

export default UsersPage;
