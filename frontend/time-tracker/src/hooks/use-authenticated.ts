import {jwtDecode} from "jwt-decode";
import {User} from "../models/user";
import {getToken} from "../utils/token";

const useAuthenticated = () => {
    try {
        const token = getToken();
        if (!token) {
            return false;
        }

        const user: User = jwtDecode(token);

        if (user) {
            return true;
        }

        return true;
    } catch {
        return false;
    }
};

export default useAuthenticated;
