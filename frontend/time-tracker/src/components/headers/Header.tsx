import {Link} from "react-router-dom";
import {Button, Layout} from "antd";

import {PAGES} from "../../constants/pages.constants";
import UserNav from "../users/nav/UserNav";
import {User} from "../../models/user";

const {Header: HD} = Layout;

interface IProps {
    user?: User | null;
}

const Header = ({user}: IProps) => {
    return (
        <HD className="px-12 bg-zinc-100">
            <div className="h-full flex justify-between items-center border-b border-zinc-400">
                <div className="text-2xl">
                    <Link to={PAGES.HOME}>Time Tracker</Link>
                </div>
                <div>
                    {user ? (
                        <UserNav user={user}/>
                    ) : (
                        <Link to={PAGES.LOGIN}>
                            <Button type="primary" size="middle">Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </HD>
    );
};

export default Header;
