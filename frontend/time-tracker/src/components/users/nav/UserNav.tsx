import {useMemo} from "react";
import type {MenuProps} from "antd";
import {Dropdown, message} from "antd";
import {UserOutlined, LogoutOutlined} from "@ant-design/icons";

import {User} from "../../../models/user";
import {logout} from "../../../utils/user";
import {useRouter} from "../../../hooks/use-router";
import {PAGES} from "../../../constants/pages.constants";

interface IProps {
    user: User;
}

const UserNav = ({user}: IProps) => {
    const router = useRouter();

    const items: MenuProps["items"] = useMemo(
        () => [
            {
                label: <a>Profile</a>,
                key: "0",
                primary: true,
                onClick: () => {
                    router.push(PAGES.PROFILE);
                },
                icon: <UserOutlined/>,
            },
            {
                label: <a>Logout</a>,
                key: "1",
                danger: true,
                onClick: () => {
                    message.success("Logout.");
                    logout();
                    router.replaceWithReload(PAGES.HOME);
                },
                icon: <LogoutOutlined/>,
            },
        ],
        [],
    );

    const menuProps = {
        items,
    };

    return (
        <Dropdown.Button
            menu={menuProps}
            placement="bottom"
            icon={<UserOutlined/>}
            trigger={["click"]}
            size="middle"
        >
            {user.email}
        </Dropdown.Button>
    );
};

export default UserNav;
