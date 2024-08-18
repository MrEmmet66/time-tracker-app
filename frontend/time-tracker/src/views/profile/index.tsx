import {Button, Card, Flex, Form, Input, Typography} from "antd";
import LayoutPage from "../../layouts/LayoutPage";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import useGetUser from "../../hooks/use-get-user";
import useAuthenticated from "../../hooks/use-authenticated";
import {useNavigate} from "react-router-dom";
import {PAGES} from "../../constants/pages.constants";

const {Title} = Typography;

const ProfilePage = () => {
    const isAuthenticated = useAuthenticated();
    const user = useGetUser();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [changePasswordForm] = Form.useForm();
    const initialValues = {
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        email: user?.email ?? "",
    };

    if (!isAuthenticated) {
        navigate(PAGES.LOGIN);
    }

    useEffect(() => {
        if (!user) return;

        form.setFieldsValue({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        });
    }, []);

    const handleChangePassword = (values: any) => {
        dispatch({type: "CHANGE_PASSWORD", payload: values});
    };

    return (
        <LayoutPage>
            {user && (
                <Card>
                    <Title level={3} className="text-center">
                        Profile
                    </Title>
                    <Form
                        className="my-10 grid grid-cols-2 gap-4"
                        initialValues={initialValues}
                        form={form}
                    >
                        <Title level={4}>Profile</Title>
                        <Flex vertical gap={16}>
                            <Form.Item name="email" label="Email" layout="vertical">
                                <Input
                                    placeholder="Email"
                                    name="email"
                                    size="middle"
                                    disabled
                                />
                            </Form.Item>
                            <Form.Item name="firstName" label="First Name" layout="vertical">
                                <Input
                                    placeholder="First name"
                                    name="firstName"
                                    size="middle"
                                    disabled
                                />
                            </Form.Item>
                            <Form.Item name="lastName" label="Last Name" layout="vertical">
                                <Input
                                    placeholder="Last name"
                                    name="lastName"
                                    size="middle"
                                    disabled
                                />
                            </Form.Item>
                        </Flex>
                    </Form>
                    <Form
                        className="my-10 grid grid-cols-2 gap-4"
                        initialValues={initialValues}
                        onFinish={handleChangePassword}
                        form={changePasswordForm}
                    >
                        <Title level={4}>Change password</Title>
                        <Flex vertical gap={16}>
                            <Form.Item
                                name="password"
                                rules={[
                                    {required: true, message: "Please input your password!"},
                                ]}
                                label="Password"
                                layout="vertical"
                            >
                                <Input
                                    placeholder="Current password"
                                    name="password"
                                    size="middle"
                                    type="password"
                                />
                            </Form.Item>
                            <Form.Item
                                name="newPassword"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your new password!",
                                    },
                                ]}
                                label="New Password"
                                layout="vertical"
                            >
                                <Input
                                    placeholder="New Password"
                                    name="newPassword"
                                    size="middle"
                                    type="password"
                                />
                            </Form.Item>
                            <Form.Item
                                name="confirmPassword"
                                dependencies={["newPassword"]}
                                label="Confirm Password"
                                layout="vertical"
                                hasFeedback
                                rules={[
                                    {required: true, message: "Please confirm your password!"},
                                    ({getFieldValue}) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue("newPassword") === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error("The two passwords do not match!")
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <Input
                                    placeholder="Confirm Password"
                                    name="confirmPassword"
                                    size="middle"
                                    type="password"
                                />
                            </Form.Item>
                            <Form.Item className="flex justify-end">
                                <Button type="primary" htmlType="submit" size="middle">
                                    Change
                                </Button>
                            </Form.Item>
                        </Flex>
                    </Form>
                </Card>
            )}
        </LayoutPage>
    );
};

export default ProfilePage;
