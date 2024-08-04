import {useSelector} from "react-redux";

import {RootState} from "../../redux/store.ts";
import LayoutPage from "../../layouts/LayoutPage.tsx";

function Index() {
    const {user} = useSelector((state: RootState) => state.auth);

    return (
        <LayoutPage>
            <div>
                <p>{user ? `User: ${user.email}` : "Not logged in"}</p>
            </div>
        </LayoutPage>
    );
}

export default Index;
