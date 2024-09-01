import {useEffect, useState} from "react";
import {User} from "../models/user";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {getToken} from "../utils/token";
import {jwtDecode} from "jwt-decode";

const useGetUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const {user: userState} = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch();

    useEffect(() => {
        try {
            const token = getToken();
            if (!token) {
                setUser(null);
                return;
            }

            const user: User = jwtDecode(token);

            if (user) {
                dispatch({type: "GET_USER_BY_ID", payload: {id: user.id}});
            }
        } catch {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        if (!userState) {
            setUser(null);
            return;
        }

        setUser(userState);
    }, [userState]);

    return user;
};

export default useGetUser;
