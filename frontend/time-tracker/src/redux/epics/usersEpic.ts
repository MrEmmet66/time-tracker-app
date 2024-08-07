import {combineEpics, ofType} from "redux-observable";
import {catchError, map, of, switchMap} from "rxjs";
import {fetchGraphQl} from "../../utils/apiActions.ts";
import {createUserError, createUserSuccess, getUsersByIdSuccess, getUsersSuccess} from "../features/usersSlice.ts";

const createUser = (action$) =>
    action$.pipe(
        ofType('CREATE_USER'),
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
                  firstName
                  lastName
                } 
              }`,
            variables: {
                email: action.payload.email,
                password: action.payload.password,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName
            }
        }))
    ).pipe(map((response) => createUserSuccess(response.data)),
        catchError((error) => of(createUserError(error.message))))

const getUsers = (action$) =>
    action$.pipe(
        ofType('GET_ALL_USERS'),
        switchMap((action) =>
        fetchGraphQl({
            query: `query {
              users {
                email
                firstName
                lastName
                permissions {
                  name
                }
              }
            }`})))
.pipe(map((response) => getUsersSuccess(response.data)),
    catchError((error) => of(createUserError(error.message))))

const getUserById = (action$) =>
    action$.pipe(
        ofType('GET_USER_BY_ID'),
        switchMap((action) =>
        fetchGraphQl({
            query: ``,
            variables: {
                id: action.payload.id
            }
        })))
.pipe(map((response) => getUsersByIdSuccess(response.data)),
    catchError((error) => of(createUserError(error.message))))

export default combineEpics(createUser, getUsers, getUserById)