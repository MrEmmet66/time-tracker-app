import {useMemo} from "react";
import {UserOutlined, HomeOutlined, TeamOutlined, CalendarOutlined} from "@ant-design/icons";
import {Layout, Menu} from "antd";
import {Link, useLocation} from "react-router-dom";

import {PAGES} from "../../constants/pages.constants";
import {PERMISSIONS} from "../../constants/permissions.constants";
import {userHasAccess} from "../../utils/user";
import useGetUser from "../../hooks/use-get-user";

const {Sider} = Layout;

const allMenuItems = [
    {
        key: PAGES.HOME,
        icon: <HomeOutlined/>,
        label: <Link to={PAGES.HOME}>Home</Link>,
    },
    {
        key: PAGES.CALENDAR,
        icon: <CalendarOutlined />,
        label: <Link to={PAGES.CALENDAR}>My Calendar</Link>,
    },
    {
        key: PAGES.USERS,
        icon: <UserOutlined/>,
        label: <Link to={PAGES.USERS}>Users</Link>,
        permissions: [
            PERMISSIONS.MANAGE_ALL_MEMBERS,
            PERMISSIONS.MANAGE_TEAM_MEMBERS,
        ],
    },
    {
        key: PAGES.TEAMS,
        icon: <TeamOutlined/>,
        label: <Link to={PAGES.TEAMS}>Teams</Link>,
        permissions: [
            PERMISSIONS.MANAGE_ALL_MEMBERS,
            PERMISSIONS.MANAGE_TEAM_MEMBERS,
        ],
    },
];

const Sidebar = () => {
    const user = useGetUser();
    const location = useLocation();

    const menuItems = useMemo(() => {
        if (!user) {
            return [allMenuItems[0]];
        }

        return allMenuItems.filter(
            (item) =>
                !item.permissions || userHasAccess(user.permissions, item.permissions)
        );
    }, [user]);

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
