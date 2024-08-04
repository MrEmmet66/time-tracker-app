import {Link} from "react-router-dom";
import {Button, Layout} from "antd";

import {PAGES} from "../../constants/pages.constants";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import UserNav from "../users/nav/UserNav";

const {Header: HD} = Layout;

const Header = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <HD className="px-12 flex justify-between items-center bg-zinc-100">
            <div className="text-2xl">
                <Link to={PAGES.HOME}>Time Tracker</Link>
            </div>
            <div>
                {user ? (
                    <UserNav user={user}/>
                ) : (
                    <Link to={PAGES.LOGIN}>
                        <Button type="primary">Login</Button>
                    </Link>
                )}
            </div>
        </HD>
    );
};

export default Header;
