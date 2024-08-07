import LoginForm from "../components/LoginForm.tsx";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {RootState} from "../redux/store.ts";

function LoginPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const authState = useSelector((state: RootState) => state.auth)


    const onSubmit = ({email, password}) => {
        dispatch({type: 'LOGIN', payload: {email, password}})
    }

    useEffect(() => {
        if(authState.user) {
            navigate('/')
        }
    })
    return (
        <>
            <LoginForm onSubmit={onSubmit}/>
        </>
    );
}

export default LoginPage;