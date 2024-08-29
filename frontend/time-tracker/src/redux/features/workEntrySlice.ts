import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IWorkEntry} from "../../models/work-entry";

export interface WorkEntryState {
    error: string | null;
    workEntries: IWorkEntry[] | null;
}

const initialState: WorkEntryState = {
    error: null,
    workEntries: null,
};

const workEntrySlice = createSlice({
    name: "workEntry",
    initialState,
    reducers: {
        getWorkEntriesSuccess: (
            state,
            action: PayloadAction<{
                workEntries: IWorkEntry[];
                error: string;
            }>
        ) => {
            state.workEntries = action.payload.workEntries;
            state.error = null;
        },
        getWorkEntriesFailed: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        getWorkEntriesByUserIdSuccess: (
            state,
            action: PayloadAction<{
                workEntriesByUserId: IWorkEntry[];
            }>
        ) => {
            state.error = null;
            state.workEntries = action.payload.workEntriesByUserId;
        },
        getWorkEntriesByDateSuccess: (
            state,
            action: PayloadAction<{
                workEntriesByDate: IWorkEntry[];
            }>
        ) => {
            console.log(action.payload);
            state.error = null;
            state.workEntries = action.payload?.workEntriesByDate || [];
        },
    },
});

export const {
    getWorkEntriesSuccess,
    getWorkEntriesFailed,
    getWorkEntriesByUserIdSuccess,
    getWorkEntriesByDateSuccess
} = workEntrySlice.actions;

export const workEntryState = (state: { workEntry: WorkEntryState }) => ({
    ...state.workEntry,
});

export default workEntrySlice.reducer;
