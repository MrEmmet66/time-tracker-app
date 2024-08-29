import React from 'react';
import { List } from 'antd';
import VacationItem from './VacationItem';
import { Vacation } from '../../models/vacation';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";

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