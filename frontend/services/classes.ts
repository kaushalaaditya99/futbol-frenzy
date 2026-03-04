export interface Class {
    id: number;
    name: string;
    numStudents: number;
    teacherName: string;
    imageText: string;
    imageTextColor?: string;
    imageBackgroundColor?: string;
}

export async function getClasses(id: number, role: string): Promise<Array<Class>> {
    return [
        {
            id: 0,
            name: "U12 Boys A-Team",
            numStudents: 18,
            teacherName: "Martinez",
            imageText: "⚽"
        },
        {
            id: 1,
            name: "Chelsea FC",
            numStudents: 18,
            teacherName: "John",
            imageText: "🏃"
        }
    ]
}

export async function joinClass(classCode: string, studentID: number): Promise<boolean> {
    const successful = classCode === "0000";
    return successful;
}

export async function createClass(teacherID: number, className: string, imageBackgroundColor: string, imageTextColor: string, imageAbbrev: string) {
    return true;
}