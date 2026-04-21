import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { colors, fontSize, letterSpacing, borderRadius, margin, padding, shadow, theme } from "@/theme";
import { Zap, Calendar, PlusCircle, PackageOpenIcon } from "lucide-react-native";
import ThemedText from "@/components/ui/ThemedText";
import CardMetric from "@/components/pages/CardMetric";
import ViewAllButton from "@/components/pages/home/ViewAllButton";
import Header from "@/components/ui/user/Header";
import SideBar from "@/components/ui/user/sideBar/SideBar";
import SideBarDim from "@/components/ui/user/sideBar/SideBarDim";
import useSideBar from "@/components/ui/user/sideBar/useSideBar";
import { useAuth } from "@/contexts/AuthContext";
import { getCoachSubmissions, getCoachClassProgress, getCoachStats, CoachSubmission, ClassProgress, CoachStats } from "@/services/coachSubmissions";

// TODO: Activity feed commented out — too similar to recent submissions,
// need to define what constitutes a loggable activity before implementing.
// const MOCK_ACTIVITY = [
//     { id: 1, text: "Alex Rivera submitted Cone Dribbling", time: "25 min ago", color: colors.coreColors.tertiary },
//     { id: 2, text: "Mia Johnson submitted Wall Pass & Receive", time: "1h ago", color: colors.coreColors.tertiary },
//     { id: 3, text: "Noah Park completed Session #20", time: "2h ago", color: colors.coreColors.primary },
//     { id: 4, text: "Carlos Diaz scored 5/10 on Shooting Accuracy", time: "3h ago", color: "#FF9800" },
// ];

function SectionTitle({ title }: { title: string }) {
    return (
        <ThemedText
            style={{
                fontWeight: "500",
                fontSize: fontSize.lg,
                letterSpacing: letterSpacing.xs,
                color: colors.schemes.light.onBackground,
            }}
        >
            {title}
        </ThemedText>
    );
}

function formatTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDays = Math.floor(diffHr / 24);
    return `${diffDays}d ago`;
}

export default function CoachHome() {
    const sideBar = useSideBar();
    const { token, loaded } = useAuth();
    const [submissions, setSubmissions] = useState<CoachSubmission[]>([]);
    const [classProgress, setClassProgress] = useState<ClassProgress[]>([]);
    const [stats, setStats] = useState<CoachStats>({ toReview: 0, totalStudents: 0, completion: 0 });

    useEffect(() => {
        if (!loaded || !token) return;
        getCoachSubmissions(token, { limit: 3 })
            .then(setSubmissions)
            .catch((err) => console.log("Failed to load submissions:", err));
        getCoachClassProgress(token)
            .then(setClassProgress)
            .catch((err) => console.log("Failed to load class progress:", err));
        getCoachStats(token)
            .then(setStats)
            .catch((err) => console.log("Failed to load stats:", err));
    }, [loaded, token]);

    return (
        <>
            <StatusBar style="dark" />
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    backgroundColor: colors.palettes.neutral[0],
                }}
            >
                <SideBar
                    targetWidth={sideBar.sideBarTargetWidth}
                    animatedExpandFromLeft={sideBar.animatedExpandFromLeft}
                />
                <SafeAreaView
                    edges={["top"]}
                    style={{
                        flex: 1,
                        width: Dimensions.get("window").width,
                        minWidth: Dimensions.get("window").width,
                        backgroundColor: colors.schemes.light.background,
                        position: "relative",
                    }}
                >
                    {sideBar.showSideBar && (
                        <SideBarDim setShowSideBar={sideBar.setShowSideBar} />
                    )}
                    <Pressable style={{ flex: 1 }}>
                        <Header openSideBar={() => sideBar.setShowSideBar(true)} />
                        <ScrollView
                            style={{
                                flex: 1,
                                backgroundColor: colors.schemes.light.background,
                            }}
                        >
                {/* Stats Row */}
                <View
                    style={{
                        flexDirection: "row",
                        columnGap: padding.lg,
                        paddingVertical: padding.xl,
                        paddingHorizontal: margin.sm,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.schemes.light.outlineVariant,
                    }}
                >
                    <CardMetric
                        label="To Review"
                        value={String(stats.toReview)}
                    />
                    <CardMetric
                        label="Students"
                        value={String(stats.totalStudents)}
                    />
                    <CardMetric
                        label="Completion"
                        value={`${stats.completion}%`}
                    />
                </View>

                {/* Recent Submissions */}
                <View style={{ paddingTop: padding.xl, paddingBottom: padding.lg, paddingHorizontal: margin.sm, rowGap: padding.lg }}>
                    <SectionTitle title="Recent Submissions" />
                    <View style={{ rowGap: padding.lg }}>
                        {submissions.length === 0 ? (
                            <View
                                style={{
                                    paddingVertical: 36,
                                    paddingHorizontal: padding.md,
                                    minHeight: 100,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    rowGap: 12,
                                    borderWidth: 1,
                                    borderColor: colors.schemes.light.outlineVariant,
                                    borderStyle: "dashed",
                                    borderRadius: 12,
                                    backgroundColor: colors.schemes.light.surfaceContainer,
                                }}
                            >
                                <PackageOpenIcon
                                    size={36}
                                    strokeWidth={1.5}
                                    color={theme.colors.schemes.light.outline}
                                />
                                <ThemedText 
                                    style={{ 
                                        // fontWeight: 400, 
                                        // fontSize: fontSize.base, 
                                        color: colors.schemes.light.outline, 
                                        // letterSpacing: letterSpacing.lg,
                                        fontSize: fontSize.base,
                                        fontWeight: 500,
                                        letterSpacing: letterSpacing.xs,
                                    }}
                                >
                                    No Recent Submissions
                                </ThemedText>
                            </View>
                        ) : (
                            submissions.map((submission) => (
                                <Pressable
                                    key={submission.id}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: padding.lg,
                                        backgroundColor: colors.schemes.light.surfaceContainerLowest,
                                        borderRadius: borderRadius.base,
                                        padding: padding.lg,
                                        borderWidth: 1,
                                        borderColor: colors.schemes.light.outlineVariant,
                                        ...shadow.sm
                                    }}
                                >
                                    <View style={{ flex: 1 }}>
                                        <ThemedText style={{ fontSize: fontSize.base, fontWeight: "600", color: colors.schemes.light.onSurface }}>
                                            {submission.studentName}
                                        </ThemedText>
                                        <ThemedText style={{ fontSize: fontSize.md, color: colors.schemes.light.onSurfaceVariant, marginTop: padding.xs }}>
                                            {submission.drillName} · {formatTimeAgo(submission.dateSubmitted)}
                                        </ThemedText>
                                        <ThemedText style={{ fontSize: fontSize.sm, color: colors.schemes.light.outline, marginTop: padding.xs, letterSpacing: letterSpacing.xl * 1 }}>
                                            {submission.className}
                                        </ThemedText>
                                    </View>
                                </Pressable>
                            ))
                        )}
                    </View>
                    <View style={{ height: 50 }}>
                        <ViewAllButton onPress={() => router.push("/all-submissions")} />
                    </View>
                </View>

                {/* Class Progress */}
                <View style={{ paddingTop: padding.xl, paddingBottom: padding.xl, paddingHorizontal: margin.sm, rowGap: padding.lg }}>
                    <SectionTitle title="Class Progress" />
                    <View style={{ rowGap: padding.lg }}>
                        {classProgress.length === 0 ? (
                            <View
                                style={{
                                    paddingVertical: 36,
                                    paddingHorizontal: padding.md,
                                    minHeight: 100,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    rowGap: 12,
                                    borderWidth: 1,
                                    borderColor: colors.schemes.light.outlineVariant,
                                    borderStyle: "dashed",
                                    borderRadius: 12,
                                    backgroundColor: colors.schemes.light.surfaceContainer,
                                }}
                            >
                                <PackageOpenIcon
                                    size={36}
                                    strokeWidth={1.5}
                                    color={theme.colors.schemes.light.outline}
                                />
                                <ThemedText 
                                    style={{ 
                                        // fontWeight: 400, 
                                        // fontSize: fontSize.base, 
                                        color: colors.schemes.light.outline, 
                                        // letterSpacing: letterSpacing.lg,
                                        fontSize: fontSize.base,
                                        fontWeight: 500,
                                        letterSpacing: letterSpacing.xs,
                                    }}
                                >
                                    No Classes Found
                                </ThemedText>
                            </View>
                        ) : (
                            classProgress.map((cls) => (
                                <Pressable
                                    key={cls.id}
                                    style={{
                                        backgroundColor: colors.schemes.light.surfaceContainerLowest,
                                        borderRadius: borderRadius.base,
                                        padding: padding.xl,
                                        borderWidth: 1,
                                        borderColor: colors.schemes.light.outlineVariant,
                                        ...shadow.sm
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: padding.md,
                                        }}
                                    >
                                        <ThemedText style={{ fontSize: fontSize.base, fontWeight: "500", color: colors.schemes.light.onSurface }}>
                                            {cls.name}
                                        </ThemedText>
                                        <ThemedText
                                            style={{
                                                fontSize: fontSize.md,
                                                fontWeight: "600",
                                                color: cls.completion >= 70 ? colors.coreColors.tertiary : "#FF9800",
                                            }}
                                        >
                                            {cls.completion}%
                                        </ThemedText>
                                    </View>
                                    <View
                                        style={{
                                            width: "100%",
                                            height: 6,
                                            backgroundColor: colors.schemes.light.outlineVariant,
                                            borderRadius: 3,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: `${cls.completion}%`,
                                                height: "100%",
                                                borderRadius: 3,
                                                backgroundColor: cls.completion >= 70 ? colors.coreColors.tertiary : "#FF9800",
                                            }}
                                        />
                                    </View>
                                    <ThemedText style={{ fontSize: fontSize.sm, color: colors.schemes.light.outline, marginTop: padding.md, letterSpacing: letterSpacing.xl }}>
                                        {cls.assignmentsToday} Assignment{cls.assignmentsToday !== 1 ? "s" : ""} Today · {cls.studentsCompleted}/{cls.totalStudents} Submitted
                                    </ThemedText>
                                </Pressable>
                            ))
                        )}
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={{ paddingVertical: padding.xl, paddingHorizontal: margin.sm, rowGap: padding.lg }}>
                    <SectionTitle title="Quick Actions" />
                    <View style={{ flexDirection: "row", gap: padding.md }}>
                        <Pressable
                            onPress={() => router.push("/createDrill")}
                            style={{
                                flex: 1,
                                backgroundColor: colors.schemes.light.surfaceContainerLowest,
                                borderRadius: borderRadius.base,
                                padding: padding.sm,
                                paddingVertical: padding.xl,
                                justifyContent: 'center',
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: colors.schemes.light.outlineVariant,
                                ...shadow.sm
                            }}
                        >
                            <View
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: borderRadius.sm,
                                    backgroundColor: colors.schemes.light.tertiaryContainer,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: padding.md,
                                }}
                            >
                                <Zap size={18} color={colors.coreColors.tertiary} />
                            </View>
                            <ThemedText style={{ fontSize: fontSize.md, fontWeight: "500", color: colors.coreColors.tertiary }}>
                                New Drill
                            </ThemedText>
                        </Pressable>

                        <Pressable
                            onPress={() => router.push("/assignSession")}
                            style={{
                                flex: 1,
                                backgroundColor: colors.schemes.light.surfaceContainerLowest,
                                borderRadius: borderRadius.base,
                                padding: padding.sm,
                                paddingVertical: padding.xl,
                                justifyContent: 'center',
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: colors.schemes.light.outlineVariant,
                                ...shadow.sm
                            }}
                        >
                            <View
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: borderRadius.sm,
                                    backgroundColor: colors.schemes.light.primaryContainer,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: padding.md,
                                }}
                            >
                                <Calendar size={18} color={colors.coreColors.primary} />
                            </View>
                            <ThemedText style={{ fontSize: fontSize.md, fontWeight: "500", color: colors.coreColors.primary }}>
                                Assign Session
                            </ThemedText>
                        </Pressable>

                        <Pressable
                            onPress={() => router.push("/createClass")}
                            style={{
                                flex: 1,
                                backgroundColor: colors.schemes.light.surfaceContainerLowest,
                                borderRadius: borderRadius.base,
                                padding: padding.sm,
                                paddingVertical: padding.xl,
                                justifyContent: 'center',
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: colors.schemes.light.outlineVariant,
                                ...shadow.sm
                            }}
                        >
                            <View
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: borderRadius.sm,
                                    backgroundColor: "#FFF8E1",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: padding.md,
                                }}
                            >
                                <PlusCircle size={18} color={"#FF9800"} />
                            </View>
                            <ThemedText style={{ fontSize: fontSize.md, fontWeight: "500", color: "#FF9800" }}>
                                Add Class
                            </ThemedText>
                        </Pressable>
                    </View>
                </View>

                {/* Activity Feed — commented out, see TODO above */}
                        </ScrollView>
                    </Pressable>
                </SafeAreaView>
            </View>
        </>
    );
}
