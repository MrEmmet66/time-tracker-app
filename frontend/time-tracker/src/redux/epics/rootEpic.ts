import {combineEpics} from "redux-observable";
import authEpic from "./authEpic.ts";
import usersEpic from "./usersEpic.ts";

export const rootEpic = combineEpics(
    authEpic, usersEpic
)