import ThemedText from "@/components/ui/ThemedText";
import { Drill } from "@/services/drills";
import { borderRadius, letterSpacing, padding, theme } from "@/theme";
import { Asset } from "expo-asset";
import { useVideoPlayer, VideoView } from "expo-video";
import { Bookmark } from "lucide-react-native";
import { Fragment, useEffect, useState } from "react";
import { Dimensions, FlatListProps, Pressable, View } from "react-native";
import Tag from "./Tag";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { bookmarkDrill } from "@/services/bookmarks";

interface DrillCardGridProps extends Drill {
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

export default function DrillCardGrid(props: DrillCardGridProps) {
    const {token} = useAuth();
    const videoPlayer = useVideoPlayer(null, (player) => {
        player.muted = true;
        player.audioMixingMode = "mixWithOthers";
        player.pause();
    });

    const [bookmarked, setBookmarked] = useState(props.bookmarked);

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
                width: ((Dimensions.get("screen").width - 28) / 2),
                height: 200,
                padding: theme.padding.sm,
                borderWidth: 1,
                borderColor: theme.colors.schemes.light.outlineVariant,
                borderRadius: theme.borderRadius.base,
                backgroundColor: "white",
                ...theme.shadow.sm
            }}
        >
            <VideoView
                player={videoPlayer}
                style={{
                    width: "100%",
                    height: 100,
                    borderRadius: theme.borderRadius.sm,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    backgroundColor: "lightgray",
                }}
                contentFit="cover"
            />
            <Pressable
                onPress={() => router.push("/drill")}
                style={{
                    paddingVertical: padding.sm,
                    paddingHorizontal: padding.sm,
                    rowGap: padding.sm
                }}
            >
                <ThemedText
                    style={{
                        fontSize: theme.fontSize.sm,
                        letterSpacing: letterSpacing.xl,
                        color: theme.colors.schemes.light.onSurfaceVariant
                    }}
                >
                    {props.coach.first_name} {props.coach.last_name}
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
                            letterSpacing: letterSpacing.xl,
                            color: theme.colors.schemes.light.onSurface
                        }}
                    >
                        {props.drillName}
                    </ThemedText>
                    <Bookmark
                        size={16}
                        stroke={bookmarked ? theme.colors.coreColors.primary : theme.colors.schemes.light.onSurfaceVariant}
                        fill={bookmarked ? theme.colors.coreColors.primary : "transparent"}
                        onPress={async () => {
                            if (!token)
                                return;
                            const bookmarked = await bookmarkDrill(token, props.id);
                            setBookmarked(bookmarked || false);
                        }}
                    />
                </View>
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
