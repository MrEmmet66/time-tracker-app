import React from 'react';
import { List } from 'antd';
import VacationItem from './VacationItem';
import { Vacation } from '../../models/vacation';

interface VacationsListProps {
    vacations: Vacation[];
}

const VacationsList: React.FC<VacationsListProps> = ({ vacations }) => {
    return (
        <List
            itemLayout="vertical"
            dataSource={vacations}
            renderItem={vacation => (
                <List.Item>
                    <VacationItem vacation={vacation} />
                </List.Item>
            )}
        />
    );
};

export default VacationsList;