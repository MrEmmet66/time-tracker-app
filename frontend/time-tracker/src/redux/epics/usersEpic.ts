import {combineEpics, ofType, StateObservable} from "redux-observable";
import {catchError, map, Observable, of, switchMap, withLatestFrom} from "rxjs";
import {fetchGraphQl} from "../../utils/apiActions.ts";
import {
    createUserError,
    createUserSuccess,
    getUsersByIdSuccess,
    getUsersSuccess,
    updatePermissionsError,
    updatePermissionsSuccess,
    changePasswordSuccess,
    updateUserSuccess,
    getUsersError,
    getUsersByIdError
} from "../features/usersSlice.ts";
import {RootState} from "../store.ts";

const createUser = (action$: Observable<any>) =>
    action$
        .pipe(
            ofType("CREATE_USER"),
            switchMap((action) =>
                fetchGraphQl({
                    query: `mutation CreateUser($email: String!
                            $password: String! 
                            $firstName: String! 
                            $lastName: String!) {
                        createUser(email:$email firstName:$firstName password:$password lastName:$lastName) {
                            id
                            permissions {
                                name
                            }
                            isActive
                            email
                            firstName
                            lastName
                        } 
                     }`,
                    variables: {
                        email: action.payload.email,
                        password: action.payload.password,
                        firstName: action.payload.firstName,
                        lastName: action.payload.lastName,
                    },
                })
            )
        )
        .pipe(
            map((response) => createUserSuccess(response.data)),
            catchError((error) => of(createUserError(error.message)))
        );

const getUsers = (action$: Observable<any>) =>
    action$
        .pipe(
            ofType("GET_ALL_USERS"),
            switchMap((action) =>
                fetchGraphQl({
                    query: `query GetUserById($page: Int){
                        users (page: $page) {
                            entities {
                                id
                                email
                                firstName
                                lastName
                                isActive
                                permissions {
                                    name
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
            map((response) => getUsersSuccess(response.data)),
            catchError((error) => of(createUserError(error.message)))
        );

const getUserById = (action$: Observable<any>) =>
    action$
        .pipe(
            ofType("GET_USER_BY_ID"),
            switchMap((action) =>
                fetchGraphQl({
                    query: `query GetUserById($id:ID!) {
                        user(id:$id) {
                            id
                            email
                            firstName
                            lastName
                            permissions {
                                name
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
            map((response) => getUsersByIdSuccess(response.data)),
            catchError((error) => of(createUserError(error.message)))
        );

const updateUser = (action$: Observable<any>, state$: StateObservable<RootState>) =>
    action$
        .pipe(
            ofType("UPDATE_USER"),
            switchMap((action) =>
                fetchGraphQl({
                    query: `mutation EditUser($id: ID! $email: String! $firstName: String! $lastName: String!) {
                                editUser(id: $id, email: $email, firstName: $firstName, lastName: $lastName){
                                    id
                                    firstName
                                    lastName
                                    email
                                    isActive
                                }
                            }`,
                    variables: {
                        id: action.payload.id,
                        email: action.payload.email,
                        firstName: action.payload.firstName,
                        lastName: action.payload.lastName,
                    },
                })
            ),
            withLatestFrom(state$),
            switchMap(([_, state]) => {
                const userId = state.auth.user?.id;
                updateUserSuccess();
                if (userId) {
                    return of({type: "GET_USER_BY_ID", payload: {id: userId}});
                } else {
                    return of(getUsersByIdError("User ID not found in state"));
                }
            }),
            catchError((error) => of(getUsersByIdError(error.message)))
        )


const changePassword = (action$: Observable<any>) =>
    action$
        .pipe(
            ofType("CHANGE_PASSWORD"),
            switchMap((action) =>
                fetchGraphQl({
                    query: `mutation ChangePassword($password: String! $newPassword: String!) {
                                        changePassword(password: $password, newPassword: $newPassword)
                                    }`,
                    variables: {
                        password: action.payload.password,
                        newPassword: action.payload.newPassword,
                    },
                })
            )
        )
        .pipe(
            map(() => changePasswordSuccess()),
            catchError((error) => of(getUsersError(error.message)))
        );

const updatePermissions = (action$: Observable<any>) =>
    action$
        .pipe(
            ofType("UPDATE_PERMISSIONS"),
            switchMap((action) =>
                fetchGraphQl({
                    query: `mutation UpdatePermissions($id:ID! $permissions:[String]!) {
                        updatePermissions(id:$id permissions:$permissions) {
                            id
                            permissions {
                                name
                            }
                        }
                    }`,
                    variables: {
                        id: action.payload.id,
                        permissions: action.payload.permissions,
                    },
                })
            )
        )
        .pipe(
            map((response) => updatePermissionsSuccess(response.data)),
            catchError((error) => of(updatePermissionsError(error.message)))
        );

export default combineEpics(
    createUser,
    getUsers,
    getUserById,
    updatePermissions,
    updateUser,
    changePassword
);
