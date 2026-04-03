import { useState } from "react";
import { ScrollView, View } from "react-native";
import Tabs from "../coach/Tabs";
import StudentTabOverview from "./TabOverview/TabOverview";

export default function StudentView() {
    const [tab, setTab] = useState("Overview");
    const tabs = ["Overview", "Workout", "Students", "Progress"];

    // TODO: Replace with real data from backend
    const overviewProps = {
        classAvg: "8.2",
        classAvgTrend: "↑ 0.4",
        sessionsCompleted: 18,
        sessionsTotal: 22,
        feedback: {
            drillName: "Shooting Accuracy",
            drillEmoji: "🎯",
            sessionLabel: "Today · Session #20",
            score: 9,
            maxScore: 10,
            coachName: "Coach Martinez",
            coachInitials: "CM",
            feedback:
                "Great improvement on your weak foot! Your placement on the far-post shots was much better. Next time, focus on striking faster after receiving — your first touch is solid, trust it more.",
        },
        nextSession: {
            name: "Friday Finishing",
            dueLabel: "📅 Due Fri, Apr 3",
            drills: [
                { name: "First Touch Control", duration: "8 min" },
                { name: "Shooting Accuracy", duration: "10 min" },
                { name: "Juggling Challenge", duration: "5 min" },
            ],
        },
    };

    return (
        <ScrollView>
            <Tabs tab={tab} tabs={tabs} setTab={setTab} />
            {tab === "Overview" && <StudentTabOverview {...overviewProps} />}
            {tab === "Workout" && <View />}
            {tab === "Students" && <View />}
            {tab === "Progress" && <View />}
        </ScrollView>
    );
}
