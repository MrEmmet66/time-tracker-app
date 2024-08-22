import React from 'react';
import { Modal, Form, DatePicker, Button } from 'antd';

interface CreateVacationModalProps {
    visible: boolean;
    onCancel: () => void;
    onCreate: (values: { startVacation: string; endVacation: string }) => void;
}

const CreateVacationModal: React.FC<CreateVacationModalProps> = ({ visible, onCancel, onCreate }) => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        onCreate({
            startVacation: values.startVacation.format('YYYY-MM-DD'),
            endVacation: values.endVacation.format('YYYY-MM-DD'),
        });
        onCancel();
    };

    return (
        <Modal
            title="Apply for Vacation"
            open={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} onFinish={onFinish}>
                <Form.Item
                    name="startVacation"
                    label="Start Date"
                    rules={[{ required: true, message: 'Please select start date!' }]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    name="endVacation"
                    label="End Date"
                    rules={[{ required: true, message: 'Please select end date!' }]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateVacationModal;