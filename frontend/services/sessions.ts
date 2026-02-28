export interface Session {
    name: string;
    type: string;
    time: number;
    class: string;
    isNew: boolean;
    isDue: boolean;
    imageBackgroundColor: string;
    imageEmoji: string;
}

export function getSessions(studentID: number): Array<Session> {
    // We'd contact the API here, but I don't think
    // it's ready, so we can provide some fake data.
    // But the focus is creating the skeleton structure,
    // if that makes sense.
    return [
        {
            name: "Cone Dribbling",
            type: "Ball Control",
            time: 5,
            class: "U12 Boys",
            isNew: true,
            isDue: false,
            imageBackgroundColor: "#1C1C1C",
            imageEmoji: "🏃‍♂️"
        },
        {
            name: "Wall Pass & Receive",
            type: "Passing",
            time: 8,
            class: "U12 Boys",
            isNew: true,
            isDue: false,
            imageBackgroundColor: "#000",
            imageEmoji: "⚽"
        },
        {
            name: "Shooting Accuracy",
            type: "Shooting",
            time: 10,
            class: "U12 Boys",
            isNew: false,
            isDue: true,
            imageBackgroundColor: "#e9e9e9",
            imageEmoji: "🥅"
        }
    ];
}