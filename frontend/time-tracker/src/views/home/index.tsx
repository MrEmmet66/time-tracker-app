import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {DatePicker} from "antd";
import {Dayjs} from "dayjs";

import {RootState} from "../../redux/store.ts";
import LayoutPage from "../../layouts/LayoutPage.tsx";
import Timer from "../../components/timer/Timer.tsx";
import {PAGES} from "../../constants/pages.constants.ts";
import {jwtDecode} from "jwt-decode";
import {getToken} from "../../utils/token.ts";
import WorkEntriesTable from "../../components/work-entries/WorkEntriesTable.tsx";
import WorkEntriesDateFilter from "../../components/work-entries/WorkEntriesDateFilter.tsx";

function Index() {
    const [date, setDate] = useState<Dayjs | null>(null);
    const {user} = useSelector((state: RootState) => state.auth);
    const {workEntries, error, totalPages} = useSelector(
        (state: RootState) => state.workEntry
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        try {
            jwtDecode(getToken());
        } catch {
            navigate(PAGES.LOGIN);
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!user) {
            return;
        }

        dispatch({type: "GET_USER_BY_ID", payload: {id: user.id}});

        if (date) {
            dispatch({
                type: "GET_WORK_ENTRIES_BY_DATE",
                payload: {date: date.format("YYYY-MM-DD"), userId: user.id},
            });
        } else {
            dispatch({
                type: "GET_WORK_ENTRIES_BY_USER_ID",
                payload: {userId: user.id},
            });
        }
    }, [user, date]);

    const handleFilterDateSubmit = (beginDate, stopDate) => {
        if(beginDate && stopDate) {
            dispatch({
                type: "GET_WORK_ENTRIES_BY_DATE",
                payload: { startDate: beginDate.format("YYYY-MM-DD"),
                    endDate: stopDate.format("YYYY-MM-DD"),
                    userId: user.id}
            });
        }
        else {
            dispatch({
                type: "GET_WORK_ENTRIES_BY_USER_ID",
                payload: {userId: user.id},
            });
        }
    }

    console.log({user, workEntries, error, totalPages});

    return (
        <LayoutPage>
            <div>
                <div className="w-fit mx-auto">
                    <Timer/>
                </div>
                <WorkEntriesDateFilter onDateSelect={handleFilterDateSubmit}/>
                <div className="mt-10 mb-5 space-y-4">
                    {workEntries && user && (
                        <WorkEntriesTable
                            workEntries={workEntries}
                            userId={user.id}
                            totalPages={totalPages}
                        />
                    )}
                </div>
            </div>
        </LayoutPage>
    );
}

export default Index;
