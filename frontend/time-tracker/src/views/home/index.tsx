import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {DatePicker} from "antd";
import {Dayjs} from "dayjs";

import {RootState} from "../../redux/store.ts";
import LayoutPage from "../../layouts/LayoutPage.tsx";
import Timer from "../../components/timer/Timer.tsx";
import {PAGES} from "../../constants/pages.constants.ts";
import {convertSecondsToTime, formatTimeToString} from "../../utils/time.ts";
import {jwtDecode} from "jwt-decode";
import {getToken} from "../../utils/token.ts";

function Index() {
    const [date, setDate] = useState<Dayjs | null>(null);
    const {user} = useSelector((state: RootState) => state.auth);
    const {workEntries, error} = useSelector(
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

        dispatch({type: "GET_USER_BY_ID", payload: {id: user.id}})

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

    console.log({user, workEntries, error});

    return (
        <LayoutPage>
            <div>
                <div className="w-fit mx-auto">
                    <Timer/>
                </div>
                <div className="my-10">
                    <DatePicker size="middle" onChange={setDate}/>
                </div>
                <div className="mt-10 mb-5 space-y-4">
                    {workEntries?.map((workEntry) => {
                        const startDateTime = new Date(workEntry.startDateTime);
                        const endDateTime = new Date(workEntry.endDateTime);
                        const totalSeconds =
                            (endDateTime.getTime() - startDateTime.getTime()) / 1000;
                        const {hours, minutes} = convertSecondsToTime(totalSeconds);

                        return (
                            <div
                                key={workEntry.id}
                                className="px-4 py-2 grid grid-cols-2 border border-zinc-400 rounded-md divide-x divide-zinc-400"
                            >
                                <div className="px-2">
                                    <p>Start: {startDateTime.toLocaleString()}</p>
                                    <p>End: {endDateTime.toLocaleString()}</p>
                                </div>
                                <div className="px-2">
                                    <p>Total: {formatTimeToString(hours, minutes)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </LayoutPage>
    );
}

export default Index;
