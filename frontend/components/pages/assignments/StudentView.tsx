import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { Assignment, getAssignment } from "@/services/assignments";
import { colors, shadow, theme } from "@/theme";
import { router, useFocusEffect } from "expo-router";
import { CheckCircle, Video } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import ThemedText from "@/components/ui/ThemedText";
import RowCard from "@/components/ui/RowCard";

interface StudentViewProps {
    assignmentID: number;
}

export default function StudentView(props: StudentViewProps) {
    const { token } = useAuth();
    const { profile } = useProfile();
    const studentId = profile.id || null;
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [completedDrillIds, setCompletedDrillIds] = useState<Set<number>>(new Set());

    const loadAssignment = async () => {
        if (!token || !studentId) return;
        try {
            const assignmentData = await getAssignment(token, props.assignmentID);
            if (assignmentData) {
                setAssignment(assignmentData);
                const mySubmissions = assignmentData.submissions?.filter(
                    sub => sub.studentID === studentId
                ) || [];
                const completedIds = new Set(
                    mySubmissions.flatMap(sub =>
                        (sub.submitted_drills || [])
                            .filter(sd => sd.videoURL)
                            .map(sd => sd.drillID)
                    )
                );
                setCompletedDrillIds(completedIds);
            }
        } catch (err) {
            console.error("Failed to load assignment:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        if (studentId && token) {
            loadAssignment();
        }
    }, [studentId, token, props.assignmentID]);

    // Refresh when returning from recording screen
    useFocusEffect(
        useCallback(() => {
            if (token && studentId) {
                loadAssignment();
            }
        }, [token, studentId, props.assignmentID])
    );

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
                paddingVertical: theme.margin.xs,
                paddingHorizontal: theme.margin.sm,
                borderBottomWidth: 1,
                borderColor: theme.colors.schemes.light.outlineVariant,
                backgroundColor: 'white',
            }}>
                <ThemedText style={{
                    fontSize: theme.fontSize.xl,
                    fontWeight: 600,
                    color: theme.colors.schemes.light.onSurface,
                }}>
                    {assignment.workout?.workoutName || assignment.workoutID}
                </ThemedText>
                <View style={{ flexDirection: "row", alignItems: 'center', marginTop: 4, columnGap: 8 }}>
                    <ThemedText style={{
                        fontSize: theme.fontSize.base,
                        color: theme.colors.schemes.light.onSurfaceVariant,
                    }}>
                        {assignment.dueDate
                            ? `Due: ${new Date(assignment.dueDate).toLocaleDateString('en-US', { timeZone: 'UTC' })}`
                            : "No Due Date"
                        }
                    </ThemedText>
                    <ThemedText
                        style={{
                            color: colors.coreColors.primary
                        }}
                    >
                    {' • '}
                    </ThemedText>
                    <ThemedText style={{
                        fontSize: theme.fontSize.base,
                        color: completedCount === totalDrills
                            ? theme.colors.coreColors.primary
                            : theme.colors.schemes.light.onSurfaceVariant,
                    }}>
                        {completedCount}/{totalDrills} Drills Completed
                    </ThemedText>
                </View>
            </View>

            {/* Drills List */}
            <View style={{
                paddingVertical: theme.margin.xs,
                paddingHorizontal: theme.margin.xs,
                rowGap: theme.margin.xs,
            }}>
                {/* <ThemedText style={{
                    fontSize: theme.fontSize.base,
                    fontWeight: 500,
                    // marginBottom: theme.padding.xs,
                    color: theme.colors.schemes.light.onSurface,
                }}>
                    Drills
                </ThemedText> */}

                {drills.map((drill: any, index: number) => {
                    // drillID is the actual drill ID, id is the WorkoutDrill id
                    const drillId = drill.drillID || drill.id;
                    const isCompleted = completedDrillIds.has(drillId);

                    return (
                        <RowCard
                            key={drillId}
                            onPress={() => handleRecordDrill(drillId)}
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
                            alignItemsCenter={true}
                            rightElement={
                                <View style={{
                                    width: 36,
                                    height: 36,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 1000,
                                    borderWidth: 1,
                                    borderColor: isCompleted ? colors.coreColors.primary : colors.schemes.light.outlineVariant,
                                    ...shadow.sm,
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
