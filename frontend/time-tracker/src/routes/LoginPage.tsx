import LoginForm from "../components/LoginForm.tsx";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

function LoginPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const authState = useSelector((state) => state)


    const onSubmit = ({email, password}) => {
        console.log('sraka')
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