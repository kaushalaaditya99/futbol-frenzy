import { Submission } from "./assignments";
import resolveEndpoint from "./resolveEndpoint";

const API_URL = resolveEndpoint("/api");

export async function getSubmission(token: string, submissionID: number): Promise<Submission|null> {
    try {
        const response = await fetch(`${API_URL}/submissions/${submissionID}/`, {
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) 
            return null;

        const submission = await response.json();
        if (submission)
            submission.dueDate = new Date(submission.dueDate || "");

        return submission;
    } 
    catch (err) {
        console.error("Error Fetching Assignment\n", err);
        return null;
    }
}

export async function gradeSubmission(token: string, submissionID: number, grades: {[drillIndex: number]: number }): Promise<boolean> {
    try {
        const gradeValues = Object.values(grades);
        const grade = gradeValues.reduce((sum, g) => sum + g, 0) / gradeValues.length;

        const response = await fetch(`${API_URL}/grade_submission/${submissionID}/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ grade, grades }),
        });

        return response.ok;
    } 
    catch (err) {
        console.error("Error Grading Submission\n", err);
        return false;
    }
}

export async function createSubmission(token: string, assignmentID: number,studentID: number): Promise<Submission|null> {
    try {
        const response = await fetch(`${API_URL}/create_submission/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ assignmentID, studentID }),
        });

        if (!response.ok)
            return null;

        return await response.json();
    } catch (err) {
        console.error("Error Creating Submission\n", err);
        return null;
    }
}