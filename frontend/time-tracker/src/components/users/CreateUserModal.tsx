import { Form, Modal } from "antd";
import Input from "antd/es/input/Input";

interface CreateUserModalProps {
  visible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  visible,
  onCreate,
  onCancel,
}) => {
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
      open={visible}
      title="Create a new user"
      okText="Create"
      cancelText="Cancel"
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" name={"create_user_form"}>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please enter the email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: "Please enter the first name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: "Please enter the last name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input the password!" }]}
        >
          <Input type="password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
