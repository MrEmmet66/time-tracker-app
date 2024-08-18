import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IWorkEntry} from "../../models/work-entry";

export interface WorkEntryState {
    error: string | null;
    workEntries: IWorkEntry[] | null;
    totalPages: number | null
}

const initialState: WorkEntryState = {
    error: null,
    workEntries: null,
    totalPages: 1
};

const workEntrySlice = createSlice({
    name: "workEntry",
    initialState,
    reducers: {
        getWorkEntriesSuccess: (
            state,
            action: PayloadAction<{
                workEntries: {
                    entities: IWorkEntry[];
                    totalPages: number
                }
                error: string;
            }>
        ) => {
            state.workEntries = action.payload.workEntries.entities;
            state.totalPages = action.payload.workEntries.totalPages;
            state.error = null;
        },
        getWorkEntriesFailed: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        getWorkEntriesByUserIdSuccess: (
            state,
            action: PayloadAction<{
                workEntriesByUserId: {
                    entities: IWorkEntry[];
                    totalPages: number
                }
            }>
        ) => {
            state.error = null;
            state.workEntries = action.payload.workEntriesByUserId.entities;
            state.totalPages = action.payload.workEntriesByUserId.totalPages;
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
            state.totalPages = null;
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
