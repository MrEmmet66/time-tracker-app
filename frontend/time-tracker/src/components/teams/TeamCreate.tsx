import {Form, Modal} from "antd";
import Input from "antd/es/input/Input";

interface CreateUserModalProps {
    isOpen: boolean;
    onCreate: (values: any) => void;
    onCancel: () => void;
}

const TeamCreate = ({isOpen, onCreate, onCancel}: CreateUserModalProps) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                form.resetFields();
                onCreate(values);
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    return (
        <Modal
            open={isOpen}
            title="Create a new team"
            okText="Create"
            cancelText="Cancel"
            onOk={handleOk}
            onCancel={onCancel}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Team name"
                    rules={[{required: true, message: "Please enter the team name!"}]}
                >
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TeamCreate;
