import config from "../config/config.ts";
import {IId} from "../models/base.ts";
import {ITeamCreate} from "../models/team.ts";
import {
    IAuthUser,
    IUserChangePermissions,
    IUserCreate,
} from "../models/user.ts";
import {IWorkEntryCreate} from "../models/work-entry.ts";
import {getToken} from "./token.ts";

export const fetchGraphQl = async (body: {
    query: string;
    variables?:
        | IAuthUser
        | IUserCreate
        | IId
        | IUserChangePermissions
        | IWorkEntryCreate
        | ITeamCreate
        | { userId: number, teamId?: number }
        | { date: string; userId?: number }
        | { password: string, newPassword: string }
}) => {
    const response = await fetch(config.API_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getToken(),
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};
