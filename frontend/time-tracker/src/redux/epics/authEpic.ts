import {IAuthUser} from "./../../models/user";
import {combineEpics, ofType} from "redux-observable";
import {catchError, map, Observable, of, switchMap} from "rxjs";

import {fetchGraphQl} from "../../utils/apiActions.ts";
import {loginFailed, loginSuccess} from "../features/authSlice.ts";

const login = (action$: Observable<any>) =>
    action$
        .pipe(
            ofType("LOGIN"),
            switchMap((action: { payload: IAuthUser }) =>
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
                        password: action.payload.password,
                    },
                }),
            ),
        )
        .pipe(
            map(response => loginSuccess(response.data)),
            catchError(error => of(loginFailed(error.message))),
        );

export default combineEpics(login);
