import {SchedulerEvent as SchedulerEventType} from "@cubedoodl/react-simple-scheduler";
import {IId} from "./base";

export interface IScheduleItem extends IId {
    title: string;
    description: string | null;
    eventStart: string;
    eventEnd: string;
}

export type IScheduleItemCreate = Omit<IScheduleItem, "id">;

export type SchedulerEvent = SchedulerEventType & { name: string };
