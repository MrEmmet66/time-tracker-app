import {useState, useEffect} from "react";
import {Button, Flex, Typography} from "antd";
import {
    PlayCircleFilled,
    PauseCircleOutlined,
    BorderOutlined,
} from "@ant-design/icons";
import {convertSecondsToTime, formatTimeToString} from "../../utils/time";
import {useDispatch} from "react-redux";

const {Title} = Typography;

const Timer = () => {
    const [startDateTime, setStartDateTime] = useState<Date>();
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [isPause, setPause] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        let timerInterval: number;
        if (!isPause) {
            timerInterval = setInterval(() => {
                setTotalSeconds((prevTime) => prevTime + 1);
            }, 1000);
        }

        return () => clearInterval(timerInterval);
    }, [isPause]);

    const {hours, minutes, seconds} = convertSecondsToTime(totalSeconds);

    const handlePauseClick = () => {
        if (totalSeconds === 0) {
            setStartDateTime(new Date());
        }

        setPause(!isPause);
    };

    const handleResetTimer = () => {
        setPause(true);
        setTotalSeconds(0);
    };

    const handleSubmit = () => {
        setPause(true);

        if (!startDateTime) return;

        const endDateTime = new Date(startDateTime.getTime());
        endDateTime.setSeconds(endDateTime.getSeconds() + totalSeconds);

        dispatch({
            type: "CREATE_WORK_ENTRY",
            payload: {
                startDateTime: startDateTime.toISOString(),
                endDateTime: endDateTime.toISOString(),
            },
        });
        setTotalSeconds(0);
    };

    return (
        <Flex vertical gap={4} justify="center">
            <Title className="!text-6xl">
                {formatTimeToString(hours, minutes, seconds)}
            </Title>
            <Flex
                gap={4}
                className="mx-auto text-zinc-800 stroke-zinc-800 fill-zinc-800"
                align="center"
            >
                {totalSeconds > 0 && (
                    <Button className="text-lg" onClick={handleResetTimer}>
                        Reset
                    </Button>
                )}
                <Button
                    className="p-2 h-16 w-16 rounded-full"
                    onClick={handlePauseClick}
                >
                    {isPause ? (
                        <PlayCircleFilled className="w-full h-full [&>svg]:w-full [&>svg]:h-full"/>
                    ) : (
                        <PauseCircleOutlined className="w-full h-full [&>svg]:w-full [&>svg]:h-full"/>
                    )}
                </Button>
                {totalSeconds > 0 && (
                    <Button className="p-4 h-16 w-16 rounded-full" onClick={handleSubmit}>
                        <BorderOutlined className="w-full h-full [&>svg]:w-full [&>svg]:h-full"/>
                    </Button>
                )}
            </Flex>
        </Flex>
    );
};

export default Timer;
