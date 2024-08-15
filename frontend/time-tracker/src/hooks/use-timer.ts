import {useEffect, useRef, useState} from "react";

import {
    getTotalSeconds,
    removeTotalSeconds,
    setTotalSeconds as saveTotalSeconds,
    setStartDateTime as saveStartDateTime,
    getStartDateTime,
    removeStartDateTime,
} from "../utils/timer";

const useTimer = () => {
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [startDateTime, setStartDateTime] = useState<Date>();
    const [isPause, setPause] = useState(true);
    const totalSecondsRef = useRef(totalSeconds);

    useEffect(() => {
        const savedSeconds = getTotalSeconds();
        const savedStartDateTime = getStartDateTime();

        if (savedSeconds) {
            setTotalSeconds(savedSeconds);
            setPause(false);
        }

        if (savedStartDateTime) {
            setStartDateTime(new Date(savedStartDateTime));
        }

        () => {
            if (startDateTime) {
                saveStartDateTime(startDateTime);
            }
        };
    }, []);

    useEffect(() => {
        totalSecondsRef.current = totalSeconds;
    }, [totalSeconds]);

    useEffect(() => {
        let timerInterval: number;

        if (!isPause) {
            timerInterval = setInterval(() => {
                setTotalSeconds((prevTime) => prevTime + 1);
            }, 1000);
        }

        return () => clearInterval(timerInterval);
    }, [isPause]);

    useEffect(() => {
        if (!isPause && totalSeconds !== 0) {
            const saveTimerInterval = setInterval(() => {
                saveTotalSeconds(totalSecondsRef.current);
            }, 1000 * 60);

            return () => {
                clearInterval(saveTimerInterval);
                saveTotalSeconds(totalSecondsRef.current);
            };
        }
    }, [isPause]);

    const reset = () => {
        totalSecondsRef.current = 0;
        setTotalSeconds(0);
        removeTotalSeconds();
        setPause(true);
        removeStartDateTime();
    };

    const pause = (state = true) => {
        setPause(state);

        if (totalSeconds === 0) {
            const start = new Date();
            setStartDateTime(start);
            saveStartDateTime(start);
        }

        if (state && totalSeconds !== 0) {
            saveTotalSeconds(totalSeconds);
        }
    };

    return {totalSeconds, isPause, startDateTime, pause, reset};
};

export default useTimer;
