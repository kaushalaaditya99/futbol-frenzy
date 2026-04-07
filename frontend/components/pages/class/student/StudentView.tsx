import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { MarkedDates } from "react-native-calendars/src/types";
import Tabs from "../coach/Tabs";
import StudentTabOverview from "./TabOverview/TabOverview";
import StudentTabWorkout from "./TabWorkout/TabWorkout";
import useFunctionalDate from "@/hooks/useFunctionalDate";
import useSearchBar from "@/hooks/useSearchBar";
import { getSessions, Session } from "@/services/sessions";
import { getStudents, Student } from "@/services/students";
import StudentTabStudent from "./TabStudent/TabStudent";
import StudentTabProgress from "./TabProgress/TabProgress";

const getStudentFullName = (student: Student) => `${student.fName} ${student.lName}`;

export default function StudentView() {
    const [tab, setTab] = useState("Overview");
    const tabs = ["Overview", "Workout", "Students", "Progress"];

    const [studentID] = useState(0);
    const [classID] = useState(0);

    // Workout tab state
    const functionalDate = useFunctionalDate();
    const [sessions, setSessions] = useState<Array<Session>>([]);
    const [markedDatesAndSessions, setMarkedDatesAndSessions] = useState<MarkedDates>({});
    const [sessionsOnDate, setSessionsOnDate] = useState<Array<Session>>([]);
    const [sessionsOnDateLabel, setSessionsOnDateLabel] = useState("");
    const [sessionsViewType, setSessionsViewType] = useState("Big");
    const sessionsOnDateSearchBar = useSearchBar<Session>(sessionsOnDate, "name", "name");

    // Students tab state
    const [students, setStudents] = useState<Array<Student>>([]);
    const studentSearchBar = useSearchBar<Student>(students, getStudentFullName, getStudentFullName);

    useEffect(() => {
        loadSessions(studentID);
        loadStudents(classID);
    }, []);

    useEffect(() => {
        const markedDates = functionalDate.getMarkedDates();
        const marked = functionalDate.markSessionsOnCalendar(markedDates, sessions);
        setMarkedDatesAndSessions(marked);
    }, [sessions, functionalDate.date]);

    useEffect(() => {
        getSessionsOnDate(functionalDate.date, sessions);
    }, [sessions, functionalDate.date]);

    useEffect(() => {
        updateSessionsOnDateLabel(functionalDate.date);
    }, [functionalDate.date]);

    const loadSessions = async (studentID: number) => {
        const sessions = await getSessions(studentID);
        setSessions(sessions);
    };

    const loadStudents = async (classID: number) => {
        const students = await getStudents(classID);
        setStudents(students);
    };

    const getSessionsOnDate = (date: Date, sessions: Array<Session>) => {
        const dateShortISOString = functionalDate.getShortISOString(date);
        const filtered: Array<Session> = [];
        for (const session of sessions)
            if (functionalDate.getShortISOString(session.date) === dateShortISOString)
                filtered.push(session);
        setSessionsOnDate(filtered);
    };

    const updateSessionsOnDateLabel = (date: Date) => {
        if (functionalDate.isToday(date)) {
            setSessionsOnDateLabel("Today's Sessions");
        } else if (functionalDate.isYesterday(date)) {
            setSessionsOnDateLabel("Yesterday's Sessions");
        } else if (functionalDate.isTomorrow(date)) {
            setSessionsOnDateLabel("Tomorrow's Sessions");
        } else {
            const dateLabel = functionalDate.date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit",
            });
            setSessionsOnDateLabel(`Sessions on ${dateLabel}`);
        }
    };

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
            {tab === "Workout" && (
                <StudentTabWorkout
                    searchBar={sessionsOnDateSearchBar}
                    viewType={sessionsViewType}
                    setViewType={setSessionsViewType}
                    sessionsOnDate={sessionsOnDateSearchBar.filtered}
                    sessionsOnDateLabel={sessionsOnDateLabel}
                    functionalDate={functionalDate}
                    markedDatesAndSessions={markedDatesAndSessions}
                />
            )}
            {tab === "Students" && (
                <StudentTabStudent
                    searchBar={studentSearchBar}
                    students={studentSearchBar.filtered}
                />
            )}
            {tab === "Progress" && <StudentTabProgress />}
        </ScrollView>
    );
}
