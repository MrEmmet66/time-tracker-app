import {Vacation} from "../../models/vacation.ts";
import {createSlice} from "@reduxjs/toolkit";
import {notification} from "antd";
import {OFF_WORK_STATE} from "../../constants/offWorkState.constants.ts";

interface VacationsSlice {
    vacations: Vacation[];
    vacation: Vacation | null;
    error: string | null;
    totalPages: number;
}

const initialState: VacationsSlice = {
    vacations: [],
    vacation: null,
    error: null,
    totalPages: 1
};

const vacationsSlice  = createSlice({
    name: 'vacations',
    initialState,
    reducers: {
        createVacationApplicationSuccess: (state, action) => {
            console.log(action.payload)
            state.vacations.push(action.payload.createVacationApplication);
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
            state.vacations = action.payload.userVacations;
            state.error = null;
        },
        getUserVacationsError: (state, action) => {
            state.error = action.payload;
            notification.error({
                message: 'Error',
                description: state.error
            });
        },
        getAllVacationsSuccess: (state, action) => {
            state.vacations = action.payload.vacations.entities;
            state.totalPages = action.payload.vacations.totalPages
            state.error = null;
        },
        getAllVacationsError: (state, action) => {
            state.error = action.payload;
            notification.error({
                message: 'Error',
                description: state.error
            });
        },
        approveVacationSuccess: (state, action) => {
            console.log(action.payload)
            state.vacations.find(vacation => vacation.id === action.payload.approveVacation.id).status = OFF_WORK_STATE.APPROVED
            state.error = null;
            notification.success({
                message: 'Success',
                description: 'Vacation approved successfully'
            });
        },
        rejectVacationSuccess: (state, action) => {
            state.vacations.find(vacation => vacation.id === action.payload.rejectVacation.id).status = OFF_WORK_STATE.REJECTED;
            state.error = null;
            notification.success({
                message: 'Success',
                description: 'Vacation rejected successfully'
            });

        },
        vacationActionError: (state, action) => {
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
    getUserVacationsError,
    getAllVacationsSuccess,
    getAllVacationsError,
    approveVacationSuccess,
    rejectVacationSuccess,
    vacationActionError } = vacationsSlice.actions;
export const vacationsState = (state: VacationsSlice) => state;
export default vacationsSlice.reducer;