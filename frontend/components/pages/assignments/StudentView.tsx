import { useAuth } from "@/contexts/AuthContext";
import { Assignment, getAssignment } from "@/services/assignments";
import { theme } from "@/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { CheckCircle, Video } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import ThemedText from "@/components/ui/ThemedText";
import RowCard from "@/components/ui/RowCard";

interface StudentViewProps {
    assignmentID: number;
}

export default function StudentView(props: StudentViewProps) {
    const { token } = useAuth();
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [studentId, setStudentId] = useState<number | null>(null);
    const [completedDrillIds, setCompletedDrillIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        loadAssignment();
        loadStudentId();
    }, [token, props.assignmentID]);

    const loadStudentId = async () => {
        const storedUserID = await AsyncStorage.getItem('userID');
        if (storedUserID) {
            setStudentId(parseInt(storedUserID, 10));
        }
    };

    const loadAssignment = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const assignmentData = await getAssignment(token, props.assignmentID);
            if (assignmentData) {
                setAssignment(assignmentData);
                // Extract completed drill IDs from student's submission
                if (studentId !== null) {
                    const mySubmission = assignmentData.submissions?.find(
                        sub => sub.studentID === studentId
                    );
                    if (mySubmission?.submitted_drills) {
                        const completedIds = new Set(
                            mySubmission.submitted_drills.map(sd => sd.drillID)
                        );
                        setCompletedDrillIds(completedIds);
                    }
                }
            }
        } catch (err) {
            console.error("Failed to load assignment:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Refresh assignment when screen regains focus (returning from recording)
    useEffect(() => {
        if (token && props.assignmentID) {
            loadAssignment();
        }
    }, [token, props.assignmentID]);

    const handleRecordDrill = (drillId: number) => {
        router.push(`/record-drill?drillId=${drillId}&assignmentId=${props.assignmentID}&returnTo=assignment`);
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={theme.colors.coreColors.primary} />
                <ThemedText style={{ marginTop: 12 }}>Loading assignment...</ThemedText>
            </View>
        );
    }

    if (!assignment?.workout?.drills?.length) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
                <ThemedText style={{ textAlign: "center", color: theme.colors.schemes.light.onSurfaceVariant }}>
                    No drills found in this assignment.
                </ThemedText>
            </View>
        );
    }

    const drills = assignment.workout.drills;
    const totalDrills = drills.length;
    const completedCount = completedDrillIds.size;

    return (
        <ScrollView style={{ flex: 1, backgroundColor: theme.colors.schemes.light.background }}>
            {/* Assignment Header */}
            <View style={{
                paddingVertical: theme.padding.md,
                paddingHorizontal: theme.padding.md,
                borderBottomWidth: 1,
                borderColor: theme.colors.schemes.light.outlineVariant,
                backgroundColor: theme.colors.schemes.light.surface,
            }}>
                <ThemedText style={{
                    fontSize: theme.fontSize.xl,
                    fontWeight: 600,
                    color: theme.colors.schemes.light.onSurface,
                }}>
                    {assignment.workout?.workoutName || assignment.workoutID}
                </ThemedText>
                <View style={{ flexDirection: "row", marginTop: 4, columnGap: 8 }}>
                    <ThemedText style={{
                        fontSize: theme.fontSize.sm,
                        color: theme.colors.schemes.light.onSurfaceVariant,
                    }}>
                        {assignment.dueDate
                            ? `Due: ${new Date(assignment.dueDate).toLocaleDateString()}`
                            : "No due date"
                        }
                    </ThemedText>
                    <ThemedText style={{
                        fontSize: theme.fontSize.sm,
                        color: completedCount === totalDrills
                            ? theme.colors.coreColors.primary
                            : theme.colors.schemes.light.onSurfaceVariant,
                    }}>
                        • {completedCount}/{totalDrills} completed
                    </ThemedText>
                </View>
            </View>

            {/* Drills List */}
            <View style={{
                paddingVertical: theme.padding.md,
                paddingHorizontal: theme.padding.md,
                rowGap: theme.padding.sm,
            }}>
                <ThemedText style={{
                    fontSize: theme.fontSize.base,
                    fontWeight: 500,
                    marginBottom: theme.padding.xs,
                    color: theme.colors.schemes.light.onSurfaceVariant,
                }}>
                    Drills
                </ThemedText>

                {drills.map((drill: any, index: number) => {
                    // drillID is the actual drill ID, id is the WorkoutDrill id
                    const drillId = drill.drillID || drill.id;
                    const isCompleted = completedDrillIds.has(drillId);

                    return (
                        <RowCard
                            key={drillId}
                            onPress={() => !isCompleted && handleRecordDrill(drillId)}
                            title={`${index + 1}. ${drill.drillName || drill.name || 'Drill'}`}
                            descriptions={[
                                drill.drillType || drill.type || "Drill",
                                drill.difficultyLevel || "Beginner",
                            ]}
                            imageText={String(index + 1)}
                            imageBackgroundColor={isCompleted
                                ? theme.colors.coreColors.primary
                                : theme.colors.schemes.light.surfaceContainerHighest
                            }
                            imageTextColor={isCompleted ? "white" : theme.colors.schemes.light.onSurfaceVariant}
                            rightElement={
                                <View style={{
                                    width: 36,
                                    height: 36,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 1000,
                                    backgroundColor: isCompleted
                                        ? theme.colors.coreColors.primary
                                        : theme.colors.schemes.light.surfaceContainerHighest,
                                }}>
                                    {isCompleted ? (
                                        <CheckCircle size={20} color="white" />
                                    ) : (
                                        <Video size={20} color={theme.colors.schemes.light.onSurfaceVariant} />
                                    )}
                                </View>
                            }
                        />
                    );
                })}
            </View>
        </ScrollView>
    );
}