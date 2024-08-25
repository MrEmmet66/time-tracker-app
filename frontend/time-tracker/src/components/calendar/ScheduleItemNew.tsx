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
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            title,
            eventStart: dayjs(event.from),
            eventEnd: dayjs(event.to),
        });
    }, [event, form]);

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

    console.log({event, eventStart, eventEnd});

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
                    <Input value={title} onChange={e => setTitle(e.target.value)}/>
                </Form.Item>
                <Form.Item
                    name="eventStart"
                    label="Start event"
                    rules={[{required: true, message: "Please enter start event!"}]}
                >
                    <DatePicker value={eventStart} onChange={setEventStart} showTime/>
                </Form.Item>
                <Form.Item
                    name="eventEnd"
                    label="End event"
                    rules={[{required: true, message: "Please enter end event!"}]}
                >
                    <DatePicker value={eventEnd} onChange={setEventEnd} showTime/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ScheduleItemNew;
