import resolveEndpoint from "./resolveEndpoint";
import { getUser, User, simpleGetUser, defaultUser } from "./user";
import { Student } from "./students";

export interface Class {
    id: number;
    className: string;
    classCode: string;
    students: Student[];
    coach: User;
    // These fields aren't in the model yet.
    imageText: string;
    imageTextColor: string;
    imageBackgroundColor: string;
    description: string;

}


export const defaultClass: Class =
{
  id: 0,
  className: "U10",
  classCode: "Ligma",
  students: [],
  coach: defaultUser,
  // These fields aren't in the model yet.
  imageText: "something",
  imageTextColor: "red",
  imageBackgroundColor: "black",
  description: "this is a soccer class",
};


const API_URL = resolveEndpoint("/api");

export async function getClasses(token: string): Promise<Array<Class>> {
    const response = await fetch(`${API_URL}/classes/`, {
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    // console.log("Classes", data);
    return data;
    // return [
    //     {
    //         id: 0,
    //         name: "U12 Boys A-Team",
    //         numStudents: 18,
    //         teacherName: "Martinez",
    //         imageText: "⚽",
    //         classCode: "XK7M2P"
    //     },
    //     {
    //         id: 1,
    //         name: "Chelsea FC",
    //         numStudents: 18,
    //         teacherName: "John",
    //         imageText: "🏃",
    //         classCode: "BN4Q8R"
    //     }
    // ]
}

export async function getClassById(token: string, id: number): Promise<Class>
{
  const resClass = await fetch(`${API_URL}/classes/${id}/`,
  {
      headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
      },
  });
  if (!resClass.ok) { console.log("Failed to retrieve class."); return defaultClass }
  const myclass = await resClass.json();
  return myclass;
}

export async function joinClass(token: string, classCode: string): Promise<boolean> {
    // Get Class by Code
    const response = await fetch(`${API_URL}/classes/code/?code=${classCode.toUpperCase()}`, {
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    const classID = data["id"];

    // Get User ID
    const user = await simpleGetUser(token);
    if (!user)
        return false;

    const userID = user.id;

    console.log("Class ID", classID);
    console.log("User ID", userID);

    // Join Class
    const joinClassResponse = await fetch(`${API_URL}/classmembers/`, {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            classID: classID,
            studentID: userID
        })
    });

    const joinClassData = await joinClassResponse.json();
    // console.log("Join Class Data", joinClassData);

    return joinClassData;
}

export async function createClass(token: string, className: string, imageBackgroundColor: string, imageTextColor: string, imageText: string) {
    const user = await simpleGetUser(token);
    if (!user)
        return false;

    const coachID = user.id;
    console.log("User", user);
    console.log("Coach ID", coachID);

    const response = await fetch(`${API_URL}/classes/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
            className,
            coachID,
            imageBackgroundColor,
            imageTextColor,
            imageText,
            assignments: []
        })
    });
    const data = await response.json();
    // console.log("Create Class", data);
    return data;
}
