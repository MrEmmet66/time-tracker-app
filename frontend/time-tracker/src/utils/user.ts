import {PERMISSIONS} from "../constants/permissions.constants";
import {IPermission} from "../models/user";
import {clearToken} from "./token";

export const userHasAccess = (
    userPermissions: IPermission[],
    permission: PERMISSIONS
) => {
    return userPermissions.some((perm) => perm.name === permission);
};

export const logout = () => {
    clearToken();
};
