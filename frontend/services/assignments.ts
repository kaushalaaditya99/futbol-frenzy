import { Drill } from "./drills";
import resolveEndpoint from "./resolveEndpoint";

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
    workout: Workout
}

const API_URL = resolveEndpoint("/api");

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