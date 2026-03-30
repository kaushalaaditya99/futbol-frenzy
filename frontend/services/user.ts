import resolveEndpoint from "./resolveEndpoint";

const API_URL = resolveEndpoint("/api");

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export async function getUser(token: string) {
    const response = await fetch(`${API_URL}/user/`, {
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    console.log("User", data);
    return data;
}

export async function getUserSettings(token: string) {
    const response = await fetch(`${API_URL}/settings/`, {
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    console.log("User Settings", data);
    return data;
}