import useFunctionalDate from "@/hooks/useFunctionalDate";
import { getSessions, Session } from "@/services/sessions";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
import { Drill, getDrills } from "@/services/drills";
import { Class, defaultClass } from "@/services/classes";
import { Assignment, getAssignments, getAssignmentsByClass } from "@/services/assignments";
import { useFocusEffect } from "@react-navigation/native";

interface CoachViewProps {
  param_class: Class;
}

const getStudentFullName = (student: Student) => `${student.first_name} ${student.last_name}`;
const getAssignmentName = (assignment: Assignment) => assignment.workout.workoutName;

export default function CoachView(props: CoachViewProps) {
    const { token } = useAuth();
    const [classID, setClassID] = useState(0);
    const [teacherID, setTeacherID] = useState(0);

    const [tab, setTab] = useState("Overview");
    const tabs = ["Overview", "Assignments", "Students", "Progress"];

    const functionalDate = useFunctionalDate();
    const [markedDatesAndAssignments, setMarkedDatesAndAssignments] = useState<MarkedDates>({});

    const [assignments, setAssignments] = useState<Array<Assignment>>([]);
    const [assignmentsViewType, setAssignmentsViewType] = useState("Big");

    const [assignmentsToday, setAssignmentsToday] = useState<Array<Assignment>>([]);

    const [assignmentsOnDate, setAssignmentsOnDate] =  useState<Array<Assignment>>([]);
    const [assignmentsOnDateLabel, setAssignmentsOnDateLabel] = useState("");
    const assignmentsOnDateSearchBar = useSearchBar<Assignment>(
        assignmentsOnDate,
        getAssignmentName,
        getAssignmentName
    );

    const [students, setStudents] = useState<Array<Student>>([]);
    const studentSearchBar = useSearchBar<Student>(
        students,
        getStudentFullName,
        getStudentFullName
    );

    const [showShareClass, setShowShareClass] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const [drills, setDrills] = useState<Array<Drill>>([]);

  useFocusEffect(
      useCallback(() => {
        setStudents(props.param_class.students)
      }, [token, props.param_class])
  );

  useFocusEffect(
      useCallback(() => {
        loadAssignments()
      }, [token, props.param_class])
  );


    useEffect(() => {
        loadSessionsToday(assignments);
    }, [assignments]);


    useEffect(() => {
        const markedDates = functionalDate.getMarkedDates();
        const markedDatesAndSessions = functionalDate.markAssignmentsOnCalendar(markedDates, assignments);
        setMarkedDatesAndAssignments(markedDatesAndSessions);
    }, [assignments, functionalDate.date]);


    useEffect(() => {
        getAssignmentsOnDate(functionalDate.date, assignments);
    }, [assignments, functionalDate.date]);


    useEffect(() => {
        updateSessionsOnDateLabel(functionalDate.date);
    }, [functionalDate.date]);


    // const loadStudents = async (classID: number) => {
    //     const students = await getStudents(classID);
    //     setStudents(students);
    // }

    const loadAssignments = async () => {
        if (!token)
            return;
        //const assignments = await getAssignments(token);
        const assignments = await getAssignmentsByClass(token, props.param_class.id);
        setAssignments(assignments);
    }

    const loadSessionsToday = (assignments: Array<Assignment>) => {
        const todaysSessions: Array<Assignment> = [];
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD in UTC

        for (const assignment of assignments) {
            const dueStr = assignment.dueDate instanceof Date
                ? assignment.dueDate.toISOString().split('T')[0]
                : String(assignment.dueDate).split('T')[0];
            if (dueStr === todayStr) {
                todaysSessions.push(assignment);
            }
        }

        setAssignmentsToday(todaysSessions);
    }


    const getAssignmentsOnDate = (date: Date, assignments: Array<Assignment>) => {
        const dateShortISOString = functionalDate.getShortISOString(date);
        const assignmentsOnDate: Array<Assignment> = [];

        for (const assignment of assignments)
            if (functionalDate.getShortISOString(assignment.dueDate) === dateShortISOString)
                assignmentsOnDate.push(assignment);

        setAssignmentsOnDate(assignmentsOnDate);
    }


    const updateSessionsOnDateLabel = (date: Date) => {
        if (functionalDate.isToday(date)) {
            setAssignmentsOnDateLabel("Today's Assignments");
        }
        else if (functionalDate.isYesterday(date)) {
            setAssignmentsOnDateLabel("Yesterday's Assignments");
        }
        else if (functionalDate.isTomorrow(date)) {
            setAssignmentsOnDateLabel("Tomorrow's Assignments");
        }
        else {
            const dateLabel = functionalDate.date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit",
            });
            setAssignmentsOnDateLabel(`Assignments on ${dateLabel}`);
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
                    assignmentsToday={assignmentsToday}
                    students={students}
                    classId={props.param_class.id}
                    className={props.param_class.className}
                    classCode={props.param_class.classCode}
                />
            }
            {tab === "Assignments" &&
                <TabWorkout
                    onAssignPress={() => router.push({
                        pathname: "/assignSession",
                        params: {
                            date: functionalDate.date.toISOString(),
                            classId: String(props.param_class.id)
                        }
                    })}
                    onCreatePress={() => router.push({
                        pathname: "/createSession",
                        params: { date: functionalDate.date.toISOString() }
                    })}
                    searchBar={assignmentsOnDateSearchBar}
                    viewType={assignmentsViewType}
                    setViewType={setAssignmentsViewType}
                    sessionsOnDate={assignmentsOnDateSearchBar.filtered}
                    sessionsOnDateLabel={assignmentsOnDateLabel}
                    functionalDate={functionalDate}
                    markedDatesAndSessions={markedDatesAndAssignments}
                    classId={props.param_class.id}
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
                    assignments={assignments}
                    students={students}
                />
            }
        </ScrollView>
    )
}
