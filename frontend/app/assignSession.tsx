import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { getSessions, Session } from "@/services/sessions";
import { borderRadius, colors, fontSize, letterSpacing, margin, padding, shadow } from "@/theme";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function formatDateLabel(date: Date): string {
    const today = new Date();
    const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isTomorrow =
        date.getDate() === tomorrow.getDate() &&
        date.getMonth() === tomorrow.getMonth() &&
        date.getFullYear() === tomorrow.getFullYear();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";
    if (isYesterday) return "Yesterday";

    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

interface SessionCardProps {
    session: Session;
    onPress: () => void;
}

function SessionCard({ session, onPress }: SessionCardProps) {
    return (
        <Pressable
            onPress={onPress}
            style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: 12,
                backgroundColor: colors.schemes.light.surfaceContainerLowest,
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                borderRadius: borderRadius.base,
                padding: 12,
                ...shadow.md,
            }}
        >
            {/* Icon */}
            <View
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: borderRadius.base - 2,
                    backgroundColor: session.imageBackgroundColor || colors.palettes.neutral[90],
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <ThemedText style={{ fontSize: fontSize.lg }}>
                    {session.imageText}
                </ThemedText>
            </View>

            {/* Info */}
            <View style={{ flex: 1, rowGap: 2 }}>
                <ThemedText
                    style={{
                        fontSize: fontSize.md,
                        fontWeight: 500,
                        color: colors.schemes.light.onSurface,
                    }}
                >
                    {session.name}
                </ThemedText>
                <View style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}>
                    <ThemedText
                        style={{
                            fontSize: fontSize.sm,
                            letterSpacing: letterSpacing.xl,
                            color: colors.schemes.light.onSurfaceVariant,
                        }}
                    >
                        {session.type}
                    </ThemedText>
                    <View
                        style={{
                            width: 3,
                            height: 3,
                            borderRadius: 100,
                            backgroundColor: colors.schemes.light.onSurfaceVariant,
                        }}
                    />
                    <ThemedText
                        style={{
                            fontSize: fontSize.sm,
                            letterSpacing: letterSpacing.xl,
                            color: colors.schemes.light.onSurfaceVariant,
                        }}
                    >
                        {session.durationInMins} min
                    </ThemedText>
                    <View
                        style={{
                            width: 3,
                            height: 3,
                            borderRadius: 100,
                            backgroundColor: colors.schemes.light.onSurfaceVariant,
                        }}
                    />
                    <ThemedText
                        style={{
                            fontSize: fontSize.sm,
                            letterSpacing: letterSpacing.xl,
                            color: colors.schemes.light.onSurfaceVariant,
                        }}
                    >
                        {session.drills.length} drill{session.drills.length !== 1 ? "s" : ""}
                    </ThemedText>
                </View>
            </View>

            <ChevronLeft
                size={18}
                color={colors.schemes.light.onSurfaceVariant}
                style={{ transform: [{ rotate: "180deg" }] }}
            />
        </Pressable>
    );
}

export default function AssignSession() {
    const { token } = useAuth();
    const { date } = useLocalSearchParams<{ date: string }>();
    const selectedDate = date ? new Date(date) : new Date();

    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        if (!token) return;
        getSessions(token).then((all) => {
            const filtered = all.filter((s) => {
                return (
                    s.date.getFullYear() === selectedDate.getFullYear() &&
                    s.date.getMonth() === selectedDate.getMonth() &&
                    s.date.getDate() === selectedDate.getDate()
                );
            });
            setSessions(filtered);
        });
    }, []);

    const dateLabel = formatDateLabel(selectedDate);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.schemes.light.background }}>
            {/* Header */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant,
                    backgroundColor: colors.schemes.light.background,
                }}
            >
                <Pressable onPress={() => router.back()} hitSlop={8} style={{ marginRight: 8 }}>
                    <ChevronLeft size={24} color={colors.schemes.light.onSurface} />
                </Pressable>
                <View style={{ flex: 1 }}>
                    <ThemedText
                        style={{
                            fontSize: fontSize.lg,
                            fontWeight: 600,
                            letterSpacing: letterSpacing.xs,
                            color: colors.schemes.light.onSurface,
                        }}
                    >
                        Assign Session
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontSize: fontSize.sm,
                            color: colors.schemes.light.onSurfaceVariant,
                            letterSpacing: letterSpacing.xl,
                        }}
                    >
                        {dateLabel}
                    </ThemedText>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: margin["3xs"],
                    rowGap: 10,
                }}
            >
                {sessions.length === 0 ? (
                    <View
                        style={{
                            alignItems: "center",
                            paddingTop: 60,
                            rowGap: 8,
                        }}
                    >
                        <ThemedText
                            style={{
                                fontSize: fontSize.base,
                                color: colors.schemes.light.onSurfaceVariant,
                            }}
                        >
                            No sessions on this date.
                        </ThemedText>
                    </View>
                ) : (
                    sessions.map((session) => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            onPress={() =>
                                router.push({
                                    pathname: "/assignStudents",
                                    params: { sessionId: String(session.id) },
                                })
                            }
                        />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
