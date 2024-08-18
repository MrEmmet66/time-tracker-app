import React, {useEffect} from 'react';
import {Modal, Form, Input, Select, Button} from 'antd';
import {User} from '../../models/user.ts';
import {permissions} from '../../constants/permissions.constants.ts';

interface UserEditModalProps {
    visible: boolean;
    user: User;
    onSave: (user: User) => void;
    onCancel: () => void;
    onUpdatePermission: (values: any) => void
}

const UserEditModal: React.FC<UserEditModalProps> = ({visible, user, onCancel, onUpdatePermission}) => {
    const [form] = Form.useForm();

    const userPermissions = user.permissions.map(permissionKey => {
        const permission = permissions.find(p => p.key === permissionKey.name);
        return permission ? permission.key : null;
    }).filter(Boolean);

    useEffect(() => {
        form.setFieldsValue({
            permissions: userPermissions
        });
    }, [user, form, userPermissions]);

    return (
        <Modal
            open={visible}
            title="Edit User Permissions"
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={() => form.submit()}>
                    Save
                </Button>
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    permissions: userPermissions
                }}
                onFinish={onUpdatePermission}
            >
                <Form.Item label="Email">
                    <Input value={user.email} disabled/>
                </Form.Item>
                <Form.Item label="First Name">
                    <Input value={user.firstName} disabled/>
                </Form.Item>
                <Form.Item label="Last Name">
                    <Input value={user.lastName} disabled/>
                </Form.Item>
                <Form.Item
                    name="permissions"
                    label="Permissions"
                >
                    <Select mode="multiple" allowClear defaultValue={userPermissions}>
                        {permissions.map(permission => (
                            <Select.Option key={permission.key} value={permission.key}>
                                {permission.value}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserEditModal;