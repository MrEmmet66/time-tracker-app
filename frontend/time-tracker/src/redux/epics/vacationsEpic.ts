import {catchError, map, Observable, of, switchMap} from "rxjs";
import {fetchGraphQl} from "../../utils/apiActions.ts";
import {combineEpics, ofType} from "redux-observable";
import {
    approveVacationSuccess,
    createVacationApplicationError,
    createVacationApplicationSuccess,
    getAllVacationsError,
    getAllVacationsSuccess,
    getUserVacationsError,
    getUserVacationsSuccess,
    getVacationsByPageError,
    getVacationsByPageSuccess,
    rejectVacationSuccess,
    vacationActionError
} from "../features/vacationsSlice.ts";

const createVacationApplication = (action$: Observable<any>) =>
    action$
        .pipe(
            ofType("CREATE_VACATION_APPLICATION"),
            switchMap((action) =>
                fetchGraphQl({
                    query: `mutation CreateVacationApplication($userId:ID!
                      $startVacation:DateTime!
                      $endVacation:DateTime!) {
                        createVacationApplication(userId:$userId startVacation:$startVacation endVacation:$endVacation) {
                          id
                          startVacation
                          endVacation
                          status
                        }
                      }`,
                    variables: {
                        userId: action.payload.userId,
                        startVacation: action.payload.startVacation,
                        endVacation: action.payload.endVacation,
                    },
                })
            )
        )
        .pipe(
            map((response) => createVacationApplicationSuccess(response.data)),
            catchError((error) => of(createVacationApplicationError(error.message)))
        );

const userVacations = (action$: Observable<any>) =>
    action$.pipe(
        ofType("GET_USER_VACATIONS"),
        switchMap((action) =>
            fetchGraphQl({
                query: `query GetUserVacations($userId:ID!) {
                    userVacations(userId:$userId) {
                      id
                      startVacation
                      endVacation
                      status
                    }
                  }`,
                variables: {
                    userId: action.payload.userId,
                },
            }))
    ).pipe(
        map((response) => getUserVacationsSuccess(response.data)),
        catchError((error) => of(getUserVacationsError(error.message)))
    );

const allVacations = (action$: Observable<any>) =>
    action$.pipe(
        ofType("GET_ALL_VACATIONS"),
        switchMap((action) =>
        fetchGraphQl({
            query: `query GetVacations($page:Int!) {
                  vacations(page:$page) {
                    totalPages
                    
                    entities {
                      id
                      status
                      startVacation
                      endVacation
                      user {
                        firstName
                        lastName
                        id
                      }
                    }
                  }
                }`,
            variables: {
                page: action.payload.page
            }
        }))
    ).pipe(
        map((response) => getAllVacationsSuccess(response.data)),
        catchError((error) => of(getAllVacationsError(error.message))
    ));


const approveVacation = (action$: Observable<any>) =>
    action$.pipe(
        ofType('APPROVE_VACATION'),
        switchMap((action) =>
            fetchGraphQl({
                query: `mutation ApproveVacation($id:ID!) {
                  approveVacation(vacationId:$id) {
                    id
                    status
                  }
                }`,
                variables: {
                    id: action.payload.id
                }
            })
        )
    ).pipe(
        map((response) => approveVacationSuccess(response.data)),
        catchError((error) => of(vacationActionError(error.message))
    ));

const rejectVacation = (action$: Observable<any>) =>
    action$.pipe(
        ofType('REJECT_VACATION'),
        switchMap((action) =>
            fetchGraphQl({
                query: `mutation RejectVacation($id:ID!) {
                  rejectVacation(vacationId:$id) {
                    id
                    status
                  }
                }`,
                variables: {
                    id: action.payload.id
                }
            })
        )
    ).pipe(
        map((response) => rejectVacationSuccess(response.data)),
        catchError((error) => of(vacationActionError(error.message))
    ));


export default combineEpics(
    createVacationApplication,
    userVacations,
    allVacations,
    approveVacation,
    rejectVacation,
);


