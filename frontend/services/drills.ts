import { AccessControl } from "@/components/pages/drills/useDrillSearchBar";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import resolveEndpoint from "./resolveEndpoint";

export interface Drillv2 {
  id: number;
  videoURL: string;
  name: string;
  type: string;
  //time: number;
  level: string;
  instructions: string;
  accessControl: "public" | "private";
  uploadedByID: number;
  uploadedByName: string;
  //bookmarked: boolean;
}

const API_URL = resolveEndpoint("/api/");

export async function getDrills(): Promise<Drillv2[]> {
  try {
    const res = await fetch(`${API_URL}drills/`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    console.log("backend drills:", data);

    return data.map((d: any) => ({
      id: d.id,
      videoURL: d.url,
      name: d.drillName,
      type: d.drillType,
      //time: d.time,
      level: d.difficultyLevel,
      instructions: d.instructions,
      accessControl: d.publicDrill ? "public" : "private",
      uploadedByID: d.coachID,
      uploadedByName: "Coach",
      //bookmarked: false,
    }));
  } catch (err) {
    console.error("Failed to fetch drills:", err);
    return [];
  }
}

// the mock drill data, didn't wanna delete incase anyone wants to use it

/*
// Local videos for hardcoded drills
const localVideos: Drillv2[] = [
    {
        id: 1,
        videoURL: "@/assets/videos/video.mp4",
        name: "Pass and Follow",
        type: "Passing",
        time: 10,
        accessControl: "public",
        level: "Beginner",
        instructions: "Players line up in two lines facing each other. The first player passes to the player opposite and then follows their pass, joining the back of the opposite line. Focus on weight and accuracy of the pass.",
        uploadedByID: 1,
        uploadedByName: "Sports Academy",
        bookmarked: false,
    },
    {
        id: 2,
        videoURL: "@/assets/videos/video2.mp4",
        name: "Triangle Passing",
        type: "Passing & Movement Off the Ball",
        time: 15,
        accessControl: "public",
        level: "Intermediate",
        instructions: "Three players set up in a triangle. They pass in sequence around the triangle, then switch direction. Add a defender in the middle to increase difficulty.",
        uploadedByID: 2,
        uploadedByName: "Sports Academy",
        bookmarked: false,
    },
    {
        id: 3,
        videoURL: "@/assets/videos/video3.mp4",
        name: "Combination Play into Goal",
        type: "Passing & Finishing",
        time: 15,
        accessControl: "public",
        level: "Beginner",
        instructions: "Players practice a set combination — a wall pass followed by a through ball into a striker who finishes on goal. Rotate positions after each turn.",
        uploadedByID: 2,
        uploadedByName: "Sports Academy",
        bookmarked: true,
    },
    {
        id: 4,
        videoURL: "@/assets/videos/video4.mp4",
        name: "1v1 Defending",
        type: "Defending",
        time: 10,
        accessControl: "public",
        level: "Beginner",
        instructions: "Set up a small channel. The attacker tries to dribble past the defender to reach the end line. The defender must stay between the attacker and the goal, staying patient and forcing them wide.",
        uploadedByID: 3,
        uploadedByName: "Sports Academy",
        bookmarked: true,
    },
    {
        id: 5,
        videoURL: "@/assets/videos/video5.mp4",
        name: "Dribbling Gates",
        type: "Dribbling",
        time: 10,
        accessControl: "private",
        level: "Beginner",
        instructions: "Set up 8–10 small gates (pairs of cones) randomly across a grid. Players dribble freely and must pass through as many gates as possible in 60 seconds. Focus on close control and change of direction.",
        uploadedByID: 3,
        uploadedByName: "John Smith",
        bookmarked: false,
    },
    {
        id: 6,
        videoURL: "@/assets/videos/video6.mp4",
        name: "Pressing Trigger Drill",
        type: "Defending & Pressing",
        time: 20,
        accessControl: "private",
        level: "Intermediate",
        instructions: "In a 4v4 setup, the defending team practices pressing as a unit when a trigger occurs — a bad touch or a back pass. On the trigger, the nearest player presses aggressively while teammates shift to cover passing lanes.",
        uploadedByID: 1,
        uploadedByName: "Robert DeNiro",
        bookmarked: false,
    },
    {
        id: 7,
        videoURL: "@/assets/videos/video7.mp4",
        name: "Crossing and Finishing",
        type: "Finishing",
        time: 15,
        accessControl: "private",
        level: "Intermediate",
        instructions: "A winger drives down the flank and delivers a cross into the box where two strikers make runs — one near post, one far post. Rotate crossing sides and striker roles after each rep.",
        uploadedByID: 4,
        uploadedByName: "Martin Scorsese",
        bookmarked: true,
    },
    {
        id: 8,
        videoURL: "@/assets/videos/video8.mp4",
        name: "Shadow Play — Build Out",
        type: "Tactical / Possession",
        time: 20,
        accessControl: "public",
        level: "Advanced",
        instructions: "Without opposition, the team walks through a structured build-up pattern from the goalkeeper. Focus on spacing, timing of runs, and positional discipline as the ball moves from back to front.",
        uploadedByID: 4,
        uploadedByName: "Soccer Drive",
        bookmarked: false,
    },
    {
        id: 9,
        videoURL: "@/assets/videos/video9.mp4",
        name: "First Touch Waves",
        type: "First Touch & Passing",
        time: 10,
        accessControl: "public",
        level: "Beginner",
        instructions: "Players work in pairs 10 yards apart. Server throws or passes the ball at varying heights. Receiver controls with one touch and passes back. Alternate feet and surfaces — inside, outside, chest, thigh.",
        uploadedByID: 2,
        uploadedByName: "Soccer Drive",
        bookmarked: true,
    },
    {
        id: 10,
        videoURL: "@/assets/videos/video10.mp4",
        name: "Small-Sided Game (4v4)",
        type: "Game Scenario",
        time: 25,
        accessControl: "public",
        level: "Intermediate",
        instructions: "A free 4v4 small-sided game on a tight pitch with small goals. Encourage quick combination play and high pressing. Coach pauses play to reinforce key moments — transitions, pressing triggers, and third-man runs.",
        uploadedByID: 5,
        uploadedByName: "Soccer Drive",
        bookmarked: false,
    },
];

// Get auth token from AsyncStorage
async function getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
}

// Fetch drills from backend API
async function fetchDrillsFromAPI(): Promise<Drillv2[]> {
    const API_URL = resolveEndpoint("/api/drills/");
    const token = await getAuthToken();

    const headers = token ? { Authorization: `Token ${token}` } : {};

    const response = await axios.get(API_URL, { headers });

    // Map backend Drill model to frontend model
    return response.data.map((drill: any) => ({
        id: drill.id,
        videoURL: drill.url,  // S3 URL from backend
        name: drill.drillName,
        type: drill.drillType,
        time: drill.time,
        level: drill.difficultyLevel,
        instructions: drill.instructions,
        accessControl: drill.publicDrill ? "public" : "private",
        uploadedByID: drill.coachID,
        uploadedByName: drill.coachName || "Unknown", 
        bookmarked: false, 
    }));
}

export async function getDrills(id: number): Promise<Array<Drillv2>> {
    try {
        // Fetch drills from API and combine with local videos
        const apiDrills = await fetchDrillsFromAPI();
        return [...localVideos, ...apiDrills];
    } catch (error) {
        console.error("Failed to fetch drills from API:", error);
        // Fall back to local videos only if API fails
        return localVideos;
    }
}

export async function getDrill(userID: number, drillID: number): Promise<Drillv2> {
    const drills = await getDrills(userID);
    const drill = drills.find(d => d.id === drillID);
    if (drill) {
        return drill;
    }
    // If not found, try directly from API
    try {
        const API_URL = resolveEndpoint(`/api/drills/${drillID}/`);
        const token = await getAuthToken();
        const headers = token ? { Authorization: `Token ${token}` } : {};
        const response = await axios.get(API_URL, { headers });
        const drill = response.data;
        return {
            id: drill.id,
            videoURL: drill.url,
            name: drill.drillName,
            type: drill.drillType,
            time: drill.time,
            level: drill.difficultyLevel,
            instructions: drill.instructions,
            accessControl: drill.publicDrill ? "public" : "private",
            uploadedByID: drill.coachID,
            uploadedByName: drill.coachName || "Unknown",
            bookmarked: false,
        };
    } catch (error) {
        console.error("Failed to fetch drill:", error);
        throw new Error(`Drill ${drillID} not found`);
    }
}
*/