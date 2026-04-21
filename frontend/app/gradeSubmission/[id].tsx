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

    const [grades, setGrades] = useState({});

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
                                    paddingVertical: 12,
                                    paddingTop: 20,
                                    paddingHorizontal: 0,
                                }}
                            >
                                <ThemedText
                                    style={{
                                        paddingHorizontal: 12,
                                        fontSize: 18,
                                        fontWeight: 600,
                                        letterSpacing: -0.25,
                                        marginBottom: 2,
                                        textAlign: "center"
                                    }}
                                >
                                    Submission
                                </ThemedText>
                                {/* <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        marginBottom: 20,
                                        paddingHorizontal: 12,
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            fontSize: 14,
                                            letterSpacing: 0.25,
                                            color: colors.schemes.light.onSurfaceVariant,
                                            textAlign: "center",
                                            maxWidth: 300,
                                        }}
                                    >
                                        Upload a video of yourself performing the drill.
                                    </ThemedText>
                                </View> */}
                                <View
                                    style={{
                                        paddingHorizontal: 12,
                                        flexDirection: "row",
                                        columnGap: theme.padding.lg,
                                        marginBottom: 12,
                                    }}
                                >
                                    {/* <ButtonHalfWidth
                                        buttonHeight={60}
                                        {...buttonTheme.black}
                                        onPress={() => uploadVideoFromCamera(drillIndex)}
                                    >
                                        <Camera
                                            color="white"
                                            size={18}
                                        />
                                        <ThemedText
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                letterSpacing: letterSpacing.lg,
                                                color: "white",
                                                textAlign: "center"
                                            }}
                                        >
                                            Record Video
                                        </ThemedText>
                                    </ButtonHalfWidth> */}
                                    {/* <ButtonHalfWidth
                                        {...buttonTheme.black}
                                        buttonHeight={60}
                                        onPress={() => uploadVideoFromLibrary(drillIndex)}
                                    >
                                        <FolderOpen
                                            color="white"
                                            size={18}
                                        />
                                        <ThemedText
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                letterSpacing: letterSpacing.lg,
                                                color: "white",
                                                textAlign: "center"
                                            }}
                                        >
                                            Upload Video
                                        </ThemedText>
                                    </ButtonHalfWidth> */}
                                </View>
                                {/* {!submission.submitted_drills[drillIndex].videoURL &&
                                    <Pressable
                                        onPress={() => uploadVideoFromLibrary(drillIndex)}
                                        style={{ 
                                            width: "auto", 
                                            height: 180,
                                            marginBottom: 12,
                                            marginHorizontal: 12,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderWidth: 1,
                                            borderColor: colors.schemes.light.outlineVariant,
                                            borderStyle: "dashed",
                                            borderRadius: 12,
                                            backgroundColor: colors.schemes.light.surfaceContainerHigh
                                        }}
                                    >
                                        <ThemedText
                                            style={{
                                                fontSize: 32,
                                                marginBottom: 8
                                            }}
                                        >
                                            🎥
                                        </ThemedText>
                                        <ThemedText
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 500,
                                                marginBottom: 2,
                                                letterSpacing: 0.1,
                                                textAlign: "center",
                                                color: colors.schemes.light.onSurfaceVariant
                                            }}
                                        >
                                            MP4, MOV
                                        </ThemedText>
                                        <ThemedText
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 500,
                                                letterSpacing: 0.1,
                                                textAlign: "center",
                                                color: colors.schemes.light.onSurfaceVariant,
                                                opacity: 0.5
                                            }}
                                        >
                                            Max 500MB
                                        </ThemedText>
                                    </Pressable>
                                } */}
                                {!!submission.submitted_drills[drillIndex].videoURL &&
                                    <VideoView 
                                        player={subDrillPlayer}
                                        style={{ 
                                            width: "auto", 
                                            height: 180,
                                            marginBottom: 12,
                                            marginHorizontal: 12,
                                            borderRadius: 12,
                                            backgroundColor: theme.colors.palettes.neutral[0]
                                        }}
                                        contentFit="cover"
                                    />
                                }
                                <View
                                    style={{
                                        paddingVertical: 10,
                                        marginHorizontal: 12,
                                        flexDirection: 'row',
                                        flexShrink: 1,
                                    }}
                                >
                                    <View
                                        style={{
                                            height: '100%',
                                            padding: theme.padding.md,
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
                                                fontWeight: 500,
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
                                            borderTopLeftRadius: 0,
                                            borderBottomLeftRadius: 0,

                                        }}
                                    />
                                </View>
                                <View
                                    style={{
                                        marginHorizontal: 12,
                                        marginBottom: 12
                                    }}
                                >
                                    {/* <Button
                                        {...((!!submissions[drillIndex]?.uri) ? buttonTheme.black : buttonTheme.disabled)}
                                        onPress={() => {
                                            if (!submissions[drillIndex]?.uri)
                                                return;
                                            analyzeVideoSubmission(submissions, session.drills, drillIndex);
                                        }}
                                        outerStyle={{
                                            alignSelf: undefined,
                                            borderBottomLeftRadius: !submissions[drillIndex]?.analysis ? 10 : 0,
                                            borderBottomRightRadius: !submissions[drillIndex]?.analysis ? 10 : 0
                                        }}
                                        innerStyle={{
                                            flex: 1,
                                            columnGap: 6
                                        }}
                                    >
                                        <Sparkle
                                            color={"white"}
                                            size={18}
                                            opacity={(!!submissions[drillIndex]?.uri) ? 1: 0.75}
                                        />
                                        <ThemedText
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                letterSpacing: letterSpacing.lg,
                                                color: "white",
                                                textAlign: "center",
                                                opacity: (!!submissions[drillIndex]?.uri) ? 1: 0.75
                                            }}
                                        >
                                            Analyze Video
                                        </ThemedText>
                                    </Button> */}
                                    {/* {submissions[drillIndex]?.analysis &&
                                        <View
                                            style={{
                                                borderWidth: 1,
                                                borderColor: colors.schemes.light.outlineVariant,
                                                borderBottomLeftRadius: 10,
                                                borderBottomRightRadius: 10,
                                                ...shadow.sm
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    columnGap: 6,
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 12,
                                                    borderBottomWidth: 1,
                                                    borderColor: colors.schemes.light.outlineVariant,
                                                    borderStyle: "dashed",
                                                    backgroundColor: colors.schemes.light.surfaceContainerHigh
                                                }}
                                            >
                                                <NotepadText
                                                    size={18}
                                                />
                                                <ThemedText
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        letterSpacing: letterSpacing.lg,
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    Video Analysis Results
                                                </ThemedText>
                                            </View>
                                            <View
                                                style={{
                                                    padding: 12,
                                                    paddingVertical: 16,
                                                    rowGap: 12,
                                                    backgroundColor: colors.schemes.light.surfaceBright,
                                                    borderBottomRightRadius: 10,
                                                    borderBottomLeftRadius: 10,
                                                }}
                                            >
                                                <View>
                                                    <ThemedText
                                                        style={{
                                                            marginBottom: 2,
                                                            fontSize: 14,
                                                            fontWeight: 600,
                                                            letterSpacing: 0.25,
                                                        }}
                                                    >
                                                        1. Statistics
                                                    </ThemedText>
                                                    <View
                                                        style={{
                                                            flexDirection: "row",
                                                            columnGap: 4,
                                                            marginLeft: 12,
                                                            paddingLeft: 12,
                                                            borderLeftWidth: 1,
                                                            borderColor: colors.schemes.light.outlineVariant
                                                        }}
                                                    >
                                                        <ThemedText
                                                            style={{
                                                                fontSize: 14,
                                                                fontWeight: 500,
                                                                letterSpacing: 0.25,
                                                                color: colors.schemes.light.onSurface
                                                            }}
                                                        >
                                                            1.1 Number Touches
                                                        </ThemedText>
                                                        <ThemedText
                                                            style={{
                                                                fontSize: 14,
                                                                fontWeight: 400,
                                                                letterSpacing: 0.25,
                                                                color: colors.schemes.light.onSurfaceVariant
                                                            }}
                                                        >
                                                            {submissions[drillIndex]?.analysis.numTouches}
                                                        </ThemedText>
                                                    </View>
                                                </View>
                                                <View>
                                                    <ThemedText
                                                        style={{
                                                            marginBottom: 4,
                                                            fontSize: 14,
                                                            fontWeight: 600,
                                                            letterSpacing: 0.25,
                                                        }}
                                                    >
                                                        2. Mistakes
                                                    </ThemedText>
                                                    <View
                                                        style={{
                                                            rowGap: 4,
                                                            marginLeft: 12,
                                                            paddingLeft: 12,
                                                            borderLeftWidth: 1,
                                                            borderColor: colors.schemes.light.outlineVariant
                                                        }}
                                                    >
                                                        {submissions[drillIndex]?.analysis.mistakes.map((mistake, i) => (
                                                            <View
                                                                key={i}
                                                                style={{
                                                                    flexDirection: "row",
                                                                    columnGap: 4
                                                                }}
                                                            >
                                                                <ThemedText
                                                                    style={{
                                                                        fontSize: 14,
                                                                        fontWeight: 400,
                                                                        letterSpacing: 0.25,
                                                                        color: colors.schemes.light.onSurfaceVariant
                                                                    }}
                                                                >
                                                                    <ThemedText
                                                                        style={{
                                                                            fontWeight: 500,
                                                                            color: colors.schemes.light.onSurface
                                                                        }}
                                                                    >
                                                                        2.{i+1}. {mistake.mistakeType}{' '}
                                                                    </ThemedText>
                                                                    {mistake.mistakeDesc}
                                                                </ThemedText>
                                                            </View>
                                                        ))}
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    } */}
                                </View>
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginHorizontal: 12,
                                        marginBottom: 36,
                                        columnGap: 12
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