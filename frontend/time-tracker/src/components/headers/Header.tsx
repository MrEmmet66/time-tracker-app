import {Link, useLocation} from "react-router-dom";
import {Button, Layout} from "antd";

import {PAGES} from "../../constants/pages.constants";
import UserNav from "../users/nav/UserNav";
import {User} from "../../models/user";
import Timer from "../timer/Timer";

const {Header: HD} = Layout;

interface IProps {
    user?: User | null;
}

const Header = ({user}: IProps) => {
    const location = useLocation();

    return (
        <HD className="px-12 bg-zinc-100">
            <div className="h-full flex justify-between items-center border-b border-zinc-400">
                <div className="text-2xl">
                    <Link to={PAGES.HOME}>Time Tracker</Link>
                </div>
                {
                    location.pathname !== PAGES.HOME && <>
                        <Timer isInHeader/>
                    </>
                }
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
