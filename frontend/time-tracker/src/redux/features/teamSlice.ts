import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ITeam} from "../../models/team";

export interface ITeamState {
    error: string | null;
    teams: ITeam[] | null;
    team: ITeam | null;
}

const initialState: ITeamState = {
    error: null,
    teams: null,
    team: null,
};

const workEntrySlice = createSlice({
    name: "team",
    initialState,
    reducers: {
        getTeamsSuccess: (
            state,
            action: PayloadAction<{
                teams: { entities: ITeam[]; totalPages: number };
                error: string;
            }>
        ) => {
            state.teams = action.payload.teams.entities;
            state.error = null;
        },
        getTeamByIdSuccess: (
            state,
            action: PayloadAction<{
                team: ITeam;
            }>
        ) => {
            state.error = null;
            state.team = action.payload.team;
        },
        createTeam: (
            state,
            action: PayloadAction<{
                createTeam: ITeam;
            }>
        ) => {
            console.log(action.payload);
            state.error = null;
            state.team = action.payload?.createTeam ?? null;
        },
        failed: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
    },
});

export const {getTeamsSuccess, getTeamByIdSuccess, createTeam, failed} =
    workEntrySlice.actions;

export const workEntryState = (state: { team: ITeamState }) => ({
    ...state.team,
});

export default workEntrySlice.reducer;
