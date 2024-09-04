import {Form, Modal, DatePicker, Input} from "antd";
import dayjs from "dayjs";

import {SchedulerEvent} from "@cubedoodl/react-simple-scheduler";
import {useEffect, useState} from "react";

interface IProps {
    isOpen: boolean;
    onCancel: () => void;
    onCreate: (values: any) => void;
    event: SchedulerEvent;
}

const ScheduleItemNew = ({isOpen, event, onCancel, onCreate}: IProps) => {
    const [title, setTitle] = useState<string>("");
    const [eventStart, setEventStart] = useState<dayjs.Dayjs>(dayjs(event.from));
    const [eventEnd, setEventEnd] = useState<dayjs.Dayjs>(dayjs(event.to));
    const [differentEventTime, setDifferentEventTime] = useState(
        eventEnd.diff(eventStart)
    );
    const [form] = Form.useForm();
    const maxDate = dayjs(eventStart).add(8, "hour");

    useEffect(() => {
        form.setFieldsValue({
            title,
            eventStart: dayjs(event.from),
            eventEnd: dayjs(event.to),
        });
    }, [event, form]);

    useEffect(() => {
        const newEventEnd = eventStart.add(differentEventTime, "milliseconds");
        setEventEnd(newEventEnd);

        const diffTime = eventEnd.diff(eventStart);
        setDifferentEventTime(diffTime);
        form.setFieldsValue({
            eventEnd: dayjs(newEventEnd),
        });
    }, [eventStart]);

    useEffect(() => {
        const diffTime = eventEnd.diff(eventStart);
        setDifferentEventTime(diffTime);
    }, [eventEnd]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                form.resetFields();
                onCreate(values);
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    return (
        <Modal
            open={isOpen}
            title="Add a new event"
            okText="Add"
            cancelText="Cancel"
            onOk={handleOk}
            onCancel={onCancel}
        >
            <Form form={form} layout="vertical" name="date_range">
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{required: true, message: "Please enter title event!"}]}
                >
                    <Input value={title} onChange={(e) => setTitle(e.target.value)}/>
                </Form.Item>
                <Form.Item
                    name="eventStart"
                    label="Start event"
                    rules={[{required: true, message: "Please enter start event!"}]}
                >
                    <DatePicker
                        disabledDate={(currentDate) =>
                            currentDate && currentDate < dayjs().startOf("day")
                        }
                        value={eventStart}
                        onChange={setEventStart}
                        showTime
                    />
                </Form.Item>
                <Form.Item
                    name="eventEnd"
                    label="End event"
                    rules={[{required: true, message: "Please enter end event!"}]}
                >
                    <DatePicker
                        value={eventEnd}
                        onChange={setEventEnd}
                        showTime
                        disabledDate={(currentDate) => {
                            // Дозволяє вибір лише сьогоднішньої дати і завтрашньої дати
                            const startOfToday = dayjs(eventStart).startOf("day");
                            const endOfTomorrow = startOfToday.add(1, "day").endOf("day");

                            return (
                                currentDate &&
                                (currentDate < startOfToday || currentDate > endOfTomorrow)
                            );
                        }}
                        disabledTime={(current) => {
                            if (!current) {
                                return {
                                    disabledHours: () => [],
                                    disabledMinutes: () => [],
                                    disabledSeconds: () => [],
                                };
                            }

                            const startHour = dayjs(eventStart).hour();
                            const maxHour = maxDate.hour();

                            return {
                                disabledHours: () => {
                                    const hours = [];
                                    for (let i = 0; i < 24; i++) {
                                        if (i < startHour || i > maxHour) {
                                            hours.push(i);
                                        }
                                    }
                                    return hours;
                                },
                                disabledMinutes: (selectedHour) => {
                                    const startMinute = dayjs(eventStart).minute();
                                    const maxMinute = maxDate.minute();

                                    if (selectedHour === startHour) {
                                        return Array.from({length: 60}, (_, i) =>
                                            i < startMinute ? i : null
                                        ).filter((x) => x !== null);
                                    }

                                    if (selectedHour === maxHour) {
                                        return Array.from({length: 60}, (_, i) =>
                                            i > maxMinute ? i : null
                                        ).filter((x) => x !== null);
                                    }

                                    return [];
                                },
                                disabledSeconds: () => [],
                            };
                        }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ScheduleItemNew;
