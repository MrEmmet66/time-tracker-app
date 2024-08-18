export type User = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    permissions: IPermission[];
};

export interface IPermission {
    name: string;
}

export type IAuthUser = Pick<User, "email"> & {
    password: string;
};

export type IUserCreate = Pick<User, "email" | "firstName" | "lastName"> & {
    password: string;
};

export type IUserChangePermissions = Pick<User, "id" | "permissions">;
