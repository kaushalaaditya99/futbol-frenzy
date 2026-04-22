import { View } from "react-native";
import { colors, fontSize, letterSpacing, margin, padding } from "@/theme";
import CardMetric from "@/components/pages/CardMetric";
import { Fragment, useMemo } from "react";
import { Student } from "@/services/students";
import ButtonShare from "../ButtonShare";
import ButtonSettings from "../ButtonSettings";
import ThemedText from "@/components/ui/ThemedText";
import NoSessions from "../../NoSessions";
import ShareClass from "./ShareClass";
import Settings from "./Settings";
import { Assignment } from "@/services/assignments";
import RowCardAssignment from "@/components/pages/home/RowCardAssignment";

interface TabOverviewProps {
    showShareClass: boolean;
    showSettings: boolean;
    setShowSettings: (settings: boolean) => void;
    setShowShareClass: (shareClass: boolean) => void;
    assignmentsToday: Assignment[];
    assignments: Assignment[];
    students: Student[];
    classId?: number;
    className?: string;
    classCode?: string;
    onStudentRemoved?: () => void;
}

export default function TabOverview(props: TabOverviewProps) {
    const ungradedCount = useMemo(() => {
        let count = 0;
        for (const assignment of props.assignments) {
            const subs = assignment.submissions || [];
            // Group by studentID — if any submission for a student is graded, they're graded
            const studentIds = new Set(subs.map(s => s.studentID));
            for (const sid of studentIds) {
                const studentSubs = subs.filter(s => s.studentID === sid);
                const anyGraded = studentSubs.some(s => s.dateGraded);
                if (!anyGraded && studentSubs.length > 0) count++;
            }
        }
        return count;
    }, [props.assignments]);

    return (
        <View
            style={{
                backgroundColor: colors.schemes.light.background
            }}
        >
            {props.showSettings &&
                <Settings
                    onClose={() => props.setShowSettings(false)}
                    classId={props.classId}
                    className={props.className}
                    classCode={props.classCode}
                    students={props.students}
                    onStudentRemoved={props.onStudentRemoved}
                />
            }
            {props.showShareClass &&
                <ShareClass
                    classCode={props.classCode}
                    onClose={() => props.setShowShareClass(false)}
                />
            }
            <View
                style={{
                    paddingVertical: margin["3xs"],
                    paddingHorizontal: margin["3xs"],
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    columnGap: margin["3xs"],
                    borderBottomWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant
                }}
            >
                <ButtonShare
                    onPress={() => props.setShowShareClass(true)}
                />
                <ButtonSettings
                    onPress={() => props.setShowSettings(true)}
                />
            </View>
            <View
                style={{
                    paddingVertical: margin.sm,
                    paddingHorizontal: margin.sm,
                    flexDirection: "row",
                    columnGap: padding.lg,
                    borderBottomWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant
                }}
            >
                <CardMetric
                    label={"Students\nin Class"}
                    value={props.students.length.toString()}
                />
                <CardMetric
                    label={props.assignmentsToday.length === 1 ? "Assignments\nToday" : "Assignments\nToday"}
                    value={""+props.assignmentsToday.length}
                />
                <CardMetric
                    label={"Assignments\nUngraded"}
                    value={""+ungradedCount}
                />
            </View>
            <View
                style={{
                    paddingVertical: margin.sm,
                    paddingHorizontal: margin.sm,
                    rowGap: padding.lg,
                }}
            >
                <ThemedText
                    style={{
                        fontWeight: 500,
                        fontSize: fontSize.lg,
                        letterSpacing: letterSpacing.base,
                        color: colors.schemes.light.onBackground,
                    }}
                >
                    Today's Assignments
                </ThemedText>
                <View
                    style={{
                        display: "flex",
                        rowGap: padding.lg
                    }}
                >
                    {props.assignmentsToday.map((assignment: Assignment, i: number) => (
                        <Fragment key={i}>
                            <RowCardAssignment
                                {...assignment}
                                showTag={false}
                            />
                        </Fragment>
                    ))}
                    {!props.assignmentsToday.length &&
                        <NoSessions/>
                    }
                </View>
            </View>
        </View>
    )
}
