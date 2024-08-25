import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "../../models/user.ts";
import {jwtDecode} from "jwt-decode";
import {clearToken, setToken} from "../../utils/token.ts";

export interface AuthState {
    error: string | null;
    user: User | null;
    jwtToken: string | null;
}

const initialState: AuthState = {
    error: null,
    user: null,
    jwtToken: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (
            state,
            action: PayloadAction<{ login: { token: string; user: User } }>,
        ) => {
            console.log(action.payload);
            state.user = action.payload.login.user;
            state.jwtToken = action.payload.login.token;
            state.error = null;
            setToken(state.jwtToken ?? "");
        },
        loginFailed: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        setAuthStateFromToken: (state, action: PayloadAction<string>) => {
            const decodedToken: any = jwtDecode(action.payload);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
                state.user = null;
                state.jwtToken = null;
                state.error = "Token expired";
                clearToken();
            } else {
                state.user = {
                    id: decodedToken.id,
                    firstName: decodedToken.firstName,
                    lastName: decodedToken.lastName,
                    email: decodedToken.email,
                    permissions: JSON.parse(decodedToken.permissions.toString()),
                    isActive: decodedToken.isActive
                };
                state.jwtToken = action.payload;
                state.error = null;
            }
        }
    }
})

export const {setAuthStateFromToken, loginSuccess, loginFailed} =
    authSlice.actions;

export const authState = (state: { auth: AuthState }) => ({...state.auth});

export default authSlice.reducer;
