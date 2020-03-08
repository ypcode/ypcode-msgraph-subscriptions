export const DEFAULT_SAFETY_WINDOW_IN_MSECS = 4860000; // 1h31 (Graph common delay is 4230 rounded minutes (70.5 h))

export const getExpirationDateTimeISOString = (fromNowInDays: number, safetyWindowInMsecs?: number) => {
    const now = Date.now();
    //                                day     24h 60m  60s   ms      
    // const expiration = now + (fronNowInDays * 24 * 60 * 60 * 1000);
    const expiration = now + (fromNowInDays * 86400000) - (safetyWindowInMsecs || DEFAULT_SAFETY_WINDOW_IN_MSECS);
    return new Date(expiration).toISOString();
};


export const isNearlyExpired = (dateIsoString: string, safetyWindowInMsecs?: number) => {
    const date = Date.parse(dateIsoString);
    return (date - (safetyWindowInMsecs || DEFAULT_SAFETY_WINDOW_IN_MSECS)) <= Date.now();
}