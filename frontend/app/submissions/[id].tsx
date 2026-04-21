import CoachView from "@/components/pages/submissions/CoachView";
import StudentView from "@/components/pages/submissions/StudentView";
import HeaderWithBack from "@/components/ui/HeaderWithBack";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { Assignment, getAssignment, Submission } from "@/services/assignments";
import { createSubmission, getSubmission } from "@/services/submissions";
import { theme } from "@/theme";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Student } from "@/services/students";
import { getUserByID, User } from "@/services/user";

export default function Page() {
    const { role, token } = useAuth();
    const { submissionID, assignmentID, studentID } = useLocalSearchParams<{
        submissionID?: string,
        assignmentID?: string,
        studentID?: string
    }>();

    const [student, setStudent] = useState<User>();
    const [submission, setSubmission] = useState<Submission>();
    const [assignment, setAssignment] = useState<Assignment>();

    useFocusEffect(
        useCallback(() => {
            loadSubmission();
        }, [token])
    );

    const loadSubmission = async () => {
        if (!token)
            return;

        if (submissionID !== null && submissionID !== undefined && Number(submissionID) >= 0) {
            const submission = await getSubmission(token, parseInt(submissionID));
            if (submission) {
                setSubmission(submission);
            }
        }

        if (assignmentID !== null && assignmentID !== undefined && Number(assignmentID) >= 0) {
            const assignment = await getAssignment(token, Number(assignmentID));
            if (assignment)
                setAssignment(assignment);
        }

        if (studentID !== null && studentID !== undefined && Number(studentID) >= 0) {
            const student = await getUserByID(token, Number(studentID));
            if (student)
                setStudent(student);
        }
    }

    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: theme.colors.schemes.light.background
            }}
        >
            <HeaderWithBack
                header='Submission'
                subHeader={(
                    <View>
                        <ThemedText
                            style={{
                                fontSize: 16,
                                letterSpacing: theme.letterSpacing.xl * 1,
                                color: theme.colors.schemes.light.onSurfaceVariant
                            }}
                        >
                            {student?.first_name} {student?.last_name}, {assignment?.workout.workoutName}
                        </ThemedText>
                    </View>
                )}
                onBack={() => router.back()}
                containerStyle={{
                    paddingVertical: theme.margin.xs,
                    paddingHorizontal: theme.margin.sm,
                    borderBottomWidth: 1,
                }}
                buttonStyle={{
                    backgroundColor: "#00000010"
                }}
            />
            <>
            {role === 'Coach'
                ? <CoachView
                    student={student}
                    submission={submission}
                    assignment={assignment}
                    submissionID={([null, undefined] as any).includes(submissionID) ? -1 : Number(submissionID)}
                />
                :
                <StudentView
                    submission={submission}
                    assignment={assignment}
                    submissionID={([null, undefined] as any).includes(submissionID) ? -1 : Number(submissionID)}
                />
            }
        </>
        </SafeAreaView>
    )
}
