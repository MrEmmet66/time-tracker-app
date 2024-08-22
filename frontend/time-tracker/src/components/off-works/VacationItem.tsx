import React from 'react';
import { Card, Tag } from 'antd';
import { Vacation } from '../../models/vacation';

interface VacationItemProps {
    vacation: Vacation;
}

const VacationItem: React.FC<VacationItemProps> = ({ vacation }) => {
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

    return (
        <Card title={`Vacation ID: ${vacation.id}`} className="vacation-item">
            <p>Start Date: {new Date(vacation.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(vacation.endDate).toLocaleDateString()}</p>
            <p>User: {vacation.user.firstName} {vacation.user.lastName}</p>
            <Tag color={getStatusColor(vacation.status)}>
                {vacation.status.toUpperCase()}
            </Tag>
        </Card>
    );
};

export default VacationItem;