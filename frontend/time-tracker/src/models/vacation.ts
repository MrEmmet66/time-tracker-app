import {User} from "./user.ts";

export type Vacation = {
    id: number;
    startDate: Date;
    endDate: Date;
    user: User;
    status: string;
}
