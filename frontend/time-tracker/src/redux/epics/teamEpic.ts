import {combineEpics, ofType} from "redux-observable";
import {catchError, map, Observable, of, switchMap} from "rxjs";

import {fetchGraphQl} from "../../utils/apiActions.ts";
import {ITeamCreate} from "../../models/team.ts";
import {
    failed,
    getTeamByIdSuccess,
    getTeamsSuccess,
} from "../features/teamSlice.ts";

const getTeams = (action$: Observable<any>) =>
    action$
        .pipe(
            ofType("GET_TEAMS"),
            switchMap((action: { payload: { page?: number } }) =>
                fetchGraphQl({
                    query: `query Teams ($page: Int) {
                        teams (page: $page) {
                            entities {
                                id
                                name
                                members {
                                    id
                                    firstName
                                    lastName
                                    email
                                    permissions {
                                        name
                                    }
                                }
                            }
                            totalPages
                        }
                    }`,
                    variables: {
                        page: action.payload?.page ?? 1
                    }
                })
            )
        )
        .pipe(
            map((response) => getTeamsSuccess(response.data)),
            catchError((error) => of(failed(error.message)))
        );

const getTeamById = (action$: Observable<any>) =>
    action$
        .pipe(
            ofType("GET_TEAM"),
            switchMap((action: { payload: { id: number } }) =>
                fetchGraphQl({
                    query: `query TeamById ($id: ID!) {
                        team(id: $id) {
                                id
                                name
                                members {
                                    id
                                    firstName
                                    lastName
                                    email
                                    permissions {
                                        name
                                    }
                                }
                            }
                        }`,
                    variables: {
                        id: action.payload.id,
                    },
                })
            )
        )
        .pipe(
            map((response) => getTeamByIdSuccess(response.data)),
            catchError((error) => of(failed(error.message)))
        );

const createTeam = (action$: Observable<any>) =>
    action$
        .pipe(
            ofType("CREATE_TEAM"),
            switchMap((action: { payload: ITeamCreate }) =>
                fetchGraphQl({
                    query: `mutation CreateTeam ($name: String!) {
                        createTeam(name: $name){
                            id
                            name
                        }
                    }`,
                    variables: {
                        name: action.payload.name,
                    },
                })
            )
        )
        .pipe(
            switchMap(() => of({type: "GET_TEAMS"})),
            catchError((error) => of(failed(error.message)))
        );

const addUserToTeam = (action$: Observable<any>) =>
    action$
        .pipe(
            ofType("ADD_USER_TO_TEAM"),
            switchMap((action: { payload: { teamId: number, userId: number } }) =>
                fetchGraphQl({
                    query: `mutation AddUserToTeam ($teamId: ID! $userId: ID!) {
                        addUserToTeam(teamId: $teamId, userId: $userId){
                            id
                            name
                            members {
                                id
                                email
                                firstName
                                lastName
                                permissions {
                                    name
                                }
                            }
                        }
                    }`,
                    variables: {
                        teamId: action.payload.teamId,
                        userId: action.payload.userId,
                    },
                })
            )
        )
        .pipe(
            switchMap(() => of({type: "GET_TEAMS"})),
            catchError((error) => of(failed(error.message)))
        );

const removeUserFromTeam = (action$: Observable<any>) =>
    action$
        .pipe(
            ofType("REMOVE_USER_FROM_TEAM"),
            switchMap((action: { payload: { teamId: number, userId: number } }) =>
                fetchGraphQl({
                    query: `mutation RemoveUserFromTeam ($teamId: ID! $userId: ID!) {
                          removeUserFromTeam(teamId: $teamId, userId: $userId){
                            id
                            name
                            members {
                                id
                                email
                                firstName
                                lastName
                                permissions {
                                    name
                                }
                            }
                        }
                    }`,
                    variables: {
                        teamId: action.payload.teamId,
                        userId: action.payload.userId,
                    },
                })
            )
        )
        .pipe(
            switchMap(() => of({type: "GET_TEAMS"})),
            catchError((error) => of(failed(error.message)))
        );

export default combineEpics(getTeams, getTeamById, createTeam, addUserToTeam, removeUserFromTeam);
