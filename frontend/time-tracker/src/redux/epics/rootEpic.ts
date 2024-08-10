import {combineEpics} from "redux-observable";

import authEpic from "./authEpic.ts";
import usersEpic from "./usersEpic.ts";
import workEntryEpic from "./workEntryEpic.ts";

export const rootEpic = combineEpics(
    authEpic, usersEpic, workEntryEpic
)