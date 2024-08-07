import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import { RootState } from '../../redux/store';
import UsersList from '../../components/UsersList';
import CreateUserModal from '../../components/CreateUserModal';

function UsersPage() {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.users.users);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        dispatch({type: 'GET_ALL_USERS'});
    }, []);

    const handleCreateUser = (values: any) => {
        dispatch({type: 'CREATE_USER', payload: values});
    };
    return (
        <>
            <Button
                type="primary"
                onClick={() => setIsModalVisible(true)}
            >
                Create User
            </Button>
            <UsersList users={users} />
            <CreateUserModal
                visible={isModalVisible}
                onCreate={handleCreateUser}
                onCancel={() => setIsModalVisible(false)}
            />
        </>
    );
}

export default UsersPage;