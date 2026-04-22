import HeaderWithBack from "@/components/ui/HeaderWithBack";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { bookmarkDrill } from "@/services/bookmarks";
import { Drill, getDrill } from "@/services/drills";
import { theme } from "@/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { Bookmark } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function ShowDrill() {
    const {token} = useAuth();
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
    }, [token]);


    useEffect(() => {
        if (!drill)
            return;
        console.log('here');
        loadVideo(drill.url);
    }, [drill]);


    const loadDrill = async () => {
        if (!token)
            return;
        console.log('hello')
        const drill = await getDrill(token, Number(id));
        console.log('goodbye')
        if (drill)
            setDrill(drill);
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
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: theme.colors.schemes.light.surface,
            }}
        >
            <HeaderWithBack
                header={drill ? drill.drillName : "Drill"}
                onBack={() => router.back()}
                containerStyle={{
                    paddingVertical: theme.margin.xs,
                    paddingHorizontal: theme.margin.sm,
                    borderBottomWidth: 0,
                }}
                buttonStyle={{
                    backgroundColor: "#00000010"
                }}
            />
            <VideoView 
                player={drillPlayer}
                style={{ 
                    width: Dimensions.get("screen").width * 1, 
                    height: Dimensions.get("screen").height * 0.5,
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
                                    {[drill.drillType, drill.difficultyLevel].map((tag, i) => (
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
                                        onPress={async () => {
                                            if (!drill || !token)
                                                return;
                                            const bookmarked = await bookmarkDrill(token, drill.id);
                                            setDrill(drill => ({
                                                ...drill,
                                                bookmarked
                                            }) as any)
                                        }}
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
        </SafeAreaView>
    )
}