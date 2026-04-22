import ThemedText from "@/components/ui/ThemedText";
import { Drillv2 as Drill } from "@/services/drills";
import { padding, theme } from "@/theme";
import { Asset } from "expo-asset";
import { useVideoPlayer, VideoView } from "expo-video";
import { Bookmark } from "lucide-react-native";
import { Fragment, useEffect } from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import Tag from "../drills/Tag";
import { Session } from "@/services/sessions";

interface WorkoutCardListProps extends Session {
    onBookmark?: () => void;
}

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

export default function WorkoutCardList(props: WorkoutCardListProps) {
    // const videoPlayer = useVideoPlayer(null, (player) => {
    //     player.muted = true;
    //     player.audioMixingMode = "mixWithOthers";
    // });

    // useEffect(() => {
    //     loadVideo(props.videoURL);
    // }, []);
    
    // const loadVideo = async (url: string) => {
    //     const resolvedURL = await resolveURL(url);
    //     videoPlayer.replaceAsync(resolvedURL);
    // }

    //  const resolveURL = async (url: string) => {
    //     if (!!url && url.charAt(0) === "@") {
    //         const resolvedURL = await Asset.loadAsync((localVideos as any)[url]);
    //         return resolvedURL[0].localUri;
    //     }
    //     return url;
    // }

    return (
        <View
            style={{
                height: 150,
                padding: padding.md,
                flex: 1,
                flexDirection: "row",
                columnGap: padding.md,
                borderRadius: theme.borderRadius.base,
                borderWidth: 1,
                borderColor: theme.colors.schemes.light.outlineVariant,
                backgroundColor: "white",
                ...theme.shadow.sm
            }}
        >
            <View
                style={{
                    height: "100%",
                    aspectRatio: 1,
                    borderRadius: theme.borderRadius.sm,
                    backgroundColor: props.imageBackgroundColor,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ThemedText style={{ fontSize: 18, color: 'white', fontWeight: 500 }}>
                    {(props.imageText || '')}
                </ThemedText>
            </View>
            <Pressable
                onPress={() => router.push(`/workouts/${props.id}`)}
                style={{
                    flex: 1, 
                    paddingVertical: padding.sm,
                    paddingHorizontal: padding.sm,
                    rowGap: padding.sm
                }}
            >
                <ThemedText
                    style={{
                        fontSize: theme.fontSize.md,
                        letterSpacing: theme.letterSpacing.xl,
                        color: theme.colors.schemes.light.onSurfaceVariant
                    }}
                >
                    {props.uploadedBy}
                </ThemedText>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        columnGap: theme.spacing.md
                    }}
                >
                    <ThemedText
                        style={{
                            flexShrink: 1,
                            fontSize: theme.fontSize.base,
                            fontWeight: 500,
                            letterSpacing: theme.letterSpacing.xl,
                            color: theme.colors.schemes.light.onSurface
                        }}
                    >
                        {props.name}
                    </ThemedText>
                    <Bookmark
                        size={18}
                        stroke={props.bookmarked ? theme.colors.coreColors.primary : theme.colors.schemes.light.onSurfaceVariant}
                        fill={props.bookmarked ? theme.colors.coreColors.primary : "transparent"}
                    />
                </View>
                {/* <ThemedText
                    numberLines={4}
                    style={{
                        maxHeight: 50,
                        // flex: 1,
                        // width: 100,
                        fontSize: theme.fontSize.md,
                        fontWeight: 400,
                        letterSpacing: theme.letterSpacing.xl,
                        color: theme.colors.schemes.light.onSurfaceVariant
                    }}
                >
                    {props.instructions}
                </ThemedText> */}
                {/* <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        rowGap: padding.md,
                        columnGap: padding.md,
                    }}
                >
                    {[props.time, props.level].map((tag, i) => (
                        <Fragment
                            key={i}
                        >
                            <Tag
                                label={tag}
                            />
                        </Fragment>
                    ))}
                </View> */}
            </Pressable>
        </View>
    )
}