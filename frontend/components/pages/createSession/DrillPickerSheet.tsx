import { Drillv2 } from "@/services/drills";
import { borderRadius, colors, fontSize, letterSpacing, padding, shadow, theme } from "@/theme";
import { Asset } from "expo-asset";
import { useVideoPlayer, VideoView } from "expo-video";
import { Check, Search, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    FlatList,
    Modal,
    Pressable,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import ThemedText from "@/components/ui/ThemedText";
import Tag from "@/components/pages/drills/Tag";

// ─── Drill Card Row ──────────────────────────────────────────────────────────

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

interface DrillPickerRowProps {
    drill: Drillv2;
    isSelected: boolean;
    onToggle: () => void;
}

function DrillPickerRow({ drill, isSelected, onToggle }: DrillPickerRowProps) {
    const videoPlayer = useVideoPlayer(null, (player) => {
        player.muted = true;
        player.audioMixingMode = "mixWithOthers";
    });

    useEffect(() => {
        const load = async () => {
            const url = drill.videoURL;
            if (url && url.charAt(0) === "@") {
                const resolved = await Asset.loadAsync(localVideos[url]);
                videoPlayer.replaceAsync(resolved[0].localUri as string);
            } else if (url) {
                videoPlayer.replaceAsync(url);
            }
        };
        load();
    }, []);

    return (
        <Pressable
            onPress={onToggle}
            style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: padding.md,
                paddingHorizontal: padding.lg,
                borderBottomWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                backgroundColor: isSelected
                    ? colors.schemes.light.primaryContainer + "40"
                    : "transparent",
                columnGap: padding.md,
            }}
        >
            {/* Video thumbnail */}
            <VideoView
                player={videoPlayer}
                style={{
                    width: 90,
                    height: 90,
                    borderRadius: theme.borderRadius.sm,
                    backgroundColor: colors.schemes.light.surfaceContainerHighest,
                }}
                contentFit="cover"
            />

            {/* Info */}
            <View
                style={{
                    flex: 1,
                    rowGap: padding.sm,
                    paddingVertical: padding.sm,
                }}
            >
                <ThemedText
                    style={{
                        fontSize: fontSize.sm,
                        letterSpacing: letterSpacing.xl,
                        color: colors.schemes.light.onSurfaceVariant,
                    }}
                >
                    {drill.uploadedByName}
                </ThemedText>
                <ThemedText
                    style={{
                        fontSize: fontSize.md,
                        fontWeight: 500,
                        letterSpacing: letterSpacing.xl,
                        color: colors.schemes.light.onSurface,
                    }}
                >
                    {drill.drillName}
                </ThemedText>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        columnGap: padding.md,
                        rowGap: padding.sm,
                    }}
                >
                    <Tag label={drill.time} />
                    <Tag label={drill.level} />
                </View>
            </View>

            {/* Checkbox */}
            <View
                style={{
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: isSelected
                        ? colors.coreColors.primary
                        : colors.schemes.light.outlineVariant,
                    backgroundColor: isSelected ? colors.coreColors.primary : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                {isSelected && <Check size={14} color="white" strokeWidth={3} />}
            </View>
        </Pressable>
    );
}

// ─── Sheet ───────────────────────────────────────────────────────────────────

interface DrillPickerSheetProps {
    visible: boolean;
    drills: Drillv2[];
    selectedDrillIds: Set<number>;
    onConfirm: (selectedIds: Set<number>) => void;
    onClose: () => void;
}

export default function DrillPickerSheet(props: DrillPickerSheetProps) {
    const [tab, setTab] = useState<"library" | "public">("library");
    const [search, setSearch] = useState("");
    const [localSelected, setLocalSelected] = useState<Set<number>>(new Set());
    const slideAnim = useRef(new Animated.Value(600)).current;

    useEffect(() => {
        if (props.visible) {
            setLocalSelected(new Set(props.selectedDrillIds));
            setSearch("");
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 80,
                friction: 10,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 600,
                duration: 220,
                useNativeDriver: true,
            }).start();
        }
    }, [props.visible]);

    const filteredDrills = props.drills.filter((drill) => {
        const matchesSearch = drill.drillName.toLowerCase().includes(search.toLowerCase());
        const matchesTab =
            tab === "library"
                ? drill.accessControl === "private"
                : drill.accessControl === "public";
        return matchesSearch && matchesTab;
    });

    const toggleDrill = (id: number) => {
        const next = new Set(localSelected);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setLocalSelected(next);
    };

    return (
        <Modal
            visible={props.visible}
            transparent
            animationType="none"
            onRequestClose={props.onClose}
        >
            <TouchableWithoutFeedback onPress={props.onClose}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        justifyContent: "flex-end",
                    }}
                />
            </TouchableWithoutFeedback>
            <Animated.View
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "82%",
                    backgroundColor: colors.schemes.light.background,
                    borderTopLeftRadius: borderRadius.xl,
                    borderTopRightRadius: borderRadius.xl,
                    transform: [{ translateY: slideAnim }],
                    overflow: "hidden",
                }}
            >
                {/* Handle */}
                <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 8 }}>
                    <View
                        style={{
                            width: 36,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: colors.schemes.light.outlineVariant,
                        }}
                    />
                </View>

                {/* Header */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: 20,
                        paddingBottom: 12,
                        borderBottomWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant,
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: fontSize.lg,
                            fontWeight: 600,
                            letterSpacing: letterSpacing.xs,
                            color: colors.schemes.light.onSurface,
                        }}
                    >
                        Add Drills
                    </ThemedText>
                    <Pressable onPress={props.onClose} hitSlop={8}>
                        <X size={22} color={colors.schemes.light.onSurfaceVariant} />
                    </Pressable>
                </View>

                {/* Tabs */}
                <View
                    style={{
                        flexDirection: "row",
                        borderBottomWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant,
                    }}
                >
                    {(["library", "public"] as const).map((t) => (
                        <Pressable
                            key={t}
                            onPress={() => setTab(t)}
                            style={{
                                flex: 1,
                                paddingVertical: 10,
                                alignItems: "center",
                                borderBottomWidth: 2,
                                borderBottomColor:
                                    tab === t ? colors.coreColors.primary : "transparent",
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: fontSize.md,
                                    fontWeight: 500,
                                    color:
                                        tab === t
                                            ? colors.coreColors.primary
                                            : colors.schemes.light.onSurfaceVariant,
                                }}
                            >
                                {t === "library" ? "My Library" : "Public Drills"}
                            </ThemedText>
                        </Pressable>
                    ))}
                </View>

                {/* Search */}
                <View
                    style={{
                        margin: 12,
                        flexDirection: "row",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant,
                        borderRadius: borderRadius.base,
                        backgroundColor: "white",
                        paddingHorizontal: 12,
                        ...shadow.sm,
                    }}
                >
                    <Search size={16} color={colors.schemes.light.onSurfaceVariant} />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search drills..."
                        placeholderTextColor={colors.schemes.light.onSurfaceVariant}
                        style={{
                            flex: 1,
                            paddingVertical: 8,
                            paddingHorizontal: 8,
                            fontSize: fontSize.md,
                            fontFamily: "Arimo-Regular",
                            color: colors.schemes.light.onBackground,
                        }}
                    />
                </View>

                {/* Drill List */}
                <FlatList
                    data={filteredDrills}
                    keyExtractor={(item) => String(item.id)}
                    style={{ flex: 1 }}
                    renderItem={({ item }) => (
                        <DrillPickerRow
                            drill={item}
                            isSelected={localSelected.has(item.id)}
                            onToggle={() => toggleDrill(item.id)}
                        />
                    )}
                />

                {/* Done Button */}
                <View
                    style={{
                        padding: 16,
                        borderTopWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant,
                        backgroundColor: colors.schemes.light.background,
                    }}
                >
                    <Pressable
                        onPress={() => props.onConfirm(localSelected)}
                        style={{
                            backgroundColor: colors.coreColors.primary,
                            borderRadius: borderRadius.base,
                            paddingVertical: 14,
                            alignItems: "center",
                        }}
                    >
                        <ThemedText
                            style={{
                                fontSize: fontSize.base,
                                fontWeight: 600,
                                color: "white",
                            }}
                        >
                            {localSelected.size > 0
                                ? `Done (${localSelected.size} selected)`
                                : "Done"}
                        </ThemedText>
                    </Pressable>
                </View>
            </Animated.View>
        </Modal>
    );
}
