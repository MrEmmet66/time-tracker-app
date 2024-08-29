import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {setAuthStateFromToken} from "./redux/features/authSlice.ts";
import Router from "./components/router/Router.tsx";
import {getToken} from "./utils/token.ts";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = getToken();
        console.log(token);
        if (token) {
            dispatch(setAuthStateFromToken(token));
        }
    }, []);

    return (
        <>
            <Router/>
        </>
    );
}

export default App;
