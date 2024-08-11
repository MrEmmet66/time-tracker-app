import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "antd";

import LayoutPage from "../../layouts/LayoutPage";
import TeamCreate from "../../components/teams/TeamCreate";
import {RootState} from "../../redux/store";
import TeamList from "../../components/teams/TeamList";
import {usePermissionCheck} from "../../hooks/use-permissions-check";
import {PERMISSIONS} from "../../constants/permissions.constants";

const TeamsPage = () => {
    const [isOpenModal, setOpenModal] = useState(false);
    const {teams} = useSelector((state: RootState) => state.team);
    const {users} = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch();

    usePermissionCheck([
        PERMISSIONS.MANAGE_ALL_MEMBERS,
        PERMISSIONS.MANAGE_TEAM_MEMBERS,
    ]);

    useEffect(() => {
        dispatch({type: "GET_ALL_USERS"});
        dispatch({type: "GET_TEAMS"});
    }, []);

    const handleOpenModel = () => setOpenModal(true);

    const handleCloseModel = () => setOpenModal(false);

    const handleCreateTeam = (values: any) => {
        dispatch({type: "CREATE_TEAM", payload: values});
        handleCloseModel();
    };

    console.log({teams});

    return (
        <LayoutPage>
            <Button type="primary" onClick={handleOpenModel}>
                Create Team
            </Button>
            <TeamCreate
                isOpen={isOpenModal}
                onCancel={handleCloseModel}
                onCreate={handleCreateTeam}
            />
            <div className="my-10">
                {teams && <TeamList teams={teams} users={users ?? []}/>}
            </div>
        </LayoutPage>
    );
};

export default TeamsPage;
