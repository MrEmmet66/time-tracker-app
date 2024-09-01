import {Form, Modal, DatePicker, Input, Button} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

import {SchedulerEvent} from "@cubedoodl/react-simple-scheduler";
import {useEffect, useState} from "react";

interface IProps {
    id: string;
    isOpen: boolean;
    event: SchedulerEvent & { name: string };
    onCancel: () => void;
    onDelete: () => void;
    onUpdate: (values: any) => void;
}

const ScheduleItemEdit = ({
                              id,
                              isOpen,
                              event,
                              onCancel,
                              onDelete,
                              onUpdate,
                          }: IProps) => {
    const [title, setTitle] = useState<string>("");
    const [eventStart, setEventStart] = useState<dayjs.Dayjs>(dayjs(event.from));
    const [eventEnd, setEventEnd] = useState<dayjs.Dayjs>(dayjs(event.to));
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            title: event.name,
            eventStart: dayjs(event.from),
            eventEnd: dayjs(event.to),
        });
    }, [event, form]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                form.resetFields();
                onUpdate({...values, id});
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    return (
        <Modal
            open={isOpen}
            title="Update event"
            okText="Update"
            cancelText="Cancel"
            onOk={handleOk}
            onCancel={onCancel}
            footer={[
                <Button danger onClick={onDelete}>
                    <DeleteOutlined/>
                </Button>,
                <Button onClick={onCancel}>Cancel</Button>,
                <Button type="primary" onClick={handleOk}>
                    Update
                </Button>,
            ]}
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
                        disabledDate={(currentDate) =>
                            currentDate && currentDate < dayjs(eventStart).endOf("day")
                        }
                        value={eventEnd}
                        onChange={setEventEnd}
                        showTime
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ScheduleItemEdit;
