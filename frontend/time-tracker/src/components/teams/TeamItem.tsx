import {useState} from "react";
import {Card} from "antd";
import {Typography} from "antd";

import {ITeam} from "../../models/team";
import TeamEdit from "./TeamEdit";
import {useDispatch} from "react-redux";
import {User} from "../../models/user";

interface IProps {
    team: ITeam;
    users: User[]
}

const {Title} = Typography;

const TeamItem = ({team, users}: IProps) => {
    const [isOpenModelEdit, setOpenModelEdit] = useState(false);
    const dispatch = useDispatch();

    const handleOpenModelEdit = () => setOpenModelEdit(true);

    const handleCloseModelEdit = () => setOpenModelEdit(false);

    const handleSave = (values: any) => {
        console.log({values});
        handleCloseModelEdit();
    }

    return (
        <>
            <Card
                className="py-3 border border-zinc-400"
                hoverable={true}
                title={<Title level={3}>{team.name}</Title>}
                onClick={handleOpenModelEdit}
            ></Card>
            <TeamEdit
                isOpen={isOpenModelEdit}
                onCancel={handleCloseModelEdit}
                onSave={handleSave}
                team={team}
                users={users}
            />
        </>
    );
};

export default TeamItem;
