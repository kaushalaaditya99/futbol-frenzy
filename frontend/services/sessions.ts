import { Drill } from "./drills";
import resolveEndpoint from "./resolveEndpoint";
import { User } from "./user";

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
    coach: User;
    publicWorkout: boolean;
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
            // console.log("Failed to fetch workouts:", response.status);
            return [];
        }

        const data = await response.json();

        return data.map((workout: any) => ({
            ...workout,
            id: workout.id,
            date: workout.dueDate ? new Date(workout.dueDate) : new Date(),
            name: workout.workoutName,
            type: workout.workoutType,
            durationInMins: 0,
            class: "",
            drills: workout.drills || [],
            isNew: false,
            isDue: workout.dueDate ? new Date(workout.dueDate) >= new Date() : false,
            imageBackgroundColor: workout.imageBackgroundColor || "#1C1C1C",
            imageTextColor: workout.imageTextColor,
            imageText: workout.imageText || "",
            uploadedBy: "",
            // bookmarked: false,
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
            ...workout,
            id: workout.id,
            date: workout.dueDate ? new Date(workout.dueDate) : new Date(),
            name: workout.workoutName,
            type: workout.workoutType,
            durationInMins: 0,
            coach: workout.coach,
            class: "",
            drills: workout.drills,
            isNew: false,
            isDue: workout.dueDate ? new Date(workout.dueDate) >= new Date() : false,
            imageBackgroundColor: workout.imageBackgroundColor || "#1C1C1C",
            imageTextColor: workout.imageTextColor,
            imageText: workout.imageText || "",
            uploadedBy: "",
            // bookmarked: false,
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

export interface CreateSessionData {
    workoutName: string;
    workoutType: string;
    dueDate: string | null;
    coachID: number;
    imageBackgroundColor: string;
    imageText: string;
    imageTextColor: string;
    publicWorkout: boolean;
    drills: Array<{ drillID: number; minutes?: number; repetitions?: number }>;
}

export async function createSession(token: string, data: CreateSessionData): Promise<{ success: boolean; id?: number; error?: string }> {
    try {
        const response = await fetch(`${API_URL}/workouts/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Failed to create session:", response.status, errorData);
            return { success: false, error: JSON.stringify(errorData) };
        }

        const result = await response.json();
        return { success: true, id: result.id };
    } catch (err) {
        console.error("Error creating session:", err);
        return { success: false, error: String(err) };
    }
}
