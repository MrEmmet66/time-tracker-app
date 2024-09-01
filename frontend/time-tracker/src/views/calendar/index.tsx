import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import LayoutPage from "../../layouts/LayoutPage";
import MyCalendar from "../../components/calendar/MyCalendar";
import {RootState} from "../../redux/store";
import useGetUser from "../../hooks/use-get-user";
import {SchedulerExistingEvent} from "@cubedoodl/react-simple-scheduler";
import {splitEventsByDate} from "../../utils/calendar";

const CalendarPage = () => {
    const user = useGetUser();
    const [currentMonth, setCurrentMonth] = useState<number>(
        new Date().getMonth() + 1
    );
    const {schedules} = useSelector((state: RootState) => state.schedule);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user) {
            return;
        }

        dispatch({
            type: "SCHEDULE_ITEMS",
            payload: {userId: user.id, month: currentMonth},
        });
    }, [user, currentMonth]);

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
            />
        </LayoutPage>
    );
};

export default CalendarPage;
