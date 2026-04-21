import resolveEndpoint from "./resolveEndpoint";

const API_URL = resolveEndpoint("/api/");

export interface StudentStats {
    daysStreak: number;
    thisWeek: number;
    dueToday: number;
}

export interface ScheduleItem {
    id: number;
    workoutId: number;
    name: string;
    type: string;
    dueDate: string | null;
    className: string;
    submitted: boolean;
    imageBackgroundColor: string;
    imageText: string;
    imageTextColor: string;
}

export interface StudentResult {
    id: number;
    name: string;
    type: string;
    score: number;
    date: string;
    imageBackgroundColor: string;
    imageTextColor: string;
}

export async function getStudentStats(token: string): Promise<StudentStats> {
    const res = await fetch(`${API_URL}student/stats/`, {
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export async function getStudentSchedule(token: string, date: string): Promise<ScheduleItem[]> {
    const res = await fetch(`${API_URL}student/schedule/?date=${date}`, {
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export async function getStudentResults(token: string, date?: string): Promise<StudentResult[]> {
    const params = date ? `?date=${date}` : '';
    const res = await fetch(`${API_URL}student/results/${params}`, {
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}
