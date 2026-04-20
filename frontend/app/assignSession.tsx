import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { getSessions, Session } from "@/services/sessions";
import { borderRadius, colors, fontSize, letterSpacing, margin, padding, shadow } from "@/theme";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
                        {session.drills?.length || 0} drill{(session.drills?.length || 0) !== 1 ? "s" : ""}
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
    const { date, classId } = useLocalSearchParams<{ date?: string; classId?: string }>();

    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        setIsLoading(true);
        // Fetch ALL workouts (not filtered by date)
        getSessions(token)
            .then((all) => {
                setSessions(all);
            })
            .catch((err) => {
                console.error("Failed to load workouts:", err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [token]);

    const handleSelectSession = (sessionId: number) => {
        // Navigate to assignStudents with the workout ID and date
        router.push({
            pathname: "/assignStudents",
            params: {
                sessionId: String(sessionId),
                date: date || new Date().toISOString(),
                classId: classId || "",
            },
        });
    };

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
                        Select Workout
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontSize: fontSize.sm,
                            color: colors.schemes.light.onSurfaceVariant,
                            letterSpacing: letterSpacing.xl,
                        }}
                    >
                        Choose a workout to assign to your class
                    </ThemedText>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: margin["3xs"],
                    rowGap: 10,
                }}
            >
                {isLoading ? (
                    <View style={{ alignItems: "center", paddingTop: 60 }}>
                        <ActivityIndicator size="large" color={colors.coreColors.primary} />
                        <ThemedText style={{ marginTop: 12, color: colors.schemes.light.onSurfaceVariant }}>
                            Loading workouts...
                        </ThemedText>
                    </View>
                ) : sessions.length === 0 ? (
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
                            No workouts available.
                        </ThemedText>
                        <ThemedText
                            style={{
                                fontSize: fontSize.sm,
                                color: colors.schemes.light.outlineVariant,
                            }}
                        >
                            Create a workout first in the Workouts tab.
                        </ThemedText>
                    </View>
                ) : (
                    sessions.map((session) => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            onPress={() => handleSelectSession(session.id)}
                        />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}