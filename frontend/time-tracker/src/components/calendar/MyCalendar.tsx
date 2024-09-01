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
    disabled?: boolean;
    currentMonth: number;
    setCurrentMonth: (month: number) => void;
}

const MyCalendar = ({
                        currentMonth,
                        items,
                        disabled = false,
                        setCurrentMonth,
                    }: IProps) => {
    const [isOpenCreateModal, setOpenCreateModal] = useState(false);
    const [isOpenEditModal, setOpenEditModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<SchedulerEvent | null>(null);
    const [selected, setSelected] = useState(new Date());
    const [events, setEvents] = useArrayState(items ?? []);
    const dispatch = useDispatch();

    useEffect(() => {
        if (items) {
            setEvents([...items]);
        }
    }, [items]);

    useEffect(() => {
        const month = selected.getMonth() + 1;

        if (currentMonth !== month) {
            setCurrentMonth(month);
        }
    }, [selected]);

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
                key={JSON.stringify(events)}
                events={events}
                selected={selected}
                setSelected={setSelected}
                onRequestAdd={disabled ? () => {
                } : handleEventAdd}
                onRequestEdit={disabled ? () => {
                } : handleEventEdit}
                editable={!disabled}
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
