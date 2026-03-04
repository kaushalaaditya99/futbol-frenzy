export type Analysis = {
    numTouches: number;
    mistakes: Array<{
        mistakeType: string,
        mistakeDesc: string,
    }>
};

export async function getAnalysis(drillID: number, drillURI: string): Promise<Analysis> {
    return {
        numTouches: Math.floor(Math.random() * 10),
        mistakes: [
            {
                mistakeType: "Center of Gravity",
                mistakeDesc: "You are too hunched over, try straightening your back."
            },
            {
                mistakeType: "Outside, Not Inside",
                mistakeDesc: "You did an inside touch near the 4th cone instead of an outside touch. Make sure that you're doing the right touch."
            }
        ]
    }
}