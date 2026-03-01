export interface Class {
    id: number;
    name: string;
    size: number;
    teacherName: string;
    imageEmoji: string;
}

export async function getClasses(id: number, role: string): Promise<Array<Class>> {
    return [
        {
            id: 0,
            name: "U12 Boys A-Team",
            size: 18,
            teacherName: "Martinez",
            imageEmoji: "⚽"
        },
        {
            id: 1,
            name: "Chelsea FC",
            size: 18,
            teacherName: "John",
            imageEmoji: "🏃"
        }
    ]
}

export async function joinClass(classCode: string, studentID: number): Promise<boolean> {
    const successful = classCode === "0000"
    return successful;
}