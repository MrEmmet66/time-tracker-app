import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {createEpicMiddleware} from "redux-observable";

import authReducer from "./features/authSlice.ts";
import usersSlice from "./features/usersSlice.ts";
import teamReducer from "./features/teamSlice.ts";
import workEntryReducer from "./features/workEntrySlice.ts";
import {rootEpic} from "./epics/rootEpic.ts";
import vacationsSlice from "./features/vacationsSlice.ts";

const epicMiddleware = createEpicMiddleware();

const rootReducer = combineReducers({
    auth: authReducer,
    users: usersSlice,
    vacations: vacationsSlice,
    team: teamReducer,
    workEntry: workEntryReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
