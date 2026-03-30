import ButtonBack from "@/components/ui/button/ButtonBack";
import ThemedText from "@/components/ui/ThemedText";
import { Drill, getDrill } from "@/services/drills";
import { padding, theme } from "@/theme";
import { Asset } from "expo-asset";
import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import { Bookmark } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// const localVideos = {
//     "@/assets/videos/video.mp4": require("@/assets/videos/video.mp4"),
//     "@/assets/videos/video2.mp4": require("@/assets/videos/video2.mp4"),
//     "@/assets/videos/video3.mp4": require("@/assets/videos/video3.mp4"),
//     "@/assets/videos/video4.mp4": require("@/assets/videos/video4.mp4"),
//     "@/assets/videos/video5.mp4": require("@/assets/videos/video5.mp4"),
//     "@/assets/videos/video6.mp4": require("@/assets/videos/video6.mp4"),
//     "@/assets/videos/video7.mp4": require("@/assets/videos/video7.mp4"),
//     "@/assets/videos/video8.mp4": require("@/assets/videos/video8.mp4"),
//     "@/assets/videos/video9.mp4": require("@/assets/videos/video9.mp4"),
//     "@/assets/videos/video10.mp4": require("@/assets/videos/video10.mp4"),
// };

export default function ShowDrill() {
    const { id } = useLocalSearchParams();


    // Used for Blur Effect
    const insets = useSafeAreaInsets();
    const [drill, setDrill] = useState<Drill>();
    const drillPlayer = useVideoPlayer(null, (player) => {
        player.muted = true;
        player.audioMixingMode = "mixWithOthers";
        player.loop = true;
    });


    useEffect(() => {
        loadDrill();
    }, []);


    useEffect(() => {
        if (!drill)
            return;
        loadVideo(drill.url);
    }, [drill]);


    const loadDrill = async () => {
        setDrill(await getDrill(Number(id)));
    }


    const loadVideo = async (url: string) => {
        const resolvedURL = await resolveURL(url);
        drillPlayer.replaceAsync(resolvedURL);
        drillPlayer.play();
    }

    
    const resolveURL = async (url: string) => {
        // if (!!url && url.charAt(0) === "@") {
        //     const resolvedURL = await Asset.loadAsync((localVideos as any)[url]);
        //     return resolvedURL[0].localUri;
        // }
        return url;
    }


    return (
        <View
            style={{
                flex: 1,
                position: "relative",
                backgroundColor: "blue"
            }}
        >
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
            <VideoView 
                player={drillPlayer}
                style={{ 
                    width: Dimensions.get("screen").width * 1, 
                    height: Dimensions.get("screen").height * 0.5,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    backgroundColor: theme.colors.palettes.neutral[0]
                }}
                contentFit="cover"
            />
            <View
                style={{
                    width: "100%", 
                    height: Dimensions.get("screen").height * 0.5,
                    maxHeight: Dimensions.get("screen").height * 0.5,
                    position: "absolute",
                    top: Dimensions.get("screen").height * 0.5 + 0,
                    left: 0,
                    flex: 1,
                    backgroundColor: theme.colors.schemes.light.surface,
                    ...theme.shadow.lg
                }}
            >
                <View
                    style={{
                        backgroundColor: theme.colors.schemes.light.background
                    }}
                >
                    {drill &&
                        <>
                            <View>
                                <View
                                    style={{
                                        marginBottom: theme.margin.sm,
                                        display: "flex",
                                        flexDirection: "row",
                                        borderBottomWidth: 1,
                                        borderStyle: "dashed",
                                        borderColor: theme.colors.schemes.light.outlineVariant,
                                    }}
                                >
                                    {[drill.drillType, `${drill.time} min`, drill.difficultyLevel].map((tag, i) => (
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
                                <ThemedText
                                    style={{
                                        paddingHorizontal: theme.margin.sm,
                                        paddingBottom: theme.padding.xs,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        letterSpacing: theme.letterSpacing.xl,
                                        color: theme.colors.schemes.light.onSurfaceVariant
                                    }}
                                >
                                    {(`${drill.coach.first_name} ${drill.coach.last_name}` || "").toUpperCase()}
                                </ThemedText>
                                <View
                                    style={{
                                        paddingHorizontal: theme.margin.sm,
                                        paddingBottom: theme.padding.sm,
                                        flexDirection: "row",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        columnGap: 48
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            flexShrink: 1,
                                            fontSize: 20,
                                            fontWeight: 600,
                                            letterSpacing: theme.letterSpacing.sm,
                                            marginBottom: 2
                                        }}
                                    >
                                        {drill.drillName}
                                    </ThemedText>
                                    <Bookmark
                                        size={20}
                                        stroke={drill.bookmarked ? theme.colors.coreColors.primary : theme.colors.schemes.light.onSurfaceVariant}
                                        fill={drill.bookmarked ? theme.colors.coreColors.primary : "transparent"}
                                    />
                                </View>
                                <ThemedText
                                    style={{
                                        paddingHorizontal: theme.margin.sm,
                                        marginBottom: theme.margin.sm,
                                        fontSize: theme.fontSize.base,
                                        lineHeight: 22,
                                        letterSpacing: theme.letterSpacing.xl * 2,
                                        color: theme.colors.schemes.light.onSurfaceVariant
                                    }}
                                >
                                    {drill.instructions}
                                </ThemedText>
                            </View>
                        </>
                    }
                </View>
            </View>
        </View>
    )
}