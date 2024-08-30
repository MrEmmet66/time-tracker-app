// src/components/off-works/VacationFilter.tsx
import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface VacationFilterProps {
    onFilterChange: (status: string) => void;
}

const VacationFilter: React.FC<VacationFilterProps> = ({ onFilterChange }) => {
    return (
        <Select
            placeholder="Filter by status"
            onChange={onFilterChange}
            style={{ width: 200, marginBottom: 20 }}
        >
            <Option value="all">All</Option>
            <Option value="approved">Approved</Option>
            <Option value="waiting_for_approval">Waiting for Approval</Option>
            <Option value="rejected">Rejected</Option>
        </Select>
    );
};

export default VacationFilter;