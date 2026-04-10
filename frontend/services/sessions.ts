import resolveEndpoint from "./resolveEndpoint";

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
    date: Date;
    name: string;
    type: string;
    durationInMins: number;
    class: string;
    drills: Array<Drill>;
    isNew: boolean;
    isDue: boolean;
    imageBackgroundColor: string;
    imageTextColor?: string;
    uploadedBy: string;
    imageText: string;
    bookmarked: boolean;
    accessControl: string;
}

const API_URL = resolveEndpoint("/api");

export async function getSessions(token: string): Promise<Array<Session>> {
    try {
        const response = await fetch(`${API_URL}/workouts/`, {
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.log("Failed to fetch workouts:", response.status);
            return [];
        }

        const data = await response.json();

        return data.map((workout: any) => ({
            id: workout.id,
            date: workout.dueDate ? new Date(workout.dueDate) : new Date(),
            name: workout.workoutName,
            type: workout.workoutType,
            durationInMins: 0,
            class: "",
            drills: [],
            isNew: false,
            isDue: workout.dueDate ? new Date(workout.dueDate) >= new Date() : false,
            imageBackgroundColor: workout.imageBackgroundColor || "#1C1C1C",
            imageTextColor: workout.imageTextColor,
            imageText: workout.imageText || "",
            uploadedBy: "",
            bookmarked: false,
            accessControl: workout.publicWorkout ? "public" : "private",
        }));
    } catch (err) {
        console.error("Error fetching sessions:", err);
        return [];
    }
}

export async function getSession(token: string, sessionID: number): Promise<Session | null> {
    try {
        const response = await fetch(`${API_URL}/workouts/${sessionID}/`, {
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) return null;

        const workout = await response.json();

        return {
            id: workout.id,
            date: workout.dueDate ? new Date(workout.dueDate) : new Date(),
            name: workout.workoutName,
            type: workout.workoutType,
            durationInMins: 0,
            class: "",
            drills: [],
            isNew: false,
            isDue: workout.dueDate ? new Date(workout.dueDate) >= new Date() : false,
            imageBackgroundColor: workout.imageBackgroundColor || "#1C1C1C",
            imageTextColor: workout.imageTextColor,
            imageText: workout.imageText || "",
            uploadedBy: "",
            bookmarked: false,
            accessControl: workout.publicWorkout ? "public" : "private",
        };
    } catch (err) {
        console.error("Error fetching session:", err);
        return null;
    }
}

export async function submitSessionForGrading(sessionID: number, studentID: number, drills: {[drillID: number]: string}): Promise<boolean> {
    return true;
}

export async function deleteWorkout(token: string, workoutID: number): Promise<boolean> {
    const response = await fetch(`${API_URL}/workouts/${workoutID}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    return response.ok;
}
