import {combineEpics, ofType} from "redux-observable";
import {catchError, map, of, switchMap} from "rxjs";
import {fetchGraphQl} from "../../utils/apiActions.ts";
import {loginFailed, loginSuccess} from "../features/authSlice.ts";

const login = (action$) =>
    action$.pipe(
        ofType('LOGIN'),
        switchMap((action) =>
        fetchGraphQl({
            query: `mutation Login($email: String! $password:String!) {
                          login(email: $email, password:$password) {
                            token
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
            variables: {
                email: action.payload.email,
                password: action.payload.password
            }
        }))
    ).pipe(map((response) => loginSuccess(response.data)),
        catchError((error) => of(loginFailed(error.message))))

export default combineEpics(login)
