import resolveEndpoint from "./resolveEndpoint";

const API_URL = resolveEndpoint("/api");

export async function bookmarkDrill(token: string, drillID: number): Promise<boolean | null> {
    try {
        const response = await fetch(`${API_URL}/drills/${drillID}/bookmark/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok)
            return null;

        const data = await response.json();
        return data.bookmarked;
    } catch (err) {
        console.error("Error Bookmarking Drill\n", err);
        return null;
    }
}

export async function bookmarkWorkout(token: string, workoutID: number): Promise<boolean | null> {
    try {
        const response = await fetch(`${API_URL}/workouts/${workoutID}/bookmark/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok)
            return null;

        const data = await response.json();
        return data.bookmarked;
    } catch (err) {
        console.error("Error Bookmarking Workout\n", err);
        return null;
    }
}