// src/views/vacations/all/index.tsx
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
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const currentUser = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        dispatch({ type: 'GET_ALL_VACATIONS' });
    }, [dispatch, currentUser]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value === 'all' ? null : value);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const filteredVacations = statusFilter
        ? vacations.filter(vacation => vacation.status === statusFilter)
        : vacations;

    const paginatedVacations = filteredVacations.slice((currentPage - 1) * 10, currentPage * 10);

    return (
        <LayoutPage>
            <Row justify="center" align="middle" style={{ marginBottom: 20 }}>
                <h1>All Vacations</h1>
            </Row>
            <Row justify="center" style={{ marginBottom: 20 }}>
                <VacationFilter onFilterChange={handleStatusChange} />
            </Row>
            <div>
                {paginatedVacations.map(vacation => (
                    <VacationItem key={vacation.id} vacation={vacation} />
                ))}
            </div>
            <Row justify="center" style={{ marginTop: 20 }}>
                <Pagination
                    current={currentPage}
                    total={filteredVacations.length}
                    pageSize={10}
                    onChange={handlePageChange}
                />
            </Row>
        </LayoutPage>
    );
};

export default AllVacationsPage;