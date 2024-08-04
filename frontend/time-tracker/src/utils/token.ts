import Cookie from "js-cookie";

import {TOKEN_KEY} from "../constants/token.constants";

export const getToken = () => {
    return Cookie.get(TOKEN_KEY) ?? "";
};

export const setToken = (token: string) => {
    Cookie.set(TOKEN_KEY, token);
};

export const clearToken = () => {
    Cookie.remove(TOKEN_KEY);
};
