import {START_DATE_TIME_KEY, TIMER_KEY} from "../constants/timer.constants";

export const getTotalSeconds = () => {
    const totalSeconds = +(localStorage.getItem(TIMER_KEY) ?? 0);
    console.log({totalSeconds});
    if (isNaN(totalSeconds)) return 0;

    return totalSeconds;
};

export const setTotalSeconds = (totalSeconds: number) => {
    localStorage.setItem(TIMER_KEY, totalSeconds.toString());
};

export const removeTotalSeconds = () => {
    localStorage.removeItem(TIMER_KEY);
};

export const getStartDateTime = () => {
    return localStorage.getItem(START_DATE_TIME_KEY);
};

export const setStartDateTime = (startDateTime: Date) => {
    localStorage.setItem(START_DATE_TIME_KEY, startDateTime.toString());
};

export const removeStartDateTime = () => {
    localStorage.removeItem(START_DATE_TIME_KEY);
};
