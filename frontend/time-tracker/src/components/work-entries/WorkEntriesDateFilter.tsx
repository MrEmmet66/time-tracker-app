// src/components/work-entries/WorkEntriesDateFilter.tsx

import React, { useState } from 'react';
import { DatePicker } from 'antd';
import { Dayjs } from 'dayjs';
import styles from './WorkEntriesDateFilter.module.css'

interface WorkEntriesDateFilterProps {
    onDateSelect: (startDate: Dayjs | null, endDate: Dayjs | null) => void;
}

const WorkEntriesDateFilter: React.FC<WorkEntriesDateFilterProps> = ({ onDateSelect }) => {
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [selectCount, setSelectCount] = useState(0);

    const handleStartDateChange = (date: Dayjs | null) => {
        setStartDate(date);
        setSelectCount(prevCount => prevCount + 1);
        if (selectCount + 1 >= 2) {
            onDateSelect(date, endDate);
        }
        console.log(selectCount)
    };

    const handleEndDateChange = (date: Dayjs | null) => {
        setEndDate(date);
        setSelectCount(prevCount => prevCount + 1);
        if (selectCount + 1 >= 1) {
            onDateSelect(startDate, date);
        }
        console.log(selectCount)
    };

    return (
        <div>
            <div className={styles.container}>
                <DatePicker placeholder="Start Date" onChange={handleStartDateChange}/>
                <DatePicker placeholder="End Date" onChange={handleEndDateChange}/>
            </div>
        </div>
    );
};

export default WorkEntriesDateFilter;