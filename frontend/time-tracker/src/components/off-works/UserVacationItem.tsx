// src/components/off-works/UserVacationItem.tsx
import React from 'react';
import { Card, Tag } from 'antd';
import { Vacation } from '../../models/vacation';

interface UserVacationItemProps {
    vacation: Vacation;
}

const UserVacationItem: React.FC<UserVacationItemProps> = ({ vacation }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'green';
            case 'waiting_for_approval':
                return 'orange';
            case 'rejected':
                return 'red';
            default:
                return 'gray';
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    return (
        <Card title={`Vacation`} className="vacation-item">
            <p>Start Date: {formatDate(vacation.startVacation)}</p>
            <p>End Date: {formatDate(vacation.endVacation)}</p>
            <Tag color={getStatusColor(vacation.status)}>
                {vacation.status.toUpperCase()}
            </Tag>
        </Card>
    );
};

export default UserVacationItem;