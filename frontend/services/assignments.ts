import { Class } from "./classes";
import { Drill } from "./drills";
import resolveEndpoint from "./resolveEndpoint";
import { User } from "./user";

export interface Workout {
    id: number;
    workoutName: string;
    workoutType: string;
    coachID: number;
    imageBackgroundColor: string;
    imageText: string;
    imageTextColor: string;
    drills: Drill[];
}

export interface Assignment {
    id: number;
    workoutID: number;
    dueDate: Date;
    imageBackgroundColor: string;
    imageText: string;
    imageTextColor: string;
    workout: Workout;
    submissions: Submission[];
}

export interface SubmittedDrill {
    id: number;
    submissionID: number;
    drillID: number;
    drill: Drill,
    videoURL: string;
    grade: number | null;
    touchCount: number;
}

export interface Submission {
    id: number;
    studentID: number;
    assignmentID: number;
    grade: number;
    dateGraded: string;
    dateSubmitted: string;
    imageBackgroundColor: string;
    imageText: string;
    imageTextColor: string;
    student: User;
    submitted_drills: SubmittedDrill[]
}

const API_URL = resolveEndpoint("/api");

export async function getAssignmentsbyClass(token: string, class_id: number): Promise<Array<Assignment>> {
    try {
        const response = await fetch (`${API_URL}/assignments/?classID=${class_id}`, {
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return [];
        }

        const assignments = await response.json();
        for (const assignment of assignments)
            assignment.dueDate = new Date(assignment.dueDate || "");

        return assignments;
    }
    catch (err) {
        console.error("Error Fetching Assignments\n", err);
        return [];
    }
}

export async function getAssignments(token: string): Promise<Array<Assignment>> {
    try {
        const response = await fetch (`${API_URL}/assignments/`, {
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return [];
        }

        const assignments = await response.json();
        for (const assignment of assignments)
            assignment.dueDate = new Date(assignment.dueDate || "");

        return assignments;
    }
    catch (err) {
        console.error("Error Fetching Assignments\n", err);
        return [];
    }
}

export async function getAssignment(token: string, assignmentID: number): Promise<Assignment|null> {
    try {
        const response = await fetch(`${API_URL}/assignments/${assignmentID}/`, {
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok)
            return null;

        const assignment = await response.json();
        if (assignment)
            assignment.dueDate = new Date(assignment.dueDate || "");

        return assignment;
    }
    catch (err) {
        console.error("Error Fetching Assignment\n", err);
        return null;
    }
}

export async function getClassByAssignment(token: string, assignmentID: number): Promise<Class|null> {
    try {
        console.log(`${API_URL}/assignments/${assignmentID}/class`);
        const response = await fetch(`${API_URL}/assignments/${assignmentID}/class/`, {
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok)
            return null;

        const soccerClass = await response.json();
        return soccerClass;
    }
    catch (err) {
        console.error("Error Fetching Soccer Class\n", err);
        return null;
    }
}

export interface CreateAssignmentData {
    workoutID: number;
    dueDate: string; // ISO string
    imageBackgroundColor?: string;
    imageText?: string;
    imageTextColor?: string;
    classIds: number[]; // IDs of classes to assign to
}

export async function createAssignment(token: string, data: CreateAssignmentData): Promise<{ success: boolean; id?: number; error?: string }> {
    try {
        // Get workout info for the imageText
        const workoutResponse = await fetch(`${API_URL}/workouts/${data.workoutID}/`, {
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
        });

        let workoutName = "Assignment";
        let workoutBgColor = "#1C1C1C";
        let workoutTextColor = "#FFFFFF";
        if (workoutResponse.ok) {
            const workout = await workoutResponse.json();
            workoutName = workout.workoutName || "Assignment";
            workoutBgColor = workout.imageBackgroundColor || "#1C1C1C";
            workoutTextColor = workout.imageTextColor || "#FFFFFF";
        }

        const response = await fetch(`${API_URL}/assignments/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                workoutID: data.workoutID,
                dueDate: data.dueDate,
                imageBackgroundColor: data.imageBackgroundColor || workoutBgColor,
                imageText: data.imageText || workoutName.substring(0, 2).toUpperCase(),
                imageTextColor: data.imageTextColor || workoutTextColor,
                soccer_classes: data.classIds,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Failed to create assignment:", response.status, errorData);
            return { success: false, error: JSON.stringify(errorData) };
        }

        const result = await response.json();
        return { success: true, id: result.id };
    } catch (err) {
        console.error("Error creating assignment:", err);
        return { success: false, error: String(err) };
    }
}
