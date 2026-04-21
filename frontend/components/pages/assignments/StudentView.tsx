import { useAuth } from "@/contexts/AuthContext";
import { Assignment, getAssignment } from "@/services/assignments";
import { colors, shadow, theme } from "@/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { CheckCircle, Video, CheckCircle2 } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View, Pressable } from "react-native";
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

    // Load student ID
    const loadStudentId = async () => {
        const storedUserID = await AsyncStorage.getItem('userID');
        if (storedUserID) {
            setStudentId(parseInt(storedUserID, 10));
        }
    };

    // Load assignment data
    const loadAssignment = async (forceRefresh = false) => {
        if (!token) return;
        if (!forceRefresh) setIsLoading(true);
        try {
            console.log("[StudentView] Loading assignment, forceRefresh:", forceRefresh);
            const assignmentData = await getAssignment(token, props.assignmentID);
            console.log("[StudentView] Assignment data:", assignmentData?.id, "submissions:", assignmentData?.submissions?.length);

            if (assignmentData) {
                setAssignment(assignmentData);
                // Extract completed drill IDs from ALL student's submissions for this assignment
                // Get userID from AsyncStorage, default to 1 if not found (same as RecordDrillScreen)
                const storedUserID = await AsyncStorage.getItem('userID');
                const currentStudentId = storedUserID ? parseInt(storedUserID, 10) : 1;
                console.log("[StudentView] Current student ID:", currentStudentId);

                // Find ALL submissions for this student (in case there are multiple)
                const mySubmissions = assignmentData.submissions?.filter(
                    sub => sub.studentID === currentStudentId
                ) || [];
                console.log("[StudentView] My submissions:", mySubmissions.map(s => ({ id: s.id, drills: s.submitted_drills?.map(d => d.drillID) })));

                // Combine completed drill IDs from ALL submissions
                const completedIds = new Set<number>();
                for (const submission of mySubmissions) {
                    if (submission.submitted_drills) {
                        for (const drill of submission.submitted_drills) {
                            completedIds.add(drill.drillID);
                        }
                    }
                }
                console.log("[StudentView] Completed drill IDs:", Array.from(completedIds));
                setCompletedDrillIds(completedIds);
            }
        } catch (err) {
            console.error("Failed to load assignment:", err);
        } finally {
            if (!forceRefresh) setIsLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        loadStudentId();
        loadAssignment();
    }, [token, props.assignmentID]);

    // Refresh when screen regains focus (returning from recording)
    useFocusEffect(
        useCallback(() => {
            // Only refresh if we already have token (meaning we've loaded before)
            if (token) {
                // Use forceRefresh to avoid showing loading spinner
                loadAssignment(true);
            }
        }, [token, props.assignmentID])
    );

    // Also refresh when studentId becomes available (after initial mount)
    useEffect(() => {
        if (token && studentId) {
            loadAssignment();
        }
    }, [studentId]);

    const handleRecordDrill = (drillId: number) => {
        console.log("[StudentView] Navigating to record drill with drillId:", drillId);
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
    console.log("[StudentView] Workout drills:");
    drills.forEach((d: any, i: number) => {
        console.log(`  [${i}] drillID=${d.drillID}, id=${d.id}, name=${d.drillName || d.name}`);
    });
    const totalDrills = drills.length;
    const completedCount = completedDrillIds.size;
    const allCompleted = completedCount === totalDrills;

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
                    {assignment.workout?.workoutName || `Workout #${assignment.workoutID}`}
                </ThemedText>
                <View style={{ flexDirection: "row", alignItems: 'center', marginTop: 4, columnGap: 8 }}>
                    <ThemedText style={{
                        fontSize: theme.fontSize.base,
                        color: theme.colors.schemes.light.onSurfaceVariant,
                    }}>
                        {assignment.dueDate
                            ? `Due: ${new Date(assignment.dueDate).toLocaleDateString()}`
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
                        fontSize: theme.fontSize.sm,
                        color: allCompleted
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
                            alignItemsCenter={true}
                            rightElement={
                                <View style={{
                                    width: 36,
                                    height: 36,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 1000,
                                    borderWidth: 1,
                                    borderColor: colors.schemes.light.outlineVariant,
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

            {/* Completion Status */}
            {allCompleted && (
                <View style={{
                    marginHorizontal: theme.padding.md,
                    marginBottom: theme.padding.md,
                    padding: theme.padding.lg,
                    backgroundColor: theme.colors.coreColors.primary + "15",
                    borderRadius: theme.borderRadius.base,
                    borderWidth: 1,
                    borderColor: theme.colors.coreColors.primary,
                    alignItems: "center",
                    rowGap: 8,
                }}>
                    <CheckCircle2 size={32} color={theme.colors.coreColors.primary} />
                    <ThemedText style={{
                        fontSize: theme.fontSize.base,
                        fontWeight: 600,
                        color: theme.colors.coreColors.primary,
                    }}>
                        All Drills Completed!
                    </ThemedText>
                    <ThemedText style={{
                        fontSize: theme.fontSize.sm,
                        color: theme.colors.schemes.light.onSurfaceVariant,
                        textAlign: "center",
                    }}>
                        Your workout has been submitted for review. Your coach will grade your submission.
                    </ThemedText>
                    <Pressable
                        onPress={() => router.replace('/(tabs)')}
                        style={{
                            marginTop: 8,
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            backgroundColor: theme.colors.coreColors.primary,
                            borderRadius: theme.borderRadius.base,
                        }}
                    >
                        <ThemedText style={{
                            fontSize: theme.fontSize.sm,
                            fontWeight: 600,
                            color: "white",
                        }}>
                            Done
                        </ThemedText>
                    </Pressable>
                </View>
            )}
        </ScrollView>
    );
}