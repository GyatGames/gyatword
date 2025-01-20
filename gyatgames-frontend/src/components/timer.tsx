export function timer() {
    const timeStart = new Date().getTime();

    return {
        get seconds(): string {
            const seconds = Math.ceil((new Date().getTime() - timeStart) / 1000) + 's';
            return seconds;
        },
        get ms(): string {
            const ms = (new Date().getTime() - timeStart) + 'ms';
            return ms;
        },
    };
}