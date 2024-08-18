import {useEffect, useMemo, useState} from "react";

import {IWorkEntry} from "../../models/work-entry";
import {Table, TablePaginationConfig} from "antd";
import {convertSecondsToTime, formatTimeToString} from "../../utils/time";
import {ELEMENTS_ON_PAGE} from "../../constants/pages.constants";
import {useDispatch} from "react-redux";

interface IProps {
    workEntries: IWorkEntry[];
    totalPages?: number | null;
    userId: number;
}

interface TableParams {
    pagination?: TablePaginationConfig;
}

const columns = [
    {
        title: "Start",
        dataIndex: "start",
        key: "start",
    },
    {
        title: "End",
        dataIndex: "end",
        key: "end",
    },
    {
        title: "Total",
        dataIndex: "total",
        key: "total",
    },
];

const WorkEntriesTable = ({workEntries, totalPages, userId}: IProps) => {
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: ELEMENTS_ON_PAGE,
            total: ELEMENTS_ON_PAGE * (totalPages ?? 1),
        },
    });
    const dispatch = useDispatch();

    useEffect(() => {
        setTableParams({
            pagination: {
                ...(totalPages ? {total: ELEMENTS_ON_PAGE * totalPages} : {}),
            },
        });
    }, [totalPages]);

    const tableData = useMemo(
        () =>
            workEntries.map((workEntry, index) => {
                const startDateTime = new Date(workEntry.startDateTime);
                const endDateTime = new Date(workEntry.endDateTime);
                const totalSeconds =
                    (endDateTime.getTime() - startDateTime.getTime()) / 1000;
                const {hours, minutes} = convertSecondsToTime(totalSeconds);

                return {
                    key: index,
                    start: startDateTime.toLocaleString(),
                    end: endDateTime.toLocaleString(),
                    total: formatTimeToString(hours, minutes),
                };
            }),
        [workEntries]
    );

    const handleTableChange = (pagination: TablePaginationConfig) => {
        setTableParams((prevTableParams) => ({
            ...prevTableParams,
            pagination,
        }));

        if (!totalPages) return;

        dispatch({
            type: "GET_WORK_ENTRIES_BY_USER_ID",
            payload: {page: pagination.current, userId},
        });
    };

    return (
        <>
            <Table
                dataSource={tableData}
                columns={columns}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
            />
        </>
    );
};

export default WorkEntriesTable;
