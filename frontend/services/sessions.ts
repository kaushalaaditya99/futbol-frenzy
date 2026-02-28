export interface Drill {
    id: number;
    url: string;
    name: string;
    type: string;
    time: number;
    level: string;
    instructions: string;
}

export interface Session {
    id: number;
    name: string;
    type: string;
    time: number;
    class: string;
    isNew: boolean;
    isDue: boolean;
    imageBackgroundColor: string;
    imageEmoji: string;
    drills: Array<Drill>;
}

export async function getSessions(studentID: number): Promise<Array<Session>> {
    // We'd contact the API here, but I don't think
    // it's ready, so we can provide some fake data.
    // But the focus is creating the skeleton structure,
    // if that makes sense.
    return [
        {
            id: 0,
            name: "Cone Dribbling",
            type: "Ball Control",
            time: 5,
            class: "U12 Boys",
            isNew: true,
            isDue: false,
            imageBackgroundColor: "#1C1C1C",
            imageEmoji: "🏃‍♂️",
            drills: []
        },
        {
            id: 1,
            name: "Wall Pass & Receive",
            type: "Passing",
            time: 8,
            class: "U12 Boys",
            isNew: true,
            isDue: false,
            imageBackgroundColor: "#000",
            imageEmoji: "⚽",
            drills: []
        },
        {
            id: 2,
            name: "Shooting Accuracy",
            type: "Shooting",
            time: 10,
            class: "U12 Boys",
            isNew: false,
            isDue: true,
            imageBackgroundColor: "#e9e9e9",
            imageEmoji: "🥅",
            drills: []
        }
    ];
}

export async function getSession(sessionID: number, sestudentID: number): Promise<Session> {
    const sessions: Array<Session> = [
        {
            id: 0,
            name: "Cone Dribbling",
            type: "Ball Control",
            time: 5,
            class: "U12 Boys",
            isNew: true,
            isDue: false,
            imageBackgroundColor: "#1C1C1C",
            imageEmoji: "🏃‍♂️",
            drills: []
        },
        {
            id: 1,
            name: "Wall Pass & Receive",
            type: "Passing",
            time: 8,
            class: "U12 Boys",
            isNew: true,
            isDue: false,
            imageBackgroundColor: "#000",
            imageEmoji: "⚽",
            drills: []
        },
        {
            id: 2,
            name: "Shooting Accuracy",
            type: "Shooting",
            time: 10,
            class: "U12 Boys",
            isNew: false,
            isDue: true,
            imageBackgroundColor: "#e9e9e9",
            imageEmoji: "🥅",
            drills: []
        },
        {
            id: 3,
            name: "Passing & Movement",
            type: "Passing",
            time: 60,
            class: "U12 Boys",
            isNew: false,
            isDue: true,
            imageBackgroundColor: "#e9e9e9",
            imageEmoji: "🙂",
            drills: [
                {
                    id: 0,
                    url: "@/assets/videos/video.mp4",
                    name: "Rondo (Keep Away)",
                    type: "Possession",
                    time: 10,
                    level: "Beginner",
                    instructions: "Players form a circle with 2 defenders in the middle. The outer players must keep possession by passing quickly and moving to create passing lanes.",
                },
                {
                    id: 1,
                    url: "@/assets/videos/video2.mp4",
                    name: "Pass and Follow",
                    type: "Passing",
                    time: 10,
                    level: "Beginner",
                    instructions: "Players line up in two lines facing each other. The first player passes to the player opposite and then follows their pass, joining the back of the opposite line. Focus on weight and accuracy of the pass.",

                },
                {
                    id: 2,
                    url: "@/assets/videos/video3.mp4",
                    name: "Triangle Passing",
                    type: "Passing & Movement Off the Ball",
                    time: 15,
                    level: "Intermediate",
                    instructions: "Three players set up in a triangle. They pass in sequence around the triangle, then switch direction. Add a defender in the middle to increase difficulty.",

                },
                {
                    id: 3,
                    url: "@/assets/videos/video4.mp4",
                    name: "Combination Play into Goal",
                    type: "Passing & Finishing",
                    time: 15,
                    level: "Beginner",
                    instructions: "Players practice a set combination — a wall pass followed by a through ball into a striker who finishes on goal. Rotate positions after each turn.",

                }
            ]
        },
    ];
    
    return sessions[3];
}


export async function submitSessionForGrading(sessionID: number, studentID: number, drills: {[drillID: number]: string}): Promise<boolean> {
    return true;
}