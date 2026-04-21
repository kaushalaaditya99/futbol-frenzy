import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MarkedDates } from "react-native-calendars/src/types";
import Tabs from "../coach/Tabs";
import StudentTabOverview from "./TabOverview/TabOverview";
import StudentTabWorkout from "./TabWorkout/TabWorkout";
import useFunctionalDate from "@/hooks/useFunctionalDate";
import useSearchBar from "@/hooks/useSearchBar";
import { Session } from "@/services/sessions";
import { getStudents, Student } from "@/services/students";
import StudentTabStudent from "./TabStudent/TabStudent";
import StudentTabProgress from "./TabProgress/TabProgress";
import { Assignment, getAssignmentsByClass } from "@/services/assignments";
import { router } from "expo-router";
import { useProfile } from "@/contexts/ProfileContext";
import resolveEndpoint from "@/services/resolveEndpoint";

interface StudentSubmission {
    id: number;
    studentID: number;
    assignmentID: number;
    grade: number | null;
    dateGraded: string | null;
    dateSubmitted: string;
}

interface StudentSubmittedDrill {
    id: number;
    submissionID: number;
    drillID: number;
    videoURL: string;
    grade: number | null;
    touchCount: number | null;
}

const getStudentFullName = (student: Student) => `${student.first_name} ${student.last_name}`;

interface StudentViewProps {
    classId?: number;
}

export default function StudentView(props: StudentViewProps) {
    const [tab, setTab] = useState("Overview");
    const tabs = ["Overview", "Assignments", "Students", "Progress"];

    const { token } = useAuth();
    const classID = props.classId ?? 0;

    // Assignments tab state
    const functionalDate = useFunctionalDate();
    const [assignmentSessions, setAssignmentSessions] = useState<Array<Session>>([]);
    const [markedDatesAndSessions, setMarkedDatesAndSessions] = useState<MarkedDates>({});
    const [sessionsOnDate, setSessionsOnDate] = useState<Array<Session>>([]);
    const [sessionsOnDateLabel, setSessionsOnDateLabel] = useState("");
    const [sessionsViewType, setSessionsViewType] = useState("Big");
    const sessionsOnDateSearchBar = useSearchBar<Session>(sessionsOnDate, "name", "name");

    // Students tab state
    const [students, setStudents] = useState<Array<Student>>([]);
    const studentSearchBar = useSearchBar<Student>(students, getStudentFullName, getStudentFullName);

    // Overview data state
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [mySubmissions, setMySubmissions] = useState<StudentSubmission[]>([]);
    const [mySubmittedDrills, setMySubmittedDrills] = useState<StudentSubmittedDrill[]>([]);
    const { profile } = useProfile();
    const studentId = profile.id || null;

    useEffect(() => {
        if (token && classID > 0) {
            loadStudents(classID);
            loadAssignments();
        }
    }, [token, classID]);

    useEffect(() => {
        if (token && studentId !== null) {
            loadMySubmissions();
        }
    }, [token, studentId]);

    const loadAssignments = async () => {
        if (!token) return;
        const data = await getAssignmentsByClass(token, classID);
        setAssignments(data);
    };

    // Reload assignments when screen regains focus (e.g. after assigning)
    useFocusEffect(
        useCallback(() => {
            if (token && classID > 0) {
                loadAssignments();
                if (studentId !== null) {
                    loadMySubmissions();
                }
            }
        }, [token, classID, studentId])
    );

    const loadMySubmissions = async () => {
        if (!token || studentId === null) return;
        const API_URL = resolveEndpoint("/api");
        try {
            const [subRes, drillRes] = await Promise.all([
                fetch(`${API_URL}/submissions/?studentID=${studentId}`, {
                    headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
                }),
                fetch(`${API_URL}/submitteddrills/?studentID=${studentId}`, {
                    headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
                }),
            ]);
            if (subRes.ok) {
                setMySubmissions(await subRes.json());
            }
            if (drillRes.ok) {
                setMySubmittedDrills(await drillRes.json());
            }
        } catch (err) {
            console.error("Failed to load submissions:", err);
        }
    };

    // Build a set of assignment IDs the student has submitted
    const submittedAssignmentIds = new Set(mySubmissions.map(s => s.assignmentID));

    // Convert assignments to Session objects for the calendar/list components
    const assignmentAsSessions: Session[] = assignments.map(a => ({
        id: a.id,
        date: a.dueDate ? new Date(a.dueDate) : new Date(),
        name: a.workout?.workoutName || a.imageText || "Assignment",
        type: a.workout?.workoutType || "",
        durationInMins: 0,
        class: "",
        drills: [],
        isNew: false,
        isDue: !submittedAssignmentIds.has(a.id),
        imageBackgroundColor: a.imageBackgroundColor || "#1C1C1C",
        imageTextColor: a.imageTextColor,
        imageText: a.imageText || "",
        uploadedBy: "",
        bookmarked: false,
        accessControl: "private",
        coach: {} as any,
    }));

    useEffect(() => {
        const markedDates = functionalDate.getMarkedDates();
        const marked = functionalDate.markSessionsOnCalendar(markedDates, assignmentAsSessions);
        setMarkedDatesAndSessions(marked);
    }, [assignments, functionalDate.date]);

    useEffect(() => {
        const dateShortISOString = functionalDate.getShortISOString(functionalDate.date);
        const filtered = assignmentAsSessions.filter(
            s => functionalDate.getShortISOString(s.date) === dateShortISOString
        );
        setSessionsOnDate(filtered);
    }, [assignments, functionalDate.date]);

    useEffect(() => {
        updateSessionsOnDateLabel(functionalDate.date);
    }, [functionalDate.date]);

    const loadStudents = async (classID: number) => {
        const students = await getStudents(classID, token || undefined);
        setStudents(students);
    };

    const updateSessionsOnDateLabel = (date: Date) => {
        if (functionalDate.isToday(date)) {
            setSessionsOnDateLabel("Today's Assignments");
        } else if (functionalDate.isYesterday(date)) {
            setSessionsOnDateLabel("Yesterday's Assignments");
        } else if (functionalDate.isTomorrow(date)) {
            setSessionsOnDateLabel("Tomorrow's Assignments");
        } else {
            const dateLabel = functionalDate.date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit",
            });
            setSessionsOnDateLabel(`Assignments on ${dateLabel}`);
        }
    };

    // Compute overview data from real assignments + submissions
    const buildOverviewProps = () => {
        const totalAssignments = assignments.length;
        const completedCount = assignments.filter(a => submittedAssignmentIds.has(a.id)).length;

        // Compute average grade across all graded submitted drills
        let totalGraded = 0;
        let gradeSum = 0;
        for (const sd of mySubmittedDrills) {
            if (sd.grade !== null && sd.grade !== undefined) {
                gradeSum += sd.grade;
                totalGraded++;
            }
        }
        const avgGrade = totalGraded > 0 ? (gradeSum / totalGraded).toFixed(1) : "--";

        // Find latest graded drill for feedback
        let latestFeedback: {
            drillName: string;
            drillEmoji: string;
            sessionLabel: string;
            score: number;
            maxScore: number;
            coachName: string;
            coachInitials: string;
            feedback: string;
        } | null = null;

        // Find the most recently graded submission
        const gradedSubmissions = mySubmissions
            .filter(s => s.dateGraded !== null)
            .sort((a, b) => new Date(b.dateGraded!).getTime() - new Date(a.dateGraded!).getTime());

        if (gradedSubmissions.length > 0) {
            const latestSub = gradedSubmissions[0];
            const gradedDrills = mySubmittedDrills.filter(
                sd => sd.submissionID === latestSub.id && sd.grade !== null
            );
            if (gradedDrills.length > 0) {
                const sd = gradedDrills[0];
                const assignment = assignments.find(a => a.id === latestSub.assignmentID);
                latestFeedback = {
                    drillName: "Drill",
                    drillEmoji: "⚽",
                    sessionLabel: assignment?.workout?.workoutName || "Assignment",
                    score: sd.grade!,
                    maxScore: 100,
                    coachName: "Coach",
                    coachInitials: "C",
                    feedback: sd.grade! >= 80
                        ? "Great work on this drill! Keep it up."
                        : sd.grade! >= 60
                        ? "Good effort! Keep practicing to improve your form."
                        : "Keep working on this drill. Watch the example video and try again.",
                };
            }
        }

        // Find next upcoming assignment (not yet submitted, due today or later)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let nextAssignment: {
            name: string;
            dueLabel: string;
            drills: { name: string; duration: string }[];
        } | null = null;

        const upcoming = assignments
            .filter(a => {
                const dueDate = a.dueDate ? new Date(a.dueDate) : null;
                if (!dueDate) return false;
                const dueDateOnly = new Date(dueDate);
                dueDateOnly.setHours(0, 0, 0, 0);
                if (dueDateOnly < today) return false;
                return !submittedAssignmentIds.has(a.id);
            })
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

        if (upcoming.length > 0) {
            const next = upcoming[0];
            const dueDate = new Date(next.dueDate);
            const dueDateStr = dueDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
            nextAssignment = {
                name: next.workout?.workoutName || "Assignment",
                dueLabel: `Due ${dueDateStr}`,
                drills: (next.workout?.drills || []).map((d: any) => ({
                    name: d.drillName || d.name || "Drill",
                    duration: "",
                })),
            };
        }

        return {
            classAvg: String(avgGrade),
            classAvgTrend: "",
            sessionsCompleted: completedCount,
            sessionsTotal: totalAssignments,
            feedback: latestFeedback,
            nextSession: nextAssignment,
        };
    };

    const overviewProps = assignments.length > 0 && studentId !== null
        ? buildOverviewProps()
        : {
            classAvg: "--",
            classAvgTrend: "",
            sessionsCompleted: 0,
            sessionsTotal: 0,
            feedback: null,
            nextSession: null,
        };

    const handleStartSession = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = assignments
            .filter(a => {
                const dueDate = a.dueDate ? new Date(a.dueDate) : null;
                if (!dueDate) return false;
                const dueDateOnly = new Date(dueDate);
                dueDateOnly.setHours(0, 0, 0, 0);
                if (dueDateOnly < today) return false;
                return !submittedAssignmentIds.has(a.id);
            })
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

        if (upcoming.length > 0) {
            router.push(`/assignments/${upcoming[0].id}`);
        }
    };

    return (
        <ScrollView>
            <Tabs tab={tab} tabs={tabs} setTab={setTab} />
            {tab === "Overview" && (
                <StudentTabOverview
                    {...overviewProps}
                    onStartSession={handleStartSession}
                />
            )}
            {tab === "Assignments" && (
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
