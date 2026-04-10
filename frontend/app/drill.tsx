import ButtonBack from "@/components/ui/button/ButtonBack";
import ThemedText from "@/components/ui/ThemedText";
import { Drillv2, getDrills } from "@/services/drills";
import { padding, theme } from "@/theme";
import { Asset } from "expo-asset";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import { Bookmark } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";


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

export default function ShowDrills() {
  const insets = useSafeAreaInsets();
  const [drills, setDrills] = useState<Drillv2[]>([]);

  useEffect(() => {
    loadDrills();
  }, []);

  const loadDrills = async () => {
    try {
      const allDrills = await getDrills();
      // console.log("Fetched drills:", allDrills);
      setDrills(allDrills);
    } catch (err) {
      console.error("Failed to load drills:", err);
    }
  };

  const resolveURL = async (url: string) => {
    try {
      if (url.startsWith("@")) {
        const resolved = await Asset.loadAsync(localVideos[url]);
        return resolved[0].localUri;
      }
      return url;
    } catch (err) {
      console.warn("Failed to resolve video URL, using placeholder", url, err);
      return null;
    }
  };

  const renderDrill = ({ item }: { item: Drillv2 }) => {
    const drillPlayer = useVideoPlayer(null, (player) => {
      player.muted = true;
      player.audioMixingMode = "mixWithOthers";
      player.loop = true;
    });

    useEffect(() => {
      (async () => {
        if (!item.videoURL) return;
        try {
          const videoUri = await resolveURL(item.videoURL);
          if (videoUri) {
            drillPlayer.replaceAsync(videoUri);
            drillPlayer.play();
          }
        } catch (err) {
          console.warn("Video failed, showing placeholder", err);
        }
      })();
    }, [item.videoURL]);

    return (
      <View
        style={{
          marginVertical: padding.sm,
          backgroundColor: theme.colors.schemes.light.surface,
          borderRadius: 12,
          overflow: "hidden",
          ...theme.shadow.md,
        }}
      >
        <VideoView
          player={drillPlayer}
          style={{
            width: "100%",
            height: 200,
            backgroundColor: "#ccc",
          }}
          contentFit="cover"
        />
        {/*
        <View style={{ padding: padding.md }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: padding.sm,
            }}
          >
            <ThemedText style={{ fontSize: 18, fontWeight: "600" }}>{item.name}</ThemedText>
            <Bookmark
              size={24}
              stroke={
                item.bookmarked
                  ? theme.colors.coreColors.primary
                  : theme.colors.schemes.light.onSurfaceVariant
              }
              fill={item.bookmarked ? theme.colors.coreColors.primary : "transparent"}
            />
          </View>
          <ThemedText
            style={{
              fontSize: 12,
              color: theme.colors.schemes.light.onSurfaceVariant,
            }}
          >
            {item.type.toUpperCase()} • {item.time} min • {item.level}
          </ThemedText>
          <ThemedText style={{ marginTop: padding.sm, fontSize: 14 }}>
            {item.instructions}
          </ThemedText>
        </View>*/}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.schemes.light.background }}>
      <StatusBar style="light" />
      <BlurView
        intensity={50}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          paddingTop: insets.top,
          paddingVertical: theme.padding.xl,
          paddingHorizontal: theme.padding.md,
          zIndex: 100,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#ffffff75",
        }}
      >
        <ButtonBack onBack={() => router.back()} />
      </BlurView>

      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, marginTop: 80 }}>
        <FlatList
          data={drills}
          renderItem={renderDrill}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: padding.md }}
        />
      </SafeAreaView>
    </View>
  );
}