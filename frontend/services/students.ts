import resolveEndpoint from "./resolveEndpoint";

export interface Student {
    id: number;
    first_name: string;
    last_name: string;
    position: string;
}

const API_URL = resolveEndpoint("/api");

export async function getStudents(classID: number, token?: string): Promise<Array<Student>> {
    if (!classID || classID === 0) return [];

    try {
        // Fetch class details which includes students
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers.Authorization = `Token ${token}`;
        }

        const response = await fetch(`${API_URL}/classes/${classID}/`, { headers });
        if (!response.ok) return [];

        const classData = await response.json();
        const students: Student[] = (classData.students || []).map((s: any) => ({
            id: s.id,
            first_name: s.first_name,
            last_name: s.last_name,
            position: s.position || "Player",
        }));

        return students;
    } catch (err) {
        console.error("Error fetching students:", err);
        return [];
    }
}
