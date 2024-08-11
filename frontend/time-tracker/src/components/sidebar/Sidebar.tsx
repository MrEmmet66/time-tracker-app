import {UserOutlined, HomeOutlined, TeamOutlined} from "@ant-design/icons";
import {Layout, Menu} from "antd";
import {PAGES} from "../../constants/pages.constants";
import {Link, useLocation} from "react-router-dom";

const {Sider} = Layout;

const menuItems = [
    {
        key: PAGES.HOME,
        icon: <HomeOutlined/>,
        label: <Link to={PAGES.HOME}>Home</Link>,
    },
    {
        key: PAGES.USERS,
        icon: <UserOutlined/>,
        label: <Link to={PAGES.USERS}>Users</Link>,
    },
    {
        key: PAGES.TEAMS,
        icon: <TeamOutlined/>,
        label: <Link to={PAGES.TEAMS}>Teams</Link>,
    },
];

const Sidebar = () => {
    const location = useLocation();

    return (
        <Sider theme="light" className="min-h-screen py-16" trigger={null}>
            <div className="h-full border-r border-zinc-400">
                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                />
            </div>
        </Sider>
    );
};

export default Sidebar;
