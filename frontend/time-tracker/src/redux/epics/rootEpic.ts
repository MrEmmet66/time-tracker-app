import {combineEpics} from "redux-observable";
import authEpic from "./authEpic.ts";

export const rootEpic = combineEpics(
    authEpic
)