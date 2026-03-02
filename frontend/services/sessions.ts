import { fetchDrills, Drill } from "./drillHandler";

export interface Session {
    name: string; // drillName (in Drill)
    type: string; // drillType (in Drill)
    time: number; // time (in Enrollment)
    class: string; // not implemented
    isNew: boolean; // not implemented
    isDue: boolean; // not implemented
    imageBackgroundColor: string; // coach chooses (in Drill)
    imageEmoji: string; // coach chooses (in Drill)
}

// 🔹 Convert Drill → Session
function mapDrillToSession(drill: Drill): Session {
  return {
    name: drill.drillName,
    type: drill.drillType,
    time: 5, // temporary until Enrollment API exists
    class: "U12 Boys", // temporary
    isNew: false,
    isDue: false,
    imageBackgroundColor: drill.imageBackgroundColor,
    imageEmoji: drill.imageEmoji,
  };
}



// 🔹 Get sessions for a student
export async function getSessions(studentID: number): Promise<Session[]> {
  try {
    const drills = await fetchDrills();

    // Later this will filter by enrollment/studentID
    return drills.map(mapDrillToSession);

  } catch (err) {
    console.error("Get sessions error:", err);
    return [];
  }
}

/*export function getSessions(studentID: number): Array<Session> {
    // We'd contact the API here, but I don't think
    // it's ready, so we can provide some fake data.
    // But the focus is creating the skeleton structure,
    // if that makes sense.

    

    return [
        {
            name: "Cone Dribbling",
            type: "Ball Control",
            time: 5,
            class: "U12 Boys",
            isNew: true,
            isDue: false,
            imageBackgroundColor: "#1C1C1C",
            imageEmoji: "🏃‍♂️"
        },
        {
            name: "Wall Pass & Receive",
            type: "Passing",
            time: 8,
            class: "U12 Boys",
            isNew: true,
            isDue: false,
            imageBackgroundColor: "#000",
            imageEmoji: "⚽"
        },
        {
            name: "Shooting Accuracy",
            type: "Shooting",
            time: 10,
            class: "U12 Boys",
            isNew: false,
            isDue: true,
            imageBackgroundColor: "#e9e9e9",
            imageEmoji: "🥅"
        }
    ];
}*/