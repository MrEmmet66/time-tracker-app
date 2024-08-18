import {Table, Tag} from "antd";
import type {TablePaginationConfig, TableProps} from "antd";
import {User} from "../../models/user";
import {useEffect, useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {ELEMENTS_ON_PAGE} from "../../constants/pages.constants";
import UserEditModal from "./UserEditModal";

interface IProps {
    users: User[];
    totalPages: number;
}

interface DataType {
    key: number;
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    user: User;
}

interface TableParams {
    pagination?: TablePaginationConfig;
}

const columns: TableProps<DataType>["columns"] = [
    {
        title: "First Name",
        dataIndex: "firstName",
        key: "firstName",
    },
    {
        title: "Last Name",
        dataIndex: "lastName",
        key: "lastName",
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "Active",
        key: "active",
        dataIndex: "active",
        render: (_, {isActive}) => (
            <>
                <Tag color={isActive ? "green" : "red"}>{isActive ? "Yes" : "No"}</Tag>
            </>
        ),
    },
];

const UserTable = ({users, totalPages}: IProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const dispatch = useDispatch();
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: ELEMENTS_ON_PAGE,
            total: ELEMENTS_ON_PAGE * totalPages,
        },
    });

    useEffect(() => {
        setTableParams((prevTableParams) => {
            const newPagination = {
                ...prevTableParams.pagination,
                total: ELEMENTS_ON_PAGE * totalPages,
            };
            return {
                ...prevTableParams,
                pagination: newPagination,
            };
        });
    }, [totalPages]);

    useEffect(() => {
        if (!selectedUser) return;

        const user = users.find((user) => user.id === selectedUser.id);

        if (user) setSelectedUser(user);
    }, [users]);

    const tableData = useMemo(
        () =>
            users?.map((user) => ({
                key: user.id,
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isActive: user.isActive,
                user,
            })) ?? [],
        [users]
    );

    console.log({tableData, users, selectedUser});

    const handleTableChange = (pagination: TablePaginationConfig) => {
        setTableParams((prevTableParams) => ({
            ...prevTableParams,
            pagination,
        }));

        dispatch({
            type: "GET_ALL_USERS",
            payload: {page: pagination.current},
        });
    };

    const handleRowClick = (record: DataType) => {
        const user = users.find((u) => u.id === record.id) || null;
        setSelectedUser(user);
        setIsModalVisible(true);
    };

    const handleUpdateUser = (values: any) => {
        if (!selectedUser) return;

        const updatedUser = {...selectedUser, ...values};
        dispatch({type: "UPDATE_USER", payload: updatedUser});
        setIsModalVisible(false);
    };

    const handleUpdatePermissions = (values: any) => {
        if (!selectedUser) return;
        console.log({selectedUser});
        dispatch({
            type: "UPDATE_PERMISSIONS",
            payload: {id: selectedUser.id, permissions: values.permissions},
        });
        dispatch({
            type: "GET_ALL_USERS",
            payload: {page: tableParams.pagination?.current ?? 1},
        });
    };

    return (
        <>
            <Table
                columns={columns}
                dataSource={tableData}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
                rowHoverable
            />
            {selectedUser && (
                <UserEditModal
                    visible={isModalVisible}
                    onSave={handleUpdateUser}
                    onCancel={() => setIsModalVisible(false)}
                    user={selectedUser}
                    onUpdatePermission={handleUpdatePermissions}
                />
            )}
        </>
    );
};

export default UserTable;
