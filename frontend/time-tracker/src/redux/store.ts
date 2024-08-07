import {configureStore} from "@reduxjs/toolkit";
import 'typescript'
import authSlice from "./features/authSlice.ts";
import {createEpicMiddleware} from "redux-observable";
import {rootEpic} from "./epics/rootEpic.ts";
import usersSlice from "./features/usersSlice.ts";

const epicMiddleware = createEpicMiddleware()

export const store = configureStore({
    reducer: {
        auth: authSlice,
        users: usersSlice
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(epicMiddleware)
})

epicMiddleware.run(rootEpic)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch