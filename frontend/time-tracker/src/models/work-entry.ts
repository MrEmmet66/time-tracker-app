import {User} from "./user";

export interface IWorkEntry {
    id: number;
    startDateTime: string;
    endDateTime: string;
    user?: User;
}

export type IWorkEntryCreate = Pick<
    IWorkEntry,
    "startDateTime" | "endDateTime"
>;
