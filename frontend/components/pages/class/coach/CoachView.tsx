import useFunctionalDate from "@/hooks/useFunctionalDate";
import { getSessions, Session } from "@/services/sessions";
import { useEffect, useState } from "react";
import { MarkedDates } from "react-native-calendars/src/types";
import Tabs from "./Tabs";
import TabOverview from "./TabOverview/TabOverview";
import TabWorkout from "./TabWorkout/TabWorkout";
import { ScrollView } from "react-native";
import useSearchBar from "@/hooks/useSearchBar";
import TabStudent from "./TabStudent/TabStudent";
import { getStudents, Student } from "@/services/students";
import TabProgress from "./TabProgress/TabProgress";
import { router } from "expo-router";
import { Drillv2 as Drill, getDrills } from "@/services/drills";


const getStudentFullName = (student: Student) => `${student.fName} ${student.lName}`;

export default function CoachView() {
    const [classID, setClassID] = useState(0);
    const [teacherID, setTeacherID] = useState(0);

    const [tab, setTab] = useState("Progress");
    const tabs = ["Overview", "Workout", "Students", "Progress"];

    const functionalDate = useFunctionalDate();
    const [markedDatesAndSessions, setMarkedDatesAndSessions] = useState<MarkedDates>({});

    const [sessions, setSessions] = useState<Array<Session>>([]);
    const [sessionsViewType, setSessionsViewType] = useState("Big");

    const [sessionsToday, setSessionsToday] = useState<Array<Session>>([]);

    const [sessionsOnDate, setSessionsOnDate] =  useState<Array<Session>>([]);
    const [sessionsOnDateLabel, setSessionsOnDateLabel] = useState("");
    const sessionsOnDateSearchBar = useSearchBar<Session>(sessionsOnDate, "name", "name");
    
    const [students, setStudents] = useState<Array<Student>>([]);
    const studentSearchBar = useSearchBar<Student>(
        students, 
        getStudentFullName, 
        getStudentFullName
    );

    const [showShareClass, setShowShareClass] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const [drills, setDrills] = useState<Array<Drill>>([]);

    useEffect(() => {
        loadSessions(teacherID);
        loadStudents(classID);
        loadDrills(teacherID);
    }, []);


    useEffect(() => {
        loadSessionsToday(sessions);
    }, [sessions]);


    useEffect(() => {
        const markedDates = functionalDate.getMarkedDates();
        const markedDatesAndSessions = functionalDate.markSessionsOnCalendar(markedDates, sessions);
        setMarkedDatesAndSessions(markedDatesAndSessions);
    }, [sessions, functionalDate.date]);


    useEffect(() => {
        getSessionsOnDate(functionalDate.date, sessions);
    }, [sessions, functionalDate.date]);


    useEffect(() => {
        updateSessionsOnDateLabel(functionalDate.date);
    }, [functionalDate.date]);


    const loadStudents = async (classID: number) => {
        const students = await getStudents(classID);
        setStudents(students);
    }

    const loadSessions = async (teacherID: number) => {
        const sessions = await getSessions(teacherID);
        setSessions(sessions);
    }


    const loadDrills = async (teacherID: number) => {
        const drills = await getDrills(teacherID);
        setDrills(drills);
    }


    const loadSessionsToday = (sessions: Array<Session>) => {
        const todaysSessions: Array<Session> = [];
        const today = new Date();
        const todayDate = today.getDate();
        const todayMonth = today.getMonth();
        const todayFullYear = today.getFullYear();

        for (const session of sessions) {
            const sameDayAsToday = session.date.getDate() === todayDate && session.date.getMonth() === todayMonth &&  session.date.getFullYear() === todayFullYear;
            if (sameDayAsToday) {
                todaysSessions.push(session);
            }
        }
        
        setSessionsToday(todaysSessions);
    }


    const getSessionsOnDate = (date: Date, sessions: Array<Session>) => {
        const dateShortISOString = functionalDate.getShortISOString(date);
        const sessionsOnDate: Array<Session> = [];

        for (const session of sessions)
            if (functionalDate.getShortISOString(session.date) === dateShortISOString)
                sessionsOnDate.push(session);

        setSessionsOnDate(sessionsOnDate);
    }


    const updateSessionsOnDateLabel = (date: Date) => {
        if (functionalDate.isToday(date)) {
            setSessionsOnDateLabel("Today's Sessions");
        }
        else if (functionalDate.isYesterday(date)) {
            setSessionsOnDateLabel("Yesterday's Sessions");
        }
        else if (functionalDate.isTomorrow(date)) {
            setSessionsOnDateLabel("Tomorrow's Sessions");
        }
        else {
            const dateLabel = functionalDate.date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit",
            });
            setSessionsOnDateLabel(`Sessions on ${dateLabel}`);
        }
    }


    return (
        <ScrollView>
            <Tabs
                tab={tab}
                tabs={tabs}
                setTab={setTab}
            />
            {tab === "Overview" &&
                <TabOverview
                    showShareClass={showShareClass}
                    setShowShareClass={setShowShareClass}
                    showSettings={showSettings}
                    setShowSettings={setShowSettings}
                    sessionsToday={sessionsToday}
                    students={students}
                    className="U12 Boys A-Team"
                    classCode="XK7M2P"
                />
            }
            {tab === "Workout" &&
                <TabWorkout
                    onAssignPress={() => router.push({
                        pathname: "/assignSession",
                        params: { date: functionalDate.date.toISOString() }
                    })}
                    onCreatePress={() => router.push({
                        pathname: "/createSession",
                        params: { date: functionalDate.date.toISOString() }
                    })}
                    searchBar={sessionsOnDateSearchBar}
                    viewType={sessionsViewType}
                    setViewType={setSessionsViewType}
                    sessionsOnDate={sessionsOnDateSearchBar.filtered}
                    sessionsOnDateLabel={sessionsOnDateLabel}
                    functionalDate={functionalDate}
                    markedDatesAndSessions={markedDatesAndSessions}
                />
            }
            {tab === "Students" &&
                <TabStudent
                    searchBar={studentSearchBar}
                    students={studentSearchBar.filtered}
                />
            }
            {tab === "Progress" &&
                <TabProgress
                    drills={drills}
                    sessions={sessions}
                    students={students}
                />
            }
        </ScrollView>
    )
}