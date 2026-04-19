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