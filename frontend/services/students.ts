export interface Student {
    id: number;
    fName: string;
    lName: string;
    position: string;
}

export async function getStudents(classID: number): Promise<Array<Student>> {
    return [
        {
            id: 0,
            fName: "Pedri",
            lName: "González",
            position: "Midfielder"
        },
        {
            id: 1,
            fName: "Erling",
            lName: "Haaland",
            position: "Striker"
        },
        {
            id: 2,
            fName: "Lamine",
            lName: "Yamal",
            position: "Winger"
        },
        {
            id: 4,
            fName: "Joan",
            lName: "García",
            position: "Goalkeeper"
        },
        {
            
            id: 5,
            fName: "Pau",
            lName: "Cubarsi",
            position: "Defender"
        },
        {
            
            id: 6,
            fName: "Nico",
            lName: "Schlotterbeck",
            position: "Defender"
        },
        {
            id: 7,
            fName: "Lionel",
            lName: "Messi",
            position: "Midfielder"
        },
        {
            id: 8,
            fName: "Samuel",
            lName: "Eto'o",
            position: "Striker"
        },

    ]
}