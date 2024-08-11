import {PERMISSIONS} from "../constants/permissions.constants";
import {IPermission} from "../models/user";
import {clearToken} from "./token";

export const userHasAccess = (
    userPermissions: IPermission[],
    permissions: PERMISSIONS | PERMISSIONS[]
) => {
    if (Array.isArray(permissions)) {
        return permissions.some((requiredPermission) =>
            userPermissions.some((perm) => perm.name === requiredPermission)
        );
    }

    return userPermissions.some((perm) => perm.name === permissions);
};

export const logout = () => {
    clearToken();
};
