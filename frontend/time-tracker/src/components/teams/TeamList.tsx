import {ITeam} from "../../models/team";
import {User} from "../../models/user";
import TeamItem from "./TeamItem";

interface IProps {
    teams: ITeam[];
    users: User[];
}

const TeamList = ({teams, users}: IProps) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {teams.map((team) => (
                <TeamItem key={team.id} team={team} users={users}/>
            ))}
        </div>
    );
};

export default TeamList;
