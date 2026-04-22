import { Submission } from "./assignments";
import resolveEndpoint from "./resolveEndpoint";
import axios from "axios";

const API_URL = resolveEndpoint("/api");

export async function gradeSubmittedDrill(token: string, submittedDrillId: number, grade: number, feedback?: string): Promise<boolean> {
    try {
        const data: any = { grade };
        if (feedback !== undefined) data.feedback = feedback;
        await axios.patch(
            `${API_URL}/submitteddrills/${submittedDrillId}/`,
            data,
            { headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" } }
        );
        return true;
    } catch (err) {
        console.error("Error grading drill:", err);
        return false;
    }
}

export async function gradeSubmission(token: string, submissionId: number, grade: number): Promise<boolean> {
    try {
        await axios.patch(
            `${API_URL}/submissions/${submissionId}/`,
            { grade, dateGraded: new Date().toISOString() },
            { headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" } }
        );
        return true;
    } catch (err) {
        console.error("Error grading submission:", err);
        return false;
    }
}

export async function gradeSubmissionGivenGrades(token: string, submissionID: number, grades: {[drillIndex: number]: number }, feedback: {[drillIndex: number]: string}): Promise<boolean> {
    try {
        console.log('feedback', feedback)
        const gradeValues = Object.values(grades);
        const grade = gradeValues.reduce((sum, g) => sum + g, 0) / gradeValues.length;

        const response = await fetch(`${API_URL}/grade_submission/${submissionID}/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ grade, grades, feedback }),
        });

        return response.ok;
    } 
    catch (err) {
        console.error("Error Grading Submission\n", err);
        return false;
    }
}

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


export async function suggestGrade(token: string, referenceUrl: string, submissionUrl: string): Promise<number | null> {
    try {
        const response = await fetch(`${API_URL}/suggest-grade/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ referenceUrl, submissionUrl }),
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.score ?? null;
    } catch (err) {
        console.error("Error getting suggested grade:", err);
        return null;
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