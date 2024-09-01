import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Pagination } from 'antd';
import { RootState } from '../../../redux/store';
import VacationItem from '../../../components/off-works/VacationItem';
import LayoutPage from '../../../layouts/LayoutPage';
import VacationFilter from "../../../components/off-works/VacationsFilter.tsx";

const AllVacationsPage: React.FC = () => {
    const dispatch = useDispatch();
    const vacations = useSelector((state: RootState) => state.vacations.vacations);
    const totalPages = useSelector((state: RootState) => state.vacations.totalPages);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const currentUser = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        dispatch({ type: 'GET_ALL_VACATIONS', payload: { page: currentPage } });
    }, [dispatch, currentPage, currentUser]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleStatusChange = (value: string) => {
        const status = value === 'all' ? null : value;
        setStatusFilter(status);
        setCurrentPage(1);
    };

    const filteredVacations = statusFilter
        ? vacations.filter(vacation => vacation.status === statusFilter)
        : vacations;

    return (
        <LayoutPage>
            <Row justify="center" align="middle" style={{ marginBottom: 20 }}>
                <h1>All Vacations</h1>
            </Row>
            <Row justify="center" style={{ marginBottom: 20 }}>
                <VacationFilter onFilterChange={handleStatusChange} />
            </Row>
            <div>
                {filteredVacations.map(vacation => (
                    <VacationItem key={vacation.id} vacation={vacation} />
                ))}
            </div>
            <Row justify="center" style={{ marginTop: 20 }}>
                <Pagination
                    current={currentPage}
                    total={totalPages * 10} // Assuming 10 items per page
                    pageSize={10}
                    onChange={handlePageChange}
                />
            </Row>
        </LayoutPage>
    );
};

export default AllVacationsPage;