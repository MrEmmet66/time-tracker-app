import {useSelector} from "react-redux";
import {RootState} from "../redux/store.ts";

function Index() {
    const authState = useSelector((state: RootState) => state.user)
    return (
        <div>
            <p>{authState ? `User: ${authState.email}` : 'Not logged in'}</p>
        </div>
    );
}

export default Index;