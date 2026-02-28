export interface Result {
    name: string;
    date: string;
    type: string;
    score: number;
    imageBackgroundColor: string;
    imageColor: string;
}

export function getResults(studentID: number): Array<Result> {
    // We'd contact the API here, but I don't think
    // it's ready, so we can provide some fake data.
    // But the focus is creating the skeleton structure,
    // if that makes sense.
    return [
        {
            name: "Juggling Challenge",
            date: "Feb 12",
            type: "Ball Control",
            score: 9,
            imageBackgroundColor: "#000",
            imageColor: "#FFF"
        },
        {
            name: "First Touch Control",
            date: "Feb 10",
            type: "Receiving",
            score: 6,
            imageBackgroundColor: "#CCCCCC",
            imageColor: "#000"
        }
    ];
}