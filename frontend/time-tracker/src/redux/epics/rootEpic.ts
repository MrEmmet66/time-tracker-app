import {combineEpics} from "redux-observable";

import authEpic from "./authEpic.ts";
import usersEpic from "./usersEpic.ts";
import workEntryEpic from "./workEntryEpic.ts";
import vacationsEpic from "./vacationsEpic.ts";

export const rootEpic = combineEpics(
    authEpic, usersEpic, workEntryEpic, vacationsEpic
)