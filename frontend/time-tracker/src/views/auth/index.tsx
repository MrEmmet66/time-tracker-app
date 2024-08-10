import {useSelector} from "react-redux";

import {useRouter} from "../../hooks/use-router.ts";
import LayoutPage from "../../layouts/LayoutPage.tsx";
import LoginForm from "../../components/forms/LoginForm.tsx";
import {RootState} from "../../redux/store.ts";

function LoginPage() {
    const router = useRouter();
    const {user} = useSelector((state: RootState) => state.auth);

    if (user) {
        router.push("/");
    }

    return (
        <LayoutPage>
            <LoginForm/>
        </LayoutPage>
    );
}

export default LoginPage;
