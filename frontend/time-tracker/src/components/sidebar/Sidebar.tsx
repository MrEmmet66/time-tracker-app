import {UserOutlined, HomeOutlined, PicRightOutlined} from "@ant-design/icons";
import {Layout, Menu} from "antd";
import {PAGES} from "../../constants/pages.constants";
import {Link} from "react-router-dom";

const {Sider} = Layout;

const menuItems = [
    {
        key: "home",
        icon: <HomeOutlined/>,
        label: <Link to={PAGES.HOME}>Home</Link>,
    },
    {
        key: "users",
        icon: <UserOutlined/>,
        label: <Link to={PAGES.USERS}>Users</Link>,
    },
    {
        key: "vacations",
        icon: <PicRightOutlined />,
        label: <Link to={PAGES.VACATIONS}>My Vacations</Link>,
    },
    {
        key: "all-vacations",
        icon: <PicRightOutlined />,
        label: <Link to={PAGES.ALL_VACATIONS}>All Vacations</Link>,
    },

];

const Sidebar = () => {
    return (
        <Sider theme="light" className="min-h-screen py-16" trigger={null}>
            <div className="h-full border-r border-zinc-400">
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={["home"]}
                    items={menuItems}
                />
            </div>
        </Sider>
    );
};

export default Sidebar;
