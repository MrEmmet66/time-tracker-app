import {combineEpics, ofType, StateObservable} from "redux-observable";
import {
    catchError,
    map,
    Observable,
    of,
    switchMap,
    withLatestFrom,
} from "rxjs";

import {fetchGraphQl} from "../../utils/apiActions.ts";
import {
    getWorkEntriesSuccess,
    getWorkEntriesFailed,
    getWorkEntriesByUserIdSuccess,
    getWorkEntriesByDateSuccess,
} from "../features/workEntrySlice.ts";
import {IWorkEntry} from "../../models/work-entry.ts";
import {RootState} from "../store.ts";

const getWorkEntries = (action$: Observable<any>) =>
    action$
        .pipe(
            ofType("GET_WORK_ENTRIES"),
            switchMap(() =>
                fetchGraphQl({
                    query: `query WorkEntries {
                workEntries {
                    id
                    startDateTime
                    endDateTime
                    user {
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
                })
            )
        )
        .pipe(
            map((response) => getWorkEntriesSuccess(response.data)),
            catchError((error) => of(getWorkEntriesFailed(error.message)))
        );

const getWorkEntriesByUserId = (action$: Observable<any>) =>
    action$
        .pipe(
            ofType("GET_WORK_ENTRIES_BY_USER_ID"),
            switchMap((action: { payload: { userId: number } }) =>
                fetchGraphQl({
                    query: `query WorkEntriesByUserId ($userId: ID!) {
              workEntriesByUserId(userId: $userId) {
                id
                startDateTime
                endDateTime
              }
            }`,
                    variables: {
                        userId: action.payload.userId,
                    },
                })
            )
        )
        .pipe(
            map((response) => getWorkEntriesByUserIdSuccess(response.data)),
            catchError((error) => of(getWorkEntriesFailed(error.message)))
        );

const getWorkEntriesByDate = (action$: Observable<any>) =>
    action$
        .pipe(
            ofType("GET_WORK_ENTRIES_BY_DATE"),
            switchMap((action: { payload: { date: string, userId?: number } }) =>
                fetchGraphQl({
                    query: `query WorkEntriesByDate ($date: Date! $userId: ID) {
                  workEntriesByDate(date: $date, userId: $userId) {
                    id
                    startDateTime
                    endDateTime
                  }
                }`,
                    variables: {
                        date: action.payload.date,
                        userId: action.payload.userId,
                    },
                })
            )
        )
        .pipe(
            map((response) => getWorkEntriesByDateSuccess(response.data)),
            catchError((error) => of(getWorkEntriesFailed(error.message)))
        );

const createWorkEntry = (
    action$: Observable<any>,
    state$: StateObservable<RootState>
) =>
    action$.pipe(
        ofType("CREATE_WORK_ENTRY"),
        switchMap((action: { payload: IWorkEntry }) =>
            fetchGraphQl({
                query: `mutation CreateWorkEntry ($startDateTime: DateTime! $endDateTime: DateTime!) {
                createWorkEntry(startDateTime: $startDateTime, endDateTime: $endDateTime){
                  id
                  startDateTime
                  endDateTime
                  user{
                    id
                    email
                    firstName
                    lastName
                    id
                    permissions{
                      name
                    }
                  }
                }
              }`,
                variables: {
                    startDateTime: action.payload.startDateTime,
                    endDateTime: action.payload.endDateTime,
                },
            })
        ),
        withLatestFrom(state$),
        switchMap(([_, state]) => {
            const userId = state.auth.user?.id;
            if (userId) {
                return of({type: "GET_WORK_ENTRIES_BY_USER_ID", payload: {userId}});
            } else {
                return of(getWorkEntriesFailed("User ID not found in state"));
            }
        }),
        catchError((error) => of(getWorkEntriesFailed(error.message)))
    );

export default combineEpics(
    getWorkEntries,
    getWorkEntriesByUserId,
    getWorkEntriesByDate,
    createWorkEntry
);
