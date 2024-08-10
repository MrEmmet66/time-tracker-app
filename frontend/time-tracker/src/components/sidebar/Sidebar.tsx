import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import {Layout, Menu} from "antd";

const {Sider} = Layout;

const menuItems = [
    {
        key: "1",
        icon: <UserOutlined/>,
        label: "nav 1",
    },
    {
        key: "2",
        icon: <VideoCameraOutlined/>,
        label: "nav 2",
    },
    {
        key: "3",
        icon: <UploadOutlined/>,
        label: "nav 3",
    },
];

const Sidebar = () => {
    return (
        <Sider theme="light" className="min-h-screen py-16" trigger={null}>
            <div className="h-full border-r border-zinc-400">
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    items={menuItems}
                />
            </div>
        </Sider>
    );
};

export default Sidebar;
