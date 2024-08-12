import {useMemo} from "react";
import {UserOutlined, HomeOutlined, TeamOutlined} from "@ant-design/icons";
import {Layout, Menu} from "antd";
import {Link, useLocation} from "react-router-dom";

import {PAGES} from "../../constants/pages.constants";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {PERMISSIONS} from "../../constants/permissions.constants";
import {userHasAccess} from "../../utils/user";

const {Sider} = Layout;

const allMenuItems = [
    {
        key: PAGES.HOME,
        icon: <HomeOutlined/>,
        label: <Link to={PAGES.HOME}>Home</Link>,
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
    const {user} = useSelector((state: RootState) => state.auth);
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
