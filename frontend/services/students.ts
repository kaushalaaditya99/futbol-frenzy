export interface Student {
    id: number;
    first_name: string;
    last_name: string;
    position: string;
}

export async function getStudents(classID: number): Promise<Array<Student>> {
    return [
        {
            id: 0,
            first_name: "Pedri",
            last_name: "González",
            position: "Midfielder"
        },
        {
            id: 1,
            first_name: "Erling",
            last_name: "Haaland",
            position: "Striker"
        },
        {
            id: 2,
            first_name: "Lamine",
            last_name: "Yamal",
            position: "Winger"
        },
    ]
}
