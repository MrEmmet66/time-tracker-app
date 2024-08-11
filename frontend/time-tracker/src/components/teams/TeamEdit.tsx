import {useMemo, useState} from "react";
import {Button, Form, Modal, Select, Flex, Table, Space} from "antd";
import type {TableProps} from "antd";
import Input from "antd/es/input/Input";

import {ITeam} from "../../models/team";
import {User} from "../../models/user";
import {useDispatch} from "react-redux";

interface CreateUserModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onSave: (team: ITeam) => void;
    team: ITeam;
    users: User[];
}

interface IDataType {
    key: number;
    name: string;
    email: string;
}

const TeamEdit = ({
                      isOpen,
                      onCancel,
                      onSave,
                      team,
                      users,
                  }: CreateUserModalProps) => {
    const [selectedUserId, setSelectedUserId] = useState();
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const usersOptions = useMemo(() => {
        if (team?.members?.length) {
            const uniqueUsers = [...team.members, ...users].filter(
                (item, index, self) =>
                    self.findIndex((el) => el.id === item.id) === index &&
                    self.filter((el) => el.id === item.id).length === 1
            );

            return uniqueUsers.map((user) => ({
                label: `${user.firstName} ${user.lastName}`,
                value: user.id,
            }));
        }

        return users.map((user) => ({
            label: `${user.firstName} ${user.lastName}`,
            value: user.id,
        }));
    }, [users, team?.members]);

    const dataTable = useMemo(() => {
        return (
            team?.members?.map((member) => ({
                key: member.id,
                name: `${member.firstName} ${member.lastName}`,
                email: member.firstName,
            })) ?? []
        );
    }, [team?.members]);

    const columns: TableProps<IDataType>["columns"] = useMemo(
        () => [
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Email",
                dataIndex: "email",
                key: "email",
            },
            {
                title: "Action",
                key: "action",
                render: (_, item) => (
                    <Space size="middle">
                        <Button onClick={() => handleRemoveUserFromTeam(item.key)} danger>
                            Remove
                        </Button>
                    </Space>
                ),
            },
        ],
        []
    );

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                form.resetFields();
                onSave(values);
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    const handleAddUserToTeam = () => {
        if (!selectedUserId) return;
        dispatch({
            type: "ADD_USER_TO_TEAM",
            payload: {teamId: team.id, userId: selectedUserId},
        });
    };

    const handleRemoveUserFromTeam = (userId: number) => {
        dispatch({
            type: "REMOVE_USER_FROM_TEAM",
            payload: {teamId: team.id, userId},
        });
    };

    return (
        <Modal
            open={isOpen}
            title="Edit team"
            okText="Edit"
            cancelText="Cancel"
            onOk={handleOk}
            onCancel={onCancel}
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Team name">
                    <Input value={team.name} disabled/>
                </Form.Item>
                <Form.Item label="Add member">
                    <Flex flex={"flex"} gap={8}>
                        <Select
                            showSearch
                            placeholder="Select a person"
                            optionFilterProp="label"
                            onSelect={setSelectedUserId}
                            options={usersOptions}
                        />
                        <Button
                            type="primary"
                            onClick={handleAddUserToTeam}
                            disabled={!selectedUserId}
                        >
                            Add
                        </Button>
                    </Flex>
                </Form.Item>
            </Form>
            <div className="my-5">
                <Table columns={columns} dataSource={dataTable}/>
            </div>
        </Modal>
    );
};

export default TeamEdit;
