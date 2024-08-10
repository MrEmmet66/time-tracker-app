import {ChangeEvent, useState} from "react";
import {useDispatch} from "react-redux";
import {Button, Form, Input, Typography} from "antd";
import {LockOutlined, MailOutlined} from "@ant-design/icons";

const {Title} = Typography;

function LoginForm() {
    const [formData, setFormDate] = useState({
        email: "",
        password: "",
    });

    const dispatch = useDispatch();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormDate({...formData, [name]: value});
    };

    const handleSubmit = async () => {
        dispatch({type: "LOGIN", payload: formData});
    };

    return (
        <>
            <Title
                level={3}
                className="!my-5 text-center"
            >
                Login
            </Title>
            <Form
                name="login"
                initialValues={{remember: true}}
                className="mx-auto max-w-96"
            >
                <Form.Item
                    name="email"
                    rules={[{required: true, message: "Please input your Email!"}]}
                >
                    <Input
                        prefix={<MailOutlined/>}
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        size="middle"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{required: true, message: "Please input your Password!"}]}
                >
                    <Input
                        prefix={<LockOutlined/>}
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        size="middle"
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        block
                        type="primary"
                        htmlType="submit"
                        onClick={handleSubmit}
                        size="middle"
                    >
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default LoginForm;
