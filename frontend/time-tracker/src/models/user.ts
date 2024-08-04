export type User = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    permissions: IPermission[];
};

export interface IPermission {
    name: string;
}

export type IAuthUser = Pick<User, "email"> & {
    password: string;
};
