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

export default function Page() {
    const { role, token } = useAuth();
    const { submissionID, assignmentID, studentID } = useLocalSearchParams<{ 
        submissionID?: string, 
        assignmentID?: string, 
        studentID?: string 
    }>();

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

        if (submissionID) {
            // Existing submission
            const submission = await getSubmission(token, parseInt(submissionID));
            if (!submission)
                return router.back();
            setSubmission(submission);

            const assignment = await getAssignment(token, submission.assignmentID);
            if (!assignment)
                return;
            setAssignment(assignment);
        } 
        else if (assignmentID && studentID) {
            // No submission yet — create one first
            const submission = await createSubmission(token, parseInt(assignmentID), parseInt(studentID));
            if (!submission)
                return router.back();
            setSubmission(submission);

            const assignment = await getAssignment(token, parseInt(assignmentID));
            if (!assignment)
                return;
            setAssignment(assignment);
        } 
        else {
            router.back();
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
                            {submission?.student.first_name} {submission?.student.last_name}, {assignment?.workout.workoutName}
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
            {assignment && submission && 
                <>
                    {role === 'Coach' &&
                        <CoachView
                            submission={submission}
                            assignment={assignment}
                            submissionID={submission.id}
                        />
                    }
                    {role !== 'Coach' &&
                        <StudentView
                            submission={submission}
                            assignment={assignment}
                            submissionID={submission.id}
                        />
                    }
                </>    
            }
        </SafeAreaView>
    )
}