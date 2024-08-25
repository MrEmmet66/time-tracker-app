import {combineEpics} from "redux-observable";

import authEpic from "./authEpic.ts";
import usersEpic from "./usersEpic.ts";
import workEntryEpic from "./workEntryEpic.ts";
import scheduleEpic from "./scheduleEpic.ts";
import vacationsEpic from "./vacationsEpic.ts";
import teamEpic from "./teamEpic.ts";

export const rootEpic = combineEpics(
    authEpic, teamEpic, usersEpic, workEntryEpic, scheduleEpic, vacationsEpic
)