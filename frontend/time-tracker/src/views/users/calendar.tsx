import {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {SchedulerExistingEvent} from "@cubedoodl/react-simple-scheduler";

import LayoutPage from "../../layouts/LayoutPage";
import {RootState} from "../../redux/store";
import {splitEventsByDate} from "../../utils/calendar";
import MyCalendar from "../../components/calendar/MyCalendar";

const UserCalendarPage = () => {
    const {id} = useParams();
    const [currentMonth, setCurrentMonth] = useState<number>(
        new Date().getMonth() + 1
    );
    const {schedules} = useSelector((state: RootState) => state.schedule);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!id) {
            return;
        }

        dispatch({
            type: "SCHEDULE_ITEMS",
            payload: {userId: id, month: currentMonth},
        });
    }, [id, currentMonth]);

    const scheduleItems = useMemo(
        () =>
            splitEventsByDate(schedules).map((item) => ({
                from: new Date(item.eventStart),
                to: new Date(item.eventEnd),
                name: item.title,
                calendar: {name: item.id.toString(), enabled: true},
            })),
        [schedules]
    );
    return (
        <LayoutPage>
            <MyCalendar
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                items={scheduleItems as SchedulerExistingEvent[]}
                disabled
            />
        </LayoutPage>
    );
};

export default UserCalendarPage;
