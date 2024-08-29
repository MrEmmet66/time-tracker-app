import {User} from "./user.ts";

export type Vacation = {
    id: number;
    startVacation: string;
    endVacation: string;
    user: User;
    status: string;
}
