import {combineEpics, ofType} from "redux-observable";
import {catchError, map, Observable, of, switchMap} from "rxjs";

import {fetchGraphQl} from "../../utils/apiActions.ts";
import {
    createScheduleItemSuccess,
    failed,
    schedulesSuccess,
} from "../features/scheduleSlice.ts";
import {IScheduleItemCreate, IScheduleItem} from "../../models/schedule.ts";

const getScheduleItems = (action$: Observable<any>) =>
    action$
        .pipe(
            ofType("SCHEDULE_ITEMS"),
            switchMap((action: { payload: { userId: number; month?: number } }) =>
                fetchGraphQl({
                    query: `query Schedules($userId: ID!, $month: Int) {
                            schedules (userId: $userId, month: $month) {
                                id
                                title
                                description
                                eventStart
                                eventEnd
                            }
                        }`,
                    variables: {
                        userId: action.payload.userId,
                        month: action.payload?.month ?? null,
                    },
                })
            )
        )
        .pipe(
            map((response) => schedulesSuccess(response.data)),
            catchError((error) => of(failed(error.message)))
        );

const createScheduleItem = (
    action$: Observable<{ createScheduleItem: IScheduleItem }>
) =>
    action$
        .pipe(
            ofType("CREATE_SCHEDULE_ITEM"),
            switchMap((action: { payload: IScheduleItemCreate }) =>
                fetchGraphQl({
                    query: `mutation CreateScheduleItem($title: String!, $eventStart: DateTimeOffset!, $eventEnd: DateTimeOffset!, $description: String) {
                createScheduleItem(title: $title, eventStart: $eventStart, eventEnd: $eventEnd, description: $description){
                    id
                    title
                    description
                    eventStart
                    eventEnd
                }
            }`,
                    variables: {
                        title: action.payload.title,
                        eventStart: action.payload.eventStart,
                        eventEnd: action.payload.eventEnd,
                        description: action.payload?.description ?? null,
                    },
                })
            )
        )
        .pipe(
            map((response) => createScheduleItemSuccess(response.data)),
            catchError((error) => of(failed(error.message)))
        );

const updateScheduleItem = (
    action$: Observable<{ updateScheduleItem: IScheduleItem }>
) =>
    action$
        .pipe(
            ofType("UPDATE_SCHEDULE_ITEM"),
            switchMap((action: { payload: IScheduleItem }) =>
                fetchGraphQl({
                    query: `mutation UpdateScheduleItem($id: ID!, $title: String!, $eventStart: DateTimeOffset!, $eventEnd: DateTimeOffset!, $description: String) {
                    updateScheduleItem(id: $id, title: $title, eventStart: $eventStart, eventEnd: $eventEnd, description: $description){
                        id
                        title
                        description
                        eventStart
                        eventEnd
                    }
                }`,
                    variables: {
                        id: action.payload.id,
                        title: action.payload.title,
                        eventStart: action.payload.eventStart,
                        eventEnd: action.payload.eventEnd,
                        description: action.payload?.description ?? null,
                    },
                })
            )
        )
        .pipe(
            switchMap(([_, state]) => {
                const userId = state.auth.user?.id;
                if (userId) {
                    return of({type: "SCHEDULE_ITEMS", payload: {userId}});
                } else {
                    return of(failed("User ID not found in state"));
                }
            }),
            catchError((error) => of(failed(error.message)))
        );

const deleteScheduleItemById = (
    action$: Observable<{ updateScheduleItem: IScheduleItem }>
) =>
    action$
        .pipe(
            ofType("DELETE_SCHEDULE_ITEM"),
            switchMap((action: { payload: IScheduleItem }) =>
                fetchGraphQl({
                    query: `mutation DeleteScheduleItem($id: ID!) {
              deleteScheduleItem(id: $id) {
                id
                eventEnd
                eventStart
                title
                description
              }
            }`,
                    variables: {
                        id: action.payload.id,
                    },
                })
            )
        )
        .pipe(
            switchMap(([_, state]) => {
                const userId = state.auth.user?.id;
                if (userId) {
                    return of({type: "SCHEDULE_ITEMS", payload: {userId}});
                } else {
                    return of(failed("User ID not found in state"));
                }
            }),
            catchError((error) => of(failed(error.message)))
        );

export default combineEpics(
    getScheduleItems,
    createScheduleItem,
    updateScheduleItem,
    deleteScheduleItemById
);
