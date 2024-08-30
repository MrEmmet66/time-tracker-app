// src/components/off-works/UserVacationList.tsx
import React from 'react';
import { List } from 'antd';
import { Vacation } from '../../models/vacation';
import UserVacationItem from './UserVacationItem';

interface UserVacationListProps {
    vacations: Vacation[];
}

const UserVacationList: React.FC<UserVacationListProps> = ({ vacations }) => {
    return (
        <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={vacations}
            renderItem={vacation => (
                <List.Item>
                    <UserVacationItem vacation={vacation} />
                </List.Item>
            )}
        />
    );
};

export default UserVacationList;