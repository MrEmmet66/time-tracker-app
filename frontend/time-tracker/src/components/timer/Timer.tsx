import {Button, Flex, Typography} from "antd";
import {
    PlayCircleFilled,
    PauseCircleOutlined,
    BorderOutlined,
} from "@ant-design/icons";
import {convertSecondsToTime, formatTimeToString} from "../../utils/time";
import {useDispatch} from "react-redux";
import useTimer from "../../hooks/use-timer";

const {Title} = Typography;

interface IProps {
    isInHeader?: boolean;
}

const Timer = ({isInHeader = false}: IProps) => {
    const {totalSeconds, isPause, startDateTime, pause, reset} =
        useTimer();

    const dispatch = useDispatch();

    const {hours, minutes, seconds} = convertSecondsToTime(totalSeconds);

    const handlePauseClick = () => {
        pause(!isPause);
    };

    const handleResetTimer = () => {
        reset();
    };

    const handleSubmit = () => {
        pause(true);

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
        handleResetTimer();
    };

    return (
        <Flex
            className={isInHeader ? "flex-row gap-4" : "flex-col gap-2"}
            justify="center"
        >
            <Title className={isInHeader ? "!text-3xl !m-0" : "!text-6xl"}>
                {formatTimeToString(hours, minutes, seconds)}
            </Title>
            <Flex
                gap={4}
                className="mx-auto text-zinc-800 stroke-zinc-800 fill-zinc-800"
                align="center"
            >
                {totalSeconds > 0 && (
                    <Button
                        className={isInHeader ? "text-base" : "text-lg"}
                        onClick={handleResetTimer}
                    >
                        Reset
                    </Button>
                )}
                <Button
                    className={`p-2 rounded-full ${isInHeader ? "h-8 w-8" : "h-16 w-16"}`}
                    onClick={handlePauseClick}
                >
                    {isPause ? (
                        <PlayCircleFilled className="w-full h-full [&>svg]:w-full [&>svg]:h-full"/>
                    ) : (
                        <PauseCircleOutlined className="w-full h-full [&>svg]:w-full [&>svg]:h-full"/>
                    )}
                </Button>
                {totalSeconds > 0 && (
                    <Button
                        className={`rounded-full ${
                            isInHeader ? "p-2 h-8 w-8" : "p-4 h-16 w-16"
                        }`}
                        onClick={handleSubmit}
                    >
                        <BorderOutlined className="w-full h-full [&>svg]:w-full [&>svg]:h-full"/>
                    </Button>
                )}
            </Flex>
        </Flex>
    );
};

export default Timer;
