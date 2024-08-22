import {Vacation} from "../../models/vacation.ts";
import {createSlice} from "@reduxjs/toolkit";
import {notification} from "antd";

interface VacationsSlice {
    vacations: Vacation[];
    vacation: Vacation | null;
    error: string | null;
}

const initialState: VacationsSlice = {
    vacations: [],
    vacation: null,
    error: null,
};

const vacationsSlice  = createSlice({
    name: 'vacations',
    initialState,
    reducers: {
        createVacationApplicationSuccess: (state, action) => {
            state.vacations.push(action.payload.createVacationApplication.vacation);
            state.error = null;
            notification.success({
                message: 'Success',
                description: 'Vacation application created successfully'
            });
        },
        createVacationApplicationError: (state, action) => {
            state.error = action.payload;
            notification.error({
                message: 'Error',
                description: state.error
            });
        },
        getUserVacationsSuccess: (state, action) => {
            state.vacations = action.payload.vacations.userVacations;
            state.error = null;
        },
        getAllVacationsSuccess: (state, action) => {
            state.vacations = action.payload.vacations;
            state.error = null;
        },
        getAllVacationsError: (state, action) => {
            state.error = action.payload;
            notification.error({
                message: 'Error',
                description: state.error
            });
        },
        getVacationsByPageSuccess: (state, action) => {
            state.vacations = action.payload.vacations;
            state.error = null;
        },
        getVacationsByPageError: (state, action) => {
            state.error = action.payload;
            notification.error({
                message: 'Error',
                description: state.error
            });
        }
    }
})

export const {
    createVacationApplicationSuccess,
    createVacationApplicationError,
    getUserVacationsSuccess,
    getAllVacationsSuccess,
    getAllVacationsError,
    getVacationsByPageSuccess,
    getVacationsByPageError } = vacationsSlice.actions;
export const vacationsState = (state: VacationsSlice) => state;
export default vacationsSlice.reducer;