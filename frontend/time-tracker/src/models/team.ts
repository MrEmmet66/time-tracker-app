import {IId} from "./base";
import {User} from "./user";

export interface ITeam extends IId {
    name: string;
    members?: User[];
}

export type ITeamCreate = Pick<ITeam, "name">;
