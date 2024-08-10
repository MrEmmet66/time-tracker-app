export const convertSecondsToTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {hours, minutes, seconds};
};

export const formatTimeToString = (
    hours: number,
    minutes: number,
    seconds?: number
) => {
    const hoursStr = hours.toString().padStart(2, "0");
    const minutesStr = `:${minutes.toString().padStart(2, "0")}`;
    const secondsStr =
        seconds !== undefined ? `:${seconds.toString().padStart(2, "0")}` : "";

    return hoursStr + minutesStr + secondsStr;
};
