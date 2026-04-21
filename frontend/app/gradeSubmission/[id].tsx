import ProgressBar from "@/components/pages/demonstration/ProgressBar";
import ButtonBack from "@/components/ui/button/ButtonBack";
import ButtonHalfWidth from "@/components/ui/button/ButtonHalfWidth";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import HeaderWithBack from "@/components/ui/HeaderWithBack";
import InputText from "@/components/ui/input/InputText";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { Assignment, getAssignment, Submission } from "@/services/assignments";
import { createSubmission, getSubmission, gradeSubmittedDrill, gradeSubmission, gradeSubmissionGivenGrades } from "@/services/submissions";
import { padding, shadow, theme } from "@/theme";
import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import { CheckIcon, MoveLeft, MoveRightIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ErrorMessage from "@/components/ui/input/ErrorMessage";

export default function Page() {
    const { token } = useAuth();
    const { submissionID, assignmentID, studentID } = useLocalSearchParams<{
        submissionID?: string,
        assignmentID?: string,
        studentID?: string
    }>();

    const [submission, setSubmission] = useState<Submission>();
    const [assignment, setAssignment] = useState<Assignment>();

    const [drillIndex, setDrillIndex] = useState<number>(0);

    const refDrillPlayer = useVideoPlayer(null, (player) => {
        player.muted = true;
        player.audioMixingMode = "mixWithOthers";
        player.loop = true;
    });

    const subDrillPlayer = useVideoPlayer(null, (player) => {
        player.muted = true;
        player.audioMixingMode = "mixWithOthers";
        player.loop = true;
    });

    const [grades, setGrades] = useState<{[drillIndex: number]: string}>({});
    const [feedbacks, setFeedbacks] = useState<Record<number, string>>({});
    const [isGrading, setIsGrading] = useState(false);
    const [suggestedGrades, setSuggestedGrades] = useState<{[drillIndex: number]: number | null}>({});
    const [loadingSuggestions] = useState(false);

    // Used for Blur Effect
    const insets = useSafeAreaInsets();

    useEffect(() => {
        loadSubmission();
    }, [token]);

    useEffect(() => {
        if (assignment) {
            const drill = assignment.workout.drills[drillIndex];
            if (drill?.url) {
                refDrillPlayer.replace({ uri: drill.url });
            }
        }
        if (submission) {
            const submittedDrill = submission.submitted_drills[drillIndex];
            if (submittedDrill?.videoURL) {
                subDrillPlayer.replace({ uri: submittedDrill.videoURL });
            }
        }
    }, [assignment, submission, drillIndex]);

    const loadSubmission = async () => {
        if (!token)
            return;

        if (submissionID) {
            // Existing submission
            const submission = await getSubmission(token, parseInt(submissionID));
            if (!submission)
                return router.back();

            const assignment = await getAssignment(token, submission.assignmentID);
            if (!assignment)
                return;

            // Merge submitted drills from all submissions for this student+assignment
            const allSubmissions = assignment.submissions?.filter(
                s => s.studentID === submission.studentID
            ) || [];
            const mergedDrills = allSubmissions.flatMap(s => s.submitted_drills || []);
            const mergedSubmission = { ...submission, submitted_drills: mergedDrills };
            setSubmission(mergedSubmission);
            setAssignment(assignment);

            // Fetch AI suggested grades for each drill
            fetchSuggestedGrades(assignment, mergedDrills);
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

    const fetchSuggestedGrades = (_assignmentData: Assignment, submittedDrills: any[]) => {
        const suggestions: {[k: number]: number | null} = {};

        submittedDrills.forEach((sd: any, index: number) => {
            const suggested = sd?.suggestedGrade ?? null;
            suggestions[index] = suggested;
            // Pre-fill grade if not already set
            if (suggested !== null) {
                setGrades(prev => {
                    if (prev[index] === undefined || prev[index] === '') {
                        return { ...prev, [index]: String(Math.round(suggested)) };
                    }
                    return prev;
                });
            }
        });

        setSuggestedGrades(suggestions);
    };

    const nextDrill = () => {
        safelySetDrillIndex(drillIndex + 1);
    }


    const prevDrill = () => {
        safelySetDrillIndex(drillIndex - 1);
    }

    const safelySetDrillIndex = (drillIndex: number) => {
        if (!assignment)
            return;
        const safeDrillIndex = Math.max(0, Math.min(drillIndex || 0, assignment.workout.drills.length - 1));
        setDrillIndex(safeDrillIndex);
    }

    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: theme.colors.schemes.light.background
            }}
        >
            {(assignment && submission) &&
                <>
                    <KeyboardAwareScrollView
                        style={{
                            flex: 1,
                        }}
                    >
                        <HeaderWithBack
                            header='Grade Submission'
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
                                // borderBottomWidth: 0
                            }}
                            buttonStyle={{
                                backgroundColor: "#00000010"
                            }}
                        />
                        <View
                            style={{
                                width: "100%",
                                paddingBottom: 36,
                                flex: 1,
                                rowGap: 12,
                                backgroundColor: theme.colors.schemes.light.surface,
                                ...shadow.lg
                            }}
                        >
                            <View
                                style={{
                                    rowGap: theme.margin.md,
                                    paddingVertical: theme.margin.md,
                                    backgroundColor: 'white',
                                    borderBottomWidth: 1,
                                    borderColor: theme.colors.schemes.light.outlineVariant
                                }}
                            >
                                <ProgressBar
                                    drills={assignment.workout.drills}
                                    drillIndex={drillIndex}
                                    submittedDrills={Object.entries(grades).filter(([drillIndex, grade]) => grade).map(grade => Number(grade[0]))}
                                    setDrillIndex={(drillIndex: number) => safelySetDrillIndex(drillIndex)}
                                />
                                <View
                                    style={{
                                        // borderBottomWidth: 1,
                                        borderColor: theme.colors.schemes.light.outlineVariant,
                                        borderStyle: "solid",
                                        // backgroundColor: theme.colors.schemes.light.background
                                    }}
                                >
                                    <View>
                                        <ThemedText
                                            style={{
                                                paddingHorizontal: 12,
                                                paddingBottom: theme.padding.sm,
                                                fontSize: 20,
                                                fontWeight: 600,
                                                letterSpacing: theme.letterSpacing.sm,
                                                marginBottom: 2
                                            }}
                                        >
                                            Drill {drillIndex + 1}: {assignment.workout.drills[drillIndex].drillName}
                                        </ThemedText>
                                        <ThemedText
                                            style={{
                                                paddingHorizontal: 12,
                                                // marginBottom: theme.margin.sm,
                                                fontSize: 16,
                                                letterSpacing: theme.letterSpacing.xl * 2,
                                                color: theme.colors.schemes.light.onSurfaceVariant
                                            }}
                                        >
                                            {assignment.workout.drills[drillIndex].instructions}
                                        </ThemedText>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={{
                                    paddingTop: 12,
                                    paddingHorizontal: 0,
                                    marginHorizontal: 12,
                                    rowGap: 12,
                                    borderRadius: 12,
                                    borderTopLeftRadius: 12,
                                    borderTopRightRadius: 12,
                                    backgroundColor: 'white',
                                    borderWidth: 1,
                                    borderColor: theme.colors.schemes.light.outlineVariant,
                                    ...shadow.sm
                                }}
                            >
                                <ThemedText
                                    style={{
                                        // paddingBottom: 12,
                                        paddingHorizontal: 12,
                                        marginHorizontal: 12,
                                        fontSize: 14,
                                        fontWeight: 500,
                                        // letterSpacing: 0.125,
                                        textAlign: "center",
                                        // borderBottomWidth: 1,
                                        color: theme.colors.schemes.light.onSurface,
                                        // opacity: 0.5
                                        // borderColor: theme.colors.schemes.light.outlineVariant,
                                        // backgroundColor: 'blue'.
                                    }}
                                >
                                    Reference Video
                                </ThemedText>
                                <VideoView
                                    player={refDrillPlayer}
                                    style={{
                                        // marginHorizontal: 12,
                                        borderBottomLeftRadius: 12,
                                        borderBottomRightRadius: 12,
                                        height: Dimensions.get("screen").height * 0.25,
                                        borderTopWidth: 1,
                                        borderColor: theme.colors.schemes.light.outlineVariant,
                                        backgroundColor: theme.colors.schemes.light.surfaceContainer
                                    }}
                                    contentFit="cover"
                                />
                            </View>
                            <View
                                style={{
                                    paddingTop: 12,
                                    paddingHorizontal: 0,
                                    marginHorizontal: 12,
                                    rowGap: 12,
                                    borderRadius: 12,
                                    borderTopLeftRadius: 12,
                                    borderTopRightRadius: 12,
                                    backgroundColor: 'white',
                                    borderWidth: 1,
                                    borderColor: theme.colors.schemes.light.outlineVariant,
                                    ...shadow.sm
                                }}
                            >
                                <ThemedText
                                    style={{
                                        // paddingBottom: 12,
                                        paddingHorizontal: 12,
                                        marginHorizontal: 12,
                                        fontSize: 14,
                                        fontWeight: 500,
                                        // letterSpacing: 0.125,
                                        textAlign: "center",
                                        // borderBottomWidth: 1,
                                        color: theme.colors.schemes.light.onSurface,
                                        // opacity: 0.5
                                        // borderColor: theme.colors.schemes.light.outlineVariant,
                                        // backgroundColor: 'blue'.
                                    }}
                                >
                                    Submission Video
                                </ThemedText>
                                {!!submission.submitted_drills[drillIndex]?.videoURL &&
                                    <VideoView
                                        player={subDrillPlayer}
                                        style={{
                                            borderBottomLeftRadius: 12,
                                            borderBottomRightRadius: 12,
                                            height: Dimensions.get("screen").height * 0.25,
                                            borderTopWidth: 1,
                                            borderColor: theme.colors.schemes.light.outlineVariant,
                                            backgroundColor: theme.colors.schemes.light.surfaceContainer
                                        }}
                                        contentFit="cover"
                                    />
                                }
                                {!submission.submitted_drills[drillIndex]?.videoURL &&
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderBottomLeftRadius: 12,
                                            borderBottomRightRadius: 12,
                                            height: Dimensions.get("screen").height * 0.25,
                                            borderTopWidth: 1,
                                            borderColor: theme.colors.schemes.light.outlineVariant,
                                            backgroundColor: theme.colors.schemes.light.surfaceContainer
                                        }}
                                    >
                                        <ThemedText
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                // opacity: 0.5,
                                                color: theme.colors.schemes.light.onSurfaceVariant
                                            }}
                                        >
                                            No Submission
                                        </ThemedText>
                                    </View>
                                }
                            </View>
                            <View
                                style={{
                                    marginHorizontal: 12,
                                    rowGap: 4
                                }}
                            >
                                <View
                                    style={{
                                        height: 44,
                                        flexDirection: 'row',
                                        flexShrink: 1,
                                        ...theme.shadow.sm
                                    }}
                                >
                                    <View
                                        style={{
                                            height: 44,
                                            padding: theme.padding.md,
                                            justifyContent: 'center',
                                            borderWidth: 1,
                                            borderRightWidth: 0,
                                            borderTopLeftRadius: theme.borderRadius.base,
                                            borderBottomLeftRadius: theme.borderRadius.base,
                                            borderColor: theme.colors.schemes.light.outlineVariant,
                                            backgroundColor: theme.colors.schemes.light.background
                                        }}
                                    >
                                        <ThemedText
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 400,
                                                letterSpacing: theme.letterSpacing.xl,
                                                color: theme.colors.schemes.light.onSurfaceVariant,
                                            }}
                                        >
                                            Grade
                                        </ThemedText>
                                    </View>
                                    <InputText
                                        value={grades[drillIndex] ?? ''}
                                        onChangeText={(text: string) => setGrades(prev => ({ ...prev, [drillIndex]: text }))}
                                        placeholder="Enter a whole number from 0 to 100"
                                        wrapperStyle={{
                                            flexShrink: 1,
                                        }}
                                        inputStyle={{
                                            borderTopLeftRadius: 0,
                                            borderBottomLeftRadius: 0,
                                            borderRadius: 0,
                                            shadowOpacity: 0
                                        }}
                                    />
                                    <View
                                        style={{
                                            height: 44,
                                            padding: theme.padding.md,
                                            justifyContent: 'center',
                                            borderWidth: 1,
                                            borderLeftWidth: 0,
                                            borderTopRightRadius: theme.borderRadius.base,
                                            borderBottomRightRadius: theme.borderRadius.base,
                                            borderColor: theme.colors.schemes.light.outlineVariant,
                                            backgroundColor: theme.colors.schemes.light.background
                                        }}
                                    >
                                        <ThemedText
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 400,
                                                letterSpacing: theme.letterSpacing.xl,
                                                color: theme.colors.schemes.light.onSurfaceVariant,
                                            }}
                                        >
                                            %
                                        </ThemedText>
                                    </View>
                                </View>
                                {(grades[drillIndex] && /\D/.test(grades[drillIndex])) &&
                                    <ErrorMessage
                                        message="Must enter a whole number."
                                    />
                                }
                                {suggestedGrades[drillIndex] !== undefined && suggestedGrades[drillIndex] !== null && (
                                    <Pressable
                                        onPress={() => setGrades(prev => ({ ...prev, [drillIndex]: String(Math.round(suggestedGrades[drillIndex]!)) }))}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            columnGap: 6,
                                            paddingVertical: 4,
                                        }}
                                    >
                                        <ThemedText style={{
                                            fontSize: 13,
                                            color: theme.colors.coreColors.primary,
                                            fontWeight: '500',
                                        }}>
                                            AI Suggested: {Math.round(suggestedGrades[drillIndex]!)}%  — Tap to apply
                                        </ThemedText>
                                    </Pressable>
                                )}
                                {loadingSuggestions && suggestedGrades[drillIndex] === undefined && (
                                    <ThemedText style={{
                                        fontSize: 13,
                                        color: theme.colors.schemes.light.onSurfaceVariant,
                                        paddingVertical: 4,
                                    }}>
                                        Analyzing video...
                                    </ThemedText>
                                )}
                                <View
                                    style={{
                                        paddingVertical: 10,
                                        // marginHorizontal: 12,
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            fontSize: theme.fontSize.base,
                                            fontWeight: 500,
                                            letterSpacing: theme.letterSpacing.sm,
                                            color: theme.colors.schemes.light.onSurfaceVariant,
                                            marginBottom: 8,
                                        }}
                                    >
                                        Feedback
                                    </ThemedText>
                                    <InputText
                                        value={feedbacks[drillIndex] || ''}
                                        onChangeText={(text: string) => setFeedbacks(prev => ({ ...prev, [drillIndex]: text }))}
                                        placeholder="Write feedback for this drill..."
                                        multiline={true}
                                        inputStyle={{
                                            paddingHorizontal: padding.lg,
                                            paddingVertical: padding.lg,
                                            minHeight: 80,
                                            textAlignVertical: 'top',
                                        }}
                                    />
                                </View>
                            </View>
                            <View
                                style={{
                                    display: "flex",
                                    paddingTop: 12,
                                    marginHorizontal: 12,
                                    rowGap: 12,
                                    borderTopWidth: 1,
                                    borderColor: theme.colors.schemes.light.outlineVariant
                                }}
                            >
                                <ButtonHalfWidth
                                    {...buttonTheme.black}
                                    onPress={drillIndex !== 0 ? prevDrill : () => router.back()}
                                >
                                    <MoveLeft
                                        color={"white"}
                                        size={18}
                                    />
                                    <ThemedText
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 500,
                                            letterSpacing: theme.letterSpacing.lg,
                                            color: "white",
                                            textAlign: "center",
                                        }}
                                    >
                                        Back
                                    </ThemedText>
                                </ButtonHalfWidth>
                                {(drillIndex !== assignment.workout.drills.length - 1) &&
                                    <ButtonHalfWidth
                                        {...buttonTheme.black}
                                        onPress={nextDrill}
                                    >
                                        <ThemedText
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                letterSpacing: theme.letterSpacing.lg,
                                                color: "white",
                                                textAlign: "center",
                                            }}
                                        >
                                            Next
                                        </ThemedText>
                                        <MoveRightIcon
                                            color={"white"}
                                            size={18}
                                        />
                                    </ButtonHalfWidth>
                                }
                                {(drillIndex === assignment.workout.drills.length - 1) && (() => {
                                    const allGraded = submission.submitted_drills.every((_, i) => {
                                        const g = parseInt(grades[i], 10);
                                        return !isNaN(g) && g >= 0 && g <= 100;
                                    });
                                    return <ButtonHalfWidth
                                        {...(allGraded ? buttonTheme.blue : buttonTheme.disabled)}
                                        onPress={async () => {
                                            if (!allGraded || !token || !submission) 
                                                return;
                                            
                                            setIsGrading(true);
                                            try {
                                               const output = await gradeSubmissionGivenGrades(token, submission.id, Object.fromEntries(Object.entries(grades).map(([drillIndex, grade]) => [drillIndex, Number(grade)])), feedbacks);
                                                if (output) {
                                                    router.back();
                                                    return;
                                                }
                                                alert('Error Grading Submission!')
                                            } catch (err) {
                                                console.error("Grading Error:", err);
                                            } finally {
                                                setIsGrading(false);
                                            }
                                        }}
                                    >
                                        {isGrading ?
                                            <ActivityIndicator
                                                color="white"
                                                size={18}
                                            />
                                        :
                                            <CheckIcon
                                                color="white"
                                                size={18}
                                            />
                                        }
                                        <ThemedText
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                letterSpacing: theme.letterSpacing.lg,
                                                color: "white",
                                                textAlign: "center"
                                            }}
                                        >
                                            Complete Grading
                                        </ThemedText>
                                    </ButtonHalfWidth>;
                                })()}
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </>
            }
        </SafeAreaView>
    )
}
