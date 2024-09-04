import React, { useState } from 'react';
import { Card, Tag, Button } from 'antd';
import { Vacation } from '../../models/vacation';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";

interface VacationItemProps {
    vacation: Vacation;
}

const VacationItem: React.FC<VacationItemProps> = ({ vacation}) => {
    const [hovered, setHovered] = useState(false);
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.auth.user);

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

    const handleApprove = (id: string) => {
            dispatch({type: 'APPROVE_VACATION', payload: { id: id } });
    };

    const handleReject = (id: string) => {
            dispatch({type: 'REJECT_VACATION', payload: { id: id } });
    };

    return (
        <Card
            title={`Vacation`}
            className="vacation-item"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <p>Start Date: {new Date(vacation.startVacation).toLocaleDateString()}</p>
            <p>End Date: {new Date(vacation.endVacation).toLocaleDateString()}</p>
            <p>User: {vacation.user.firstName} {vacation.user.lastName}</p>
            <Tag color={getStatusColor(vacation.status)}>
                {vacation.status.toUpperCase()}
            </Tag>
            {hovered && vacation.status === 'waiting_for_approval' && currentUser
                && currentUser.id !== vacation.user.id && (
                <div style={{ marginTop: 10 }}>
                    <Button type="primary" onClick={() => handleApprove(vacation.id)} style={{ marginRight: 10 }}>
                        Approve
                    </Button>
                    <Button type="dashed" onClick={() => handleReject(vacation.id)}>
                        Reject
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default VacationItem;