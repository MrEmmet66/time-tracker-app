import {User} from "../../models/user.ts";
import {createSlice} from "@reduxjs/toolkit";

interface UsersSlice {
    users: User[];
    user: User | null;
    error: string | null;
}

const initialState: UsersSlice = {
    users: [],
    user: null,
    error: null
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        createUserSuccess: (state, action) => {
            state.users.push(action.payload.createUser.user);
            state.error = null;
        },
        createUserError: (state, action) => {
            state.error = action.payload;
        },
        getUsersSuccess: (state, action) => {
            console.log(action.payload)
            state.users = action.payload.users;
            state.error = null;
        },
        getUsersError: (state, action) => {
            state.error = action.payload;
        },
        getUsersByIdSuccess: (state, action) => {
            state.user = action.payload.user;
            state.error = null;
        },
        getUsersByIdError: (state, action) => {
            state.error = action.payload;
        }

    }
})

export const { createUserSuccess, createUserError, getUsersByIdSuccess, getUsersByIdError, getUsersSuccess, getUsersError } = usersSlice.actions

export const authState = (state: UsersSlice) => state

export default usersSlice.reducer