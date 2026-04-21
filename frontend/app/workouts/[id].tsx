import AssignWorkout from "@/components/pages/workouts/AssignWorkout";
import BottomScreen from "@/components/ui/BottomScreen";
import Button from "@/components/ui/button/Button";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import InlineButton from "@/components/ui/button/InlineButton";
import HeaderWithBack from "@/components/ui/HeaderWithBack";
import InputCheckbox from "@/components/ui/input/InputCheckbox";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { Class, getClasses } from "@/services/classes";
import { getSession, Session } from "@/services/sessions";
import { padding, shadow, theme } from "@/theme";
import { Asset } from "expo-asset";
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { BookmarkIcon, CalendarIcon, PlusCircle, PlusCircleIcon } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const localVideos: Record<string, any> = {
  "@/assets/videos/video.mp4": require("@/assets/videos/video.mp4"),
  "@/assets/videos/video2.mp4": require("@/assets/videos/video2.mp4"),
  "@/assets/videos/video3.mp4": require("@/assets/videos/video3.mp4"),
  "@/assets/videos/video4.mp4": require("@/assets/videos/video4.mp4"),
  "@/assets/videos/video5.mp4": require("@/assets/videos/video5.mp4"),
  "@/assets/videos/video6.mp4": require("@/assets/videos/video6.mp4"),
  "@/assets/videos/video7.mp4": require("@/assets/videos/video7.mp4"),
  "@/assets/videos/video8.mp4": require("@/assets/videos/video8.mp4"),
  "@/assets/videos/video9.mp4": require("@/assets/videos/video9.mp4"),
  "@/assets/videos/video10.mp4": require("@/assets/videos/video10.mp4"),
};

// Sorry for the bad, messy, and uncommented code.
// I am rushing

export default function Workout() {
    const { token } = useAuth();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [classes, setClasses] = useState<Array<Class>>([]);
    const [workout, setWorkout] = useState<Session>();
    const [drillIndex, setDrillIndex] = useState(0);
    const [showAssignWorkout, setShowAssignWorkout] = useState(false);
    const [videoError, setVideoError] = useState<string | null>(null);
    const isLoadingVideo = useRef(false);
    const currentDrillUrl = useRef<string | null>(null);

    const drillPlayer = useVideoPlayer(null, (player) => {
        player.muted = true;
        player.audioMixingMode = "mixWithOthers";
        player.loop = true;
    });

    const resolveURL = async (url: string) => {
        if (url?.startsWith("@")) {
            const resolved = await Asset.loadAsync(localVideos[url]);
            return resolved[0].localUri;
        }
        return url;
    };

    useEffect(() => {
        if (token && id) {
            loadWorkout();
            loadClasses();
        }
    }, [token, id]);

    // Update video when drill changes
    useEffect(() => {
        (async () => {
            const drill = workout?.drills?.[drillIndex];
            const url = drill?.url;

            // Skip if no URL
            if (!url || url === "") {
                currentDrillUrl.current = null;
                return;
            }

            // Skip if we're already loading this exact video
            if (currentDrillUrl.current === url) {
                return;
            }

            // Skip if we're currently loading another video
            if (isLoadingVideo.current) {
                return;
            }

            isLoadingVideo.current = true;
            currentDrillUrl.current = url;
            setVideoError(null);

            try {
                const videoUri = await resolveURL(url);
                await drillPlayer.replaceAsync(videoUri);
                drillPlayer.play();
            } catch (err) {
                console.warn("Failed to load video", err);
                setVideoError("Failed to load video");
                currentDrillUrl.current = null;
            } finally {
                isLoadingVideo.current = false;
            }
        })();
    }, [drillIndex, workout?.drills]);

    const loadWorkout = async () => {
        if (!token || !id) return;

        const workoutId = parseInt(id);
        const workoutData = await getSession(token, workoutId);
        if (!workoutData) return;

        setVideoError(null);
        setWorkout(workoutData);
    }

    const loadClasses = async () => {
        if (!token)
            return;

        const classes = await getClasses(token);
        setClasses(classes);
    }

    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: theme.colors.schemes.light.surface,
            }}
        >
            {showAssignWorkout &&
                <AssignWorkout
                    classes={classes}
                    onClose={() => setShowAssignWorkout(false)}
                />
            }
            <HeaderWithBack
                header="Workout"
                onBack={() => router.back()}
                containerStyle={{
                    paddingVertical: theme.margin.xs,
                    paddingHorizontal: theme.margin.sm,
                }}
                buttonStyle={{
                    backgroundColor: "#00000010"
                }}
            />
            <View
                style={{
                    padding: theme.margin.sm,
                    rowGap: theme.padding.md,
                    borderBottomWidth: 1,
                    borderColor: theme.colors.schemes.light.outlineVariant,
                    backgroundColor: "white"
                }}
            >
                <View
                    style={{
                        rowGap: theme.padding.xs
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: 14,
                            fontWeight: 500,
                            letterSpacing: theme.letterSpacing.xl,
                            color: theme.colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        {`${workout?.coach.first_name} ${workout?.coach.last_name}`.toUpperCase()}
                    </ThemedText>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <ThemedText
                            style={{
                                flexShrink: 1,
                                fontSize: 20,
                                fontWeight: 600,
                                letterSpacing: theme.letterSpacing.base,
                            }}
                        >
                            {workout?.name}
                        </ThemedText>
                        <View
                            style={{
                                flexDirection: "row",
                                columnGap: theme.padding.lg
                            }}
                        >
                            <PlusCircleIcon
                                size={20}
                                onPress={() => setShowAssignWorkout(true)}
                                stroke={theme.colors.coreColors.primary}
                            />
                            <BookmarkIcon
                                size={20}
                                stroke={theme.colors.coreColors.primary}
                                fill={workout?.bookmarked ? theme.colors.coreColors.primary : "transparent"}
                            />
                        </View>
                    </View>
                </View>
                <ThemedText
                    style={{
                        fontSize: theme.fontSize.base,
                        letterSpacing: theme.letterSpacing["2xl"],
                        lineHeight: 20,
                        color: theme.colors.schemes.light.onSurfaceVariant
                    }}
                >
                    {workout?.drills?.[0]?.instructions || "Select a drill to see its instructions."}
                </ThemedText>
            </View>
            <View
                style={{
                    padding: theme.margin.sm,
                    rowGap: theme.margin.sm,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    {[...Array(workout?.drills.length || 0)].map((e, i) => (
                        <Pressable
                            key={i}
                            onPress={() => setDrillIndex(i)}
                            style={{
                                width: 48,
                                aspectRatio: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: theme.borderRadius.md,
                                borderWidth: 1,
                                // borderStyle: "dashed",
                                borderColor: drillIndex === i ? theme.colors.coreColors.primary : theme.colors.schemes.light.outlineVariant,
                                backgroundColor: drillIndex === i ? theme.colors.coreColors.primary : "white",
                                ...(drillIndex === i ? {} : shadow.sm)
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: 16,
                                    fontWeight: 500,
                                    color: drillIndex === i ? "white" : theme.colors.schemes.light.onSurfaceVariant
                                }}
                            >
                                {i+1}
                            </ThemedText>
                        </Pressable>
                    ))}
                </View>
                <View
                    style={{
                        borderRadius: theme.borderRadius.base,
                        backgroundColor: "white",
                        ...theme.shadow.sm
                    }}
                >
                    {videoError ? (
                        <View
                            style={{
                                width: "100%",
                                aspectRatio: 2,
                                borderTopLeftRadius: theme.borderRadius.base,
                                borderTopRightRadius: theme.borderRadius.base,
                                backgroundColor: theme.colors.schemes.light.surfaceContainerHigh,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <ThemedText style={{ color: theme.colors.schemes.light.onSurfaceVariant }}>
                                {videoError}
                            </ThemedText>
                        </View>
                    ) : workout?.drills?.[drillIndex]?.url ? (
                        <VideoView
                            player={drillPlayer}
                            style={{
                                width: "100%",
                                aspectRatio: 2,
                                borderTopLeftRadius: theme.borderRadius.base,
                                borderTopRightRadius: theme.borderRadius.base,
                            }}
                            contentFit="cover"
                        />
                    ) : (
                        <View
                            style={{
                                width: "100%",
                                aspectRatio: 2,
                                borderTopLeftRadius: theme.borderRadius.base,
                                borderTopRightRadius: theme.borderRadius.base,
                                backgroundColor: theme.colors.schemes.light.surfaceContainerHigh,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <ThemedText style={{ color: theme.colors.schemes.light.onSurfaceVariant }}>
                                Loading video...
                            </ThemedText>
                        </View>
                    )}
                    <View
                        style={{
                            padding: 0,
                            // borderTopWidth: 0,
                            borderWidth: 1,
                            borderBottomLeftRadius: theme.borderRadius.base,
                            borderBottomRightRadius: theme.borderRadius.base,
                            borderColor: theme.colors.schemes.light.outlineVariant
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                            }}
                        >
                            {[workout?.drills[drillIndex].drillType, workout?.drills[drillIndex].difficultyLevel, workout?.drills[drillIndex].minutes ? `${workout?.drills[drillIndex].minutes} mins` : `${workout?.drills[drillIndex].repetitions} reps`].map((tag, i) => (
                                <View
                                    key={i}
                                    style={{
                                        paddingVertical: theme.padding.sm,
                                        flex: 1,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderLeftWidth: i !== 0 ? 1 : 0,
                                        borderBottomWidth: 1,
                                        borderColor: theme.colors.schemes.light.outlineVariant,
                                        backgroundColor: theme.colors.schemes.light.surfaceContainerHigh
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 500,
                                            letterSpacing: theme.letterSpacing.xl * 2,
                                            textAlign: "center",
                                            color: theme.colors.schemes.light.onSurfaceVariant
                                        }}
                                    >
                                        {tag?.toUpperCase()}
                                    </ThemedText>
                                </View>
                            ))}
                        </View>
                        <View
                            style={{
                                padding: theme.padding.lg
                            }}
                        >
                            <ThemedText
                                style={{
                                    marginBottom: theme.padding.sm,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    letterSpacing: theme.letterSpacing.xl,
                                    color: theme.colors.schemes.light.onSurfaceVariant
                                }}
                            >
                                {workout?.drills[drillIndex].coach.first_name} {workout?.drills[drillIndex].coach.last_name}
                            </ThemedText>
                            <ThemedText
                                style={{
                                    marginBottom: theme.padding.md,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    letterSpacing: theme.letterSpacing.xl
                                }}
                            >
                                {workout?.drills[drillIndex].drillName}
                            </ThemedText>
                            <ThemedText
                                style={{
                                    fontSize: 14,
                                    lineHeight: 20,
                                    letterSpacing: theme.letterSpacing.xl * 2,
                                    color: theme.colors.schemes.light.onSurfaceVariant
                                }}
                            >
                                {workout?.drills[drillIndex].instructions}
                            </ThemedText>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}