import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IScheduleItem} from "../../models/schedule";

export interface IScheduleState {
    error: string | null;
    schedules: IScheduleItem[];
}

const initialState: IScheduleState = {
    error: null,
    schedules: [],
};

const scheduleSlice = createSlice({
    name: "schedule",
    initialState,
    reducers: {
        schedulesSuccess: (
            state,
            action: PayloadAction<{ schedules: IScheduleItem[] }>
        ) => {
            state.schedules = action.payload.schedules;
            state.error = null;
        },
        createScheduleItemSuccess: (
            state,
            action: PayloadAction<{ createScheduleItem: IScheduleItem }>
        ) => {
            state.schedules.push(action.payload.createScheduleItem);
        },
        updateScheduleItemSuccess: () => {
        },
        failed: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
    },
});

export const {
    schedulesSuccess,
    createScheduleItemSuccess,
    updateScheduleItemSuccess,
    failed,
} = scheduleSlice.actions;

export const scheduleState = (state: { auth: IScheduleState }) => ({
    ...state.auth,
});

export default scheduleSlice.reducer;
