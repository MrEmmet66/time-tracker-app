import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {
    Calendar,
    Scheduler,
    useArrayState,
    SchedulerExistingEvent,
    SchedulerEvent as SchedulerEventType,
} from "@cubedoodl/react-simple-scheduler";

import ScheduleItemNew from "./ScheduleItemNew";
import ScheduleItemEdit from "./ScheduleItemEdit";
import {IScheduleItem, IScheduleItemCreate} from "../../models/schedule";
import {toISOStringWithTimezone} from "../../utils/date";
import {SchedulerEvent} from "../../models/schedule";

interface IProps {
    items?: SchedulerExistingEvent[];
}

const MyCalendar = ({items}: IProps) => {
    const [isOpenCreateModal, setOpenCreateModal] = useState(false);
    const [isOpenEditModal, setOpenEditModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<SchedulerEvent | null>(null);
    const [selected, setSelected] = useState(new Date());
    const [events, setEvents, addEvent] = useArrayState(items ?? []);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!items) {
            return;
        }

        setEvents(items);
    }, [items]);

    const handleEventCancel = () => {
        setOpenCreateModal(false);
        setOpenEditModal(false);
        setCurrentEvent(null);
    };

    const handleEventAddSave = (values: IScheduleItemCreate) => {
        dispatch({
            type: "CREATE_SCHEDULE_ITEM",
            payload: {
                title: values.title,
                eventStart: toISOStringWithTimezone(new Date(values.eventStart)),
                eventEnd: toISOStringWithTimezone(new Date(values.eventEnd)),
            },
        });
        setOpenCreateModal(false);
    };

    const handleEventEditSave = (values: IScheduleItem) => {
        dispatch({
            type: "UPDATE_SCHEDULE_ITEM",
            payload: {
                id: values.id,
                title: values.title,
                eventStart: toISOStringWithTimezone(new Date(values.eventStart)),
                eventEnd: toISOStringWithTimezone(new Date(values.eventEnd)),
            },
        });

        setOpenEditModal(false);
    };

    console.log({events, items});
    const handleEventAdd = (evt: SchedulerEventType) => {
        setOpenCreateModal(true);
        setCurrentEvent(evt as SchedulerEvent);
    };

    const handleEventEdit = (evt: SchedulerEventType | undefined) => {
        if (!evt) {
            return;
        }

        setOpenEditModal(true);
        setCurrentEvent(evt as SchedulerEvent);
    };

    const handleEventDelete = () => {
        if (!currentEvent) {
            return;
        }

        dispatch({
            type: "DELETE_SCHEDULE_ITEM",
            payload: {
                id: Array.isArray(currentEvent.calendar)
                    ? currentEvent.calendar[0].name
                    : currentEvent.calendar.name,
            },
        });

        handleEventCancel();
    };

    return (
        <>
            <Calendar selected={selected} setSelected={setSelected}/>
            <Scheduler
                events={events}
                selected={selected}
                setSelected={setSelected}
                onRequestAdd={handleEventAdd}
                onRequestEdit={handleEventEdit}
            />
            {isOpenCreateModal && currentEvent && (
                <ScheduleItemNew
                    isOpen={isOpenCreateModal}
                    onCancel={handleEventCancel}
                    onCreate={handleEventAddSave}
                    event={currentEvent}
                />
            )}
            {isOpenEditModal && currentEvent && (
                <ScheduleItemEdit
                    id={
                        Array.isArray(currentEvent.calendar)
                            ? currentEvent.calendar[0].name
                            : currentEvent.calendar.name
                    }
                    event={currentEvent}
                    isOpen={isOpenEditModal}
                    onCancel={handleEventCancel}
                    onDelete={handleEventDelete}
                    onUpdate={handleEventEditSave}
                />
            )}
        </>
    );
};

export default MyCalendar;
