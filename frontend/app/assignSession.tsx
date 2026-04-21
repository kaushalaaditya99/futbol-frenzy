import HeaderWithBack from "@/components/ui/HeaderWithBack";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { getSessions, Session } from "@/services/sessions";
import { borderRadius, colors, fontSize, letterSpacing, margin, padding, shadow, theme } from "@/theme";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, PackageOpenIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Pressable, ScrollView, View } from "react-native";
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
                ...shadow.sm,
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
                <ThemedText style={{ fontSize: fontSize.sm, fontWeight: "500", color: session.imageTextColor || "black" }}>
                    {session.imageText?.toUpperCase().slice(0, 2) || ""}
                </ThemedText>
            </View>

            {/* Info */}
            <View style={{ flex: 1, rowGap: 2 }}>
                <ThemedText
                    style={{
                        fontSize: fontSize.base,
                        fontWeight: 500,
                        color: colors.schemes.light.onSurface,
                    }}
                >
                    {session.name}
                </ThemedText>
                <View style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}>
                    <ThemedText
                        style={{
                            fontSize: fontSize.md,
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
                            fontSize: fontSize.md,
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
            <HeaderWithBack
                header='Select Workout'
                subHeader={(
                    <View>
                        <ThemedText
                            style={{
                                fontSize: 16,
                                letterSpacing: theme.letterSpacing.xl * 1,
                                color: theme.colors.schemes.light.onSurfaceVariant
                            }}
                        >
                            Choose a workout to assign to your class
                        </ThemedText>
                    </View>
                )}
                onBack={() => router.back()}
                containerStyle={{
                    paddingVertical: theme.margin.xs,
                    paddingHorizontal: theme.margin.sm,
                    // borderBottomWidth: 0
                }}
            />
            <ScrollView
                style={{
                    flex: 1,
                }}
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
                            flex: 1,
                            flexGrow: 1,
                            height: '100%',
                            alignItems: "center",
                            paddingTop: Dimensions.get('window').height / 2 - 200,
                            paddingHorizontal: 24,
                            rowGap: 24,
                        }}
                    >
                        <PackageOpenIcon
                            size={48}
                            strokeWidth={1.5}
                            color={colors.schemes.light.outline}
                        />
                        <View
                            style={{
                                rowGap: 6
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: fontSize.xl,
                                    fontWeight: 500,
                                    color: colors.schemes.light.onSurface,
                                    textAlign: 'center'
                                }}
                            >
                                No Workouts Available
                            </ThemedText>
                            <ThemedText
                                style={{
                                    fontSize: fontSize.base,
                                    color: colors.schemes.light.onSurfaceVariant,
                                    letterSpacing: letterSpacing.xl,
                                    textAlign: 'center',
                                    maxWidth: 272
                                }}
                            >
                                There are no workouts. Create a workout first in the Workouts tab.
                            </ThemedText>
                        </View>
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