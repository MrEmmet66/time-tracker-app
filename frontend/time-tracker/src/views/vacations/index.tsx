// src/views/vacations/index.tsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Row, Col } from 'antd';
import { RootState } from '../../redux/store.ts';
import CreateVacationModal from '../../components/off-works/CreateVacationModal.tsx';
import LayoutPage from "../../layouts/LayoutPage.tsx";
import VacationFilter from "../../components/off-works/VacationsFilter.tsx";
import UserVacationList from "../../components/off-works/UserVacationList.tsx";
import {useNavigate} from "react-router-dom";
import {PAGES} from "../../constants/pages.constants.ts";

const UserVacationsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const vacations = useSelector((state: RootState) => state.vacations.vacations);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [filteredVacations, setFilteredVacations] = useState(vacations);

    useEffect(() => {
        if (!currentUser) {
            navigate(PAGES.LOGIN)
        }
    }, [navigate, currentUser]);
    
    useEffect(() => {
        if (currentUser) {
            dispatch({ type: 'GET_USER_VACATIONS', payload: { userId: currentUser.id } });
        }
    }, [dispatch, currentUser]);

    useEffect(() => {
        setFilteredVacations(vacations);
    }, [vacations]);

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

    const handleFilterChange = (status: string) => {
        if (status === 'all') {
            setFilteredVacations(vacations);
        } else {
            setFilteredVacations(vacations.filter(vacation => vacation.status === status));
        }
    };

    return (
        <LayoutPage>
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                <Col>
                    <Button type="primary" onClick={showModal}>
                        Apply for Vacation
                    </Button>
                </Col>
                <Col>
                    <VacationFilter onFilterChange={handleFilterChange} />
                </Col>
            </Row>
            <UserVacationList vacations={filteredVacations} />
            <CreateVacationModal visible={isModalVisible} onCancel={handleCancel} onCreate={handleCreate} />
        </LayoutPage>
    );
};

export default UserVacationsPage;