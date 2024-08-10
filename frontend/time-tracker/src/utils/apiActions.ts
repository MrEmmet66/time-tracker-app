import config from "../config/config.ts";
import {getToken} from "./token.ts";

export const fetchGraphQl = async (body: {
    query: string;
    variables: { email: string; password: string };
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
