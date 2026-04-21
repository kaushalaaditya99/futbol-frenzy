import ProgressBar from "@/components/pages/demonstration/ProgressBar";
import ButtonBack from "@/components/ui/button/ButtonBack";
import ButtonHalfWidth from "@/components/ui/button/ButtonHalfWidth";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import InputText from "@/components/ui/input/InputText";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { Assignment, getAssignment, Submission } from "@/services/assignments";
import { getSubmission } from "@/services/submissions";
import { shadow, theme } from "@/theme";
import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import { CheckIcon, MoveLeft, MoveRightIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Page() {
    const { token } = useAuth();
    const { id } = useLocalSearchParams<{ id: string }>();

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

    const [grades, setGrades] = useState<{[k: number]: number}>({});

    // Used for Blur Effect
    const insets = useSafeAreaInsets();

    useEffect(() => {
        loadSubmission();
    }, [token]);

    const loadSubmission = async () => {
        if (!token)
            return;
        
        const submission = await getSubmission(token, parseInt(id));
        if (!submission) {
            return router.back();
        }
        setSubmission(submission);

        const assignment = await getAssignment(token, submission.assignmentID);
        if (!assignment)
            return;
        setAssignment(assignment);
    }
    
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
        <View
            style={{
                flex: 1,
                backgroundColor: theme.colors.palettes.neutral[0],
                position: "relative"
            }}
        >
            {(assignment && submission) &&
                <>
                    <StatusBar
                        style="light"  
                    />
                    <BlurView
                        intensity={50}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            minHeight: insets.top,
                            paddingTop: insets.top,
                            zIndex: 100,
                            paddingVertical: theme.padding.xl,
                            paddingHorizontal: theme.padding.md,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            columnGap: 12,
                            backgroundColor: "#ffffff75"
                        }}
                    >
                        <ButtonBack
                            onBack={() => router.back()}
                        />
                    </BlurView>
                    <ScrollView
                        style={{
                            flex: 1,
                        }}
                    >
                        <VideoView
                            player={refDrillPlayer}
                            style={{ 
                                // width: Dimensions.get("screen").width * 1, 
                                height: Dimensions.get("screen").height * 0.5,
                                // position: "absolute",
                                // top: 0,
                                // left: 0,
                                backgroundColor: theme.colors.palettes.neutral[0]
                            }}
                            contentFit="cover"
                        />
                        <View
                            style={{
                                width: "100%", 
                                // height: Dimensions.get("screen").height * 0.5,
                                // maxHeight: Dimensions.get("screen").height * 0.5,
                                // position: "absolute",
                                // top: Dimensions.get("screen").height * 0.5 + 0,
                                // left: 0,
                                flex: 1,
                                backgroundColor: theme.colors.schemes.light.surface,
                                ...shadow.lg
                            }}
                        >
                            <ProgressBar
                                drills={assignment.workout.drills}
                                drillIndex={drillIndex}
                                submittedDrills={Object.keys(grades).map(grade => Number(grade))}
                                setDrillIndex={(drillIndex: number) => safelySetDrillIndex(drillIndex)}
                            />
                            <View
                                style={{
                                    paddingTop: theme.margin.sm,
                                    borderBottomWidth: 1,
                                    borderColor: theme.colors.schemes.light.outlineVariant,
                                    borderStyle: "solid",
                                    backgroundColor: theme.colors.schemes.light.background
                                }}
                            >
                                <View>
                                    <ThemedText
                                        style={{
                                            paddingHorizontal: 12,
                                            paddingBottom: theme.padding.xs,
                                            fontSize: 12,
                                            fontWeight: 600,
                                            letterSpacing: theme.letterSpacing.xl,
                                            color: theme.colors.schemes.light.onSurfaceVariant
                                        }}
                                    >
                                        {(assignment.workout?.workoutName || "").toUpperCase()}
                                    </ThemedText>
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
                                        {assignment.workout.drills[drillIndex].drillName}
                                    </ThemedText>
                                    <ThemedText
                                        style={{
                                            paddingHorizontal: 12,
                                            marginBottom: theme.margin.sm,
                                            fontSize: theme.fontSize.base,
                                            letterSpacing: theme.letterSpacing.xl,
                                            color: theme.colors.schemes.light.onSurfaceVariant
                                        }}
                                    >
                                        {assignment.workout.drills[drillIndex].instructions}
                                    </ThemedText>
                                </View>
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        borderTopWidth: 1,
                                        borderStyle: "dashed",
                                        borderColor: theme.colors.schemes.light.outlineVariant,
                                    }}
                                >
                                    {[
                                        assignment.workout.drills[drillIndex].drillType, 
                                        assignment.workout.drills[drillIndex].difficultyLevel,
                                        assignment.workout.drills[drillIndex].minutes ? `${assignment.workout.drills[drillIndex].minutes} mins` : `${assignment.workout.drills[drillIndex].repetitions} reps`
                                    ].map((tag, i) => (
                                        <View
                                            key={i}
                                            style={{
                                                flex: 1,
                                                justifyContent: "center",
                                                paddingVertical: theme.padding.md,
                                                paddingHorizontal: theme.padding.lg,
                                                borderLeftWidth: i === 0 ? 0 : 1,
                                                borderColor: theme.colors.schemes.light.outlineVariant,
                                                backgroundColor: theme.colors.schemes.light.surface,
                                            }}
                                        >
                                            <ThemedText
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    letterSpacing: 0.25,
                                                    textAlign: "center",
                                                    color: theme.colors.schemes.light.onSurfaceVariant
                                                }}
                                            >
                                                {tag.toUpperCase()}
                                            </ThemedText>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            <View
                                style={{
                                    paddingVertical: 36,
                                    paddingHorizontal: 0,
                                    rowGap: 12,
                                }}
                            >
                                <ThemedText
                                    style={{
                                        paddingBottom: 12,
                                        paddingHorizontal: 12,
                                        marginHorizontal: 12,
                                        fontSize: 18,
                                        fontWeight: 600,
                                        letterSpacing: -0.25,
                                        textAlign: "center",
                                        borderBottomWidth: 1,
                                        borderColor: theme.colors.schemes.light.outlineVariant
                                    }}
                                >
                                    Submission
                                </ThemedText>
                                {!!submission.submitted_drills[drillIndex].videoURL &&
                                    <VideoView 
                                        player={subDrillPlayer}
                                        style={{ 
                                            width: "auto", 
                                            height: 240,
                                            marginHorizontal: 12,
                                            borderRadius: 12,
                                            backgroundColor: theme.colors.palettes.neutral[0]
                                        }}
                                        contentFit="cover"
                                    />
                                }
                                <View
                                    style={{
                                        height: 44,
                                        marginHorizontal: 12,
                                        flexDirection: 'row',
                                        flexShrink: 1,
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
                                            ...theme.shadow.sm
                                        }}
                                    >
                                        <ThemedText
                                            style={{
                                                fontSize: theme.fontSize.base,
                                                fontWeight: 400,
                                                letterSpacing: theme.letterSpacing.sm,
                                                color: theme.colors.schemes.light.onSurfaceVariant,
                                            }}
                                        >
                                            Grade
                                        </ThemedText>
                                    </View>
                                    <InputText
                                        wrapperStyle={{
                                            flexShrink: 1,
                                        }}
                                        inputStyle={{
                                            height: 44,
                                            borderRadius: 0,
                                            fontSize: theme.fontSize.base,
                                            fontWeight: 400,
                                            letterSpacing: theme.letterSpacing.sm,
                                        }}
                                        value={(grades[drillIndex] || '') + ''}
                                        onChangeText={(text) => {
                                            setGrades(grades => ({
                                                ...grades,
                                                [drillIndex]: Number(text)
                                            }));
                                        }}
                                    />
                                    <View
                                        style={{
                                            height: 44,
                                            width: 44,
                                            padding: theme.padding.md,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderWidth: 1,
                                            borderLeftWidth: 0,
                                            borderTopRightRadius: theme.borderRadius.base,
                                            borderBottomRightRadius: theme.borderRadius.base,
                                            borderColor: theme.colors.schemes.light.outlineVariant,
                                            ...theme.shadow.sm
                                        }}
                                    >
                                        <ThemedText
                                            style={{
                                                fontSize: theme.fontSize.base,
                                                fontWeight: 500,
                                                letterSpacing: theme.letterSpacing.sm,
                                                color: theme.colors.schemes.light.onSurfaceVariant,
                                            }}
                                        >
                                            %
                                        </ThemedText>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        display: "flex",
                                        // flexDirection: "row",
                                        paddingTop: 24,
                                        marginHorizontal: 12,
                                        columnGap: 12,
                                        borderTopWidth: 1,
                                        borderColor: theme.colors.schemes.light.outlineVariant
                                    }}
                                >
                                    <ButtonHalfWidth
                                        {...((drillIndex !== 0) ? buttonTheme.black : buttonTheme.disabled)}
                                        onPress={prevDrill}
                                    >
                                        <MoveLeft
                                            color={"white"}
                                            size={18}
                                            opacity={drillIndex !== 0 ? 1: 0.75}
                                        />
                                        <ThemedText
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                letterSpacing: theme.letterSpacing.lg,
                                                color: "white",
                                                textAlign: "center",
                                                opacity: drillIndex !== 0 ? 1: 0.75
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
                                    {(drillIndex === assignment.workout.drills.length - 1) &&
                                        <ButtonHalfWidth
                                            {...buttonTheme.blue}
                                            // onPress={() => submitSession(session, submissions)}
                                        >
                                            {false &&
                                                <ActivityIndicator
                                                    color="white"
                                                    size={18}
                                                />
                                            }
                                            {true &&
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
                                        </ButtonHalfWidth>
                                    }
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </>
            }
        </View>
    )
}