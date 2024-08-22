import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import { RootState } from '../../redux/store.ts';
import CreateVacationModal from '../../components/off-works/CreateVacationModal.tsx';
import VacationsList from '../../components/off-works/VacationsList.tsx';

const UserVacationsPage = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const vacations = useSelector((state: RootState) => state.vacations.vacations);
    const [isModalVisible, setIsModalVisible] = React.useState(false);

    console.log(vacations)
    useEffect(() => {
        if (currentUser) {
            dispatch({ type: 'GET_USER_VACATIONS', payload: currentUser.id });
        }
    }, [dispatch, currentUser]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleCreate = (values: { startVacation: string; endVacation: string }) => {
        if (currentUser) {
            dispatch({ type: 'CREATE_VACATION_APPLICATION', payload: { userId: currentUser.id, ...values } });
        }
    };

    return (
        <div>
            <Button type="primary" onClick={showModal}>
                Apply for Vacation
            </Button>
            <VacationsList vacations={vacations} />
            <CreateVacationModal visible={isModalVisible} onCancel={handleCancel} onCreate={handleCreate} />
        </div>
    );
};

export default UserVacationsPage;