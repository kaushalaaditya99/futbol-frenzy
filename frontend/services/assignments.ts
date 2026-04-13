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

export async function getClassByAssignment(token: string, assignmentID: number): Promise<Class|null> {
    try {
        const response = await fetch(`${API_URL}/assignments/${assignmentID}/class`, {
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