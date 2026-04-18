import resolveEndpoint from "./resolveEndpoint";

const API_URL = resolveEndpoint("/api/");

export interface CoachSubmission {
    id: number;
    studentName: string;
    studentID: number;
    drillName: string;
    className: string;
    dateSubmitted: string;
    grade: number | null;
}

export interface ClassProgress {
    id: number;
    name: string;
    completion: number;
    assignmentsToday: number;
    studentsCompleted: number;
    totalStudents: number;
}

export interface CoachStats {
    toReview: number;
    totalStudents: number;
    completion: number;
}

export async function getCoachStats(token: string): Promise<CoachStats> {
    const res = await fetch(`${API_URL}coach/stats/`, {
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export async function getCoachClassProgress(token: string): Promise<ClassProgress[]> {
    const res = await fetch(`${API_URL}coach/class-progress/`, {
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export async function getCoachSubmissions(token: string, options?: { today?: boolean; limit?: number }): Promise<CoachSubmission[]> {
    const params = new URLSearchParams();
    if (options?.today) params.append("today", "true");
    if (options?.limit) params.append("limit", String(options.limit));

    const res = await fetch(`${API_URL}coach/submissions/?${params.toString()}`, {
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}
