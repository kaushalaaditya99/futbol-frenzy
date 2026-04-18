import { View, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { getCoachSubmissions, CoachSubmission } from "@/services/coachSubmissions";
import ThemedText from "@/components/ui/ThemedText";
import { colors, fontSize, borderRadius, margin, padding } from "@/theme";

function formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function AllSubmissions() {
    const router = useRouter();
    const { token, loaded } = useAuth();
    const [submissions, setSubmissions] = useState<CoachSubmission[]>([]);

    useEffect(() => {
        if (!loaded || !token) return;
        getCoachSubmissions(token, { today: true })
            .then(setSubmissions)
            .catch((err) => console.log("Failed to load submissions:", err));
    }, [loaded, token]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.schemes.light.background }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: margin.sm,
                    paddingVertical: padding.lg,
                }}
            >
                <Pressable onPress={() => router.replace("/")} style={{ marginRight: padding.lg }}>
                    <ArrowLeft size={24} color={colors.schemes.light.onBackground} />
                </Pressable>
                <ThemedText style={{ fontSize: fontSize.xl, fontWeight: "700", color: colors.schemes.light.onBackground }}>
                    Today's Submissions
                </ThemedText>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: margin.sm }}>
                {submissions.length === 0 ? (
                    <ThemedText style={{ fontSize: fontSize.base, color: colors.schemes.light.outline, paddingVertical: padding.xl }}>
                        No submissions today.
                    </ThemedText>
                ) : (
                    <View style={{ rowGap: padding.lg, paddingBottom: margin.sm }}>
                        {submissions.map((submission) => (
                            <Pressable
                                key={submission.id}
                                style={{
                                    backgroundColor: colors.schemes.light.surfaceContainerLowest,
                                    borderRadius: borderRadius.base,
                                    padding: padding.xl,
                                    borderWidth: 1,
                                    borderColor: colors.schemes.light.outlineVariant,
                                }}
                            >
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <ThemedText style={{ fontSize: fontSize.base, fontWeight: "600", color: colors.schemes.light.onSurface }}>
                                        {submission.studentName}
                                    </ThemedText>
                                    <ThemedText style={{ fontSize: fontSize.sm, color: colors.schemes.light.outline }}>
                                        {formatTime(submission.dateSubmitted)}
                                    </ThemedText>
                                </View>
                                <ThemedText style={{ fontSize: fontSize.md, color: colors.schemes.light.outline, marginTop: padding.sm }}>
                                    {submission.drillName}
                                </ThemedText>
                                <ThemedText style={{ fontSize: fontSize.sm, color: colors.schemes.light.onSurfaceVariant, marginTop: padding.sm }}>
                                    {submission.className}
                                </ThemedText>
                            </Pressable>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
