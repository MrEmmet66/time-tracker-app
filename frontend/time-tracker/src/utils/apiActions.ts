import config from "../config/config.ts";
import {IAuthUser} from "../models/user.ts";
import {IWorkEntryCreate} from "../models/work-entry.ts";
import {getToken} from "./token.ts";

export const fetchGraphQl = async (body: {
    query: string;
    variables?:
        | IAuthUser
        | IWorkEntryCreate
        | { userId: number }
        | { date: string, userId?: number };
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
