import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {createEpicMiddleware} from "redux-observable";

import authReducer from "./features/authSlice.ts";
import workEntryReducer from "./features/workEntrySlice.ts";
import {rootEpic} from "./epics/rootEpic.ts";
import workEntryEpic from "./epics/workEntryEpic.ts";

const epicMiddleware = createEpicMiddleware();

const rootReducer = combineReducers({
    auth: authReducer,
    workEntry: workEntryReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);
epicMiddleware.run(workEntryEpic);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
