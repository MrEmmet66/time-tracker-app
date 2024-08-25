import {useEffect, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";

import LayoutPage from "../../layouts/LayoutPage";
import MyCalendar from "../../components/calendar/MyCalendar";
import {RootState} from "../../redux/store";
import useGetUser from "../../hooks/use-get-user";
import {SchedulerExistingEvent} from "@cubedoodl/react-simple-scheduler";
import {splitEventsByDate} from "../../utils/calendar";

const CalendarPage = () => {
    const user = useGetUser();
    const {schedules} = useSelector((state: RootState) => state.schedule);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user) {
            return;
        }

        dispatch({type: "SCHEDULE_ITEMS", payload: {userId: user.id}});
    }, [user]);

    console.log({schedules, user, test: splitEventsByDate(schedules)});

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
            <MyCalendar items={scheduleItems as SchedulerExistingEvent[]}/>
        </LayoutPage>
    );
};

export default CalendarPage;
