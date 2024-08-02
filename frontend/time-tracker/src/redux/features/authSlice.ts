import {createSlice, current, PayloadAction} from "@reduxjs/toolkit";
import {User} from "../../models/user.ts";
import {jwtDecode} from "jwt-decode";

interface AuthSlice {
    error: string | null;
    user: User | null;
    jwtToken: string | null;
}

const initialState: AuthSlice = {
    error: null,
    user: null,
    jwtToken: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<any>) => {
            console.log(action.payload)
            state.user = action.payload.login.user;
            state.jwtToken = action.payload.login.token;
            state.error = null;
            localStorage.setItem('jwtToken', state.jwtToken);
        },
        loginFailed: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        setAuthStateFromToken: (state, action: PayloadAction<string>) => {
            const decodedToken: any = jwtDecode(action.payload);
            console.log(decodedToken)
            state.user = {
                id: decodedToken.id,
                firstName: decodedToken.firstName,
                lastName: decodedToken.lastName,
                email: decodedToken.email,
                permissions: decodedToken.permissions
            };
            state.jwtToken = action.payload;
            state.error = null;
        }

    }
})

export const { setAuthStateFromToken, loginSuccess, loginFailed } = authSlice.actions

export const authState = (state: AuthSlice) => state

export default authSlice.reducer