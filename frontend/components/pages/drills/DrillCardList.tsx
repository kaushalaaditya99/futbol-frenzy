import ThemedText from "@/components/ui/ThemedText";
import { Drill } from "@/services/drills";
import { padding, theme } from "@/theme";
import { Asset } from "expo-asset";
import { useVideoPlayer, VideoView } from "expo-video";
import { Bookmark } from "lucide-react-native";
import { Fragment, useEffect } from "react";
import { Pressable, View } from "react-native";
import Tag from "./Tag";
import { router } from "expo-router";

interface DrillCardListProps extends Drill {
    onBookmark?: () => void;
}

const localVideos = {
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

export default function DrillCardList(props: DrillCardListProps) {
    const videoPlayer = useVideoPlayer(null, (player) => {
        player.muted = true;
        player.audioMixingMode = "mixWithOthers";
        player.pause();
    });

    useEffect(() => {
        if (props.url) {
            loadVideo(props.url);
        }
    }, [props.url]);

    const loadVideo = async (url: string) => {
        const resolvedURL = await resolveURL(url);
        if (resolvedURL) {
            await videoPlayer.replaceAsync(resolvedURL);
            videoPlayer.currentTime = 0;
            videoPlayer.pause();
        }
    }

     const resolveURL = async (url: string) => {
        if (!!url && url.charAt(0) === "@") {
            const resolvedURL = await Asset.loadAsync((localVideos as any)[url]);
            return resolvedURL[0].localUri;
        }
        return url;
    }

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
            <VideoView
                player={videoPlayer}
                style={{
                    height: "100%",
                    aspectRatio: 1,
                    backgroundColor: "lightgray",
                    borderRadius: theme.borderRadius.sm,
                }}
                contentFit="cover"
            />
            <Pressable
                onPress={() => router.push({
                    pathname: "/drills/[id]",
                    params: {
                        id: props.id
                    }
                })}
                style={{
                    flex: 1,
                    paddingVertical: padding.sm,
                    paddingHorizontal: padding.sm,
                    rowGap: padding.sm
                }}
            >
                <ThemedText
                    style={{
                        fontSize: theme.fontSize.sm,
                        letterSpacing: theme.letterSpacing.xl,
                        color: theme.colors.schemes.light.onSurfaceVariant
                    }}
                >
                    {props.coach.first_name} {}
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
                            fontSize: theme.fontSize.md,
                            fontWeight: 500,
                            letterSpacing: theme.letterSpacing.xl,
                            color: theme.colors.schemes.light.onSurface
                        }}
                    >
                        {props.drillName}
                    </ThemedText>
                    <Bookmark
                        size={16}
                        stroke={props.bookmarked ? theme.colors.coreColors.primary : theme.colors.schemes.light.onSurfaceVariant}
                        fill={props.bookmarked ? theme.colors.coreColors.primary : "transparent"}
                    />
                </View>
                <ThemedText
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
                </ThemedText>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        rowGap: padding.md,
                        columnGap: padding.md,
                    }}
                >
                    {[props.time, props.difficultyLevel].map((tag, i) => (
                        <Fragment
                            key={i}
                        >
                            <Tag
                                label={tag}
                            />
                        </Fragment>
                    ))}
                </View>
            </Pressable>
        </View>
    )
}
