import dayjs from "dayjs";
import {IScheduleItem} from "../models/schedule";

export const splitEventsByDate = (events: IScheduleItem[]) => {
    const updatedEvents: IScheduleItem[] = [];

    events.forEach(event => {
        const eventStart = dayjs(event.eventStart);
        const eventEnd = dayjs(event.eventEnd);

        if (eventStart.isSame(eventEnd, 'day')) {
            updatedEvents.push(event);
        } else {
            const endOfFirstDay = eventStart.endOf('day');
            const startOfNextDay = eventEnd.startOf('day');

            updatedEvents.push({
                ...event,
                eventEnd: endOfFirstDay.format('YYYY-MM-DDTHH:mm:ss.SSS'),
            });

            updatedEvents.push({
                ...event,
                eventStart: startOfNextDay.format('YYYY-MM-DDTHH:mm:ss.SSS'),
            });
        }
    });

    return updatedEvents;
};
