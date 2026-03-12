import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { colors, fontSize, letterSpacing, borderRadius } from "@/theme";
import { Zap, Calendar, PlusCircle } from "lucide-react-native";
import ThemedText from "@/components/ui/ThemedText";
import CardMetric from "@/components/pages/CardMetric";
import ViewAllButton from "@/components/pages/home/ViewAllButton";
import Header from "@/components/ui/user/Header";
import SideBar from "@/components/ui/user/sideBar/SideBar";
import SideBarDim from "@/components/ui/user/sideBar/SideBarDim";
import useSideBar from "@/components/ui/user/sideBar/useSideBar";

const MOCK_SUBMISSIONS = [
    { id: 1, studentName: "Alex Rivera", drillName: "Cone Dribbling", time: "25 min ago" },
    { id: 2, studentName: "Mia Johnson", drillName: "Wall Pass & Receive", time: "1h ago" },
    { id: 3, studentName: "Noah Park", drillName: "Shooting Accuracy", time: "2h ago" },
];

const MOCK_CLASSES = [
    { id: 1, name: "U12 Boys A-Team", completion: 78, session: 20, activeStudents: 14, totalStudents: 18 },
    { id: 2, name: "U14 Girls Select", completion: 45, session: 15, activeStudents: 19, totalStudents: 22 },
];

const MOCK_ACTIVITY = [
    { id: 1, text: "Alex Rivera submitted Cone Dribbling", time: "25 min ago", color: "#4CAF50" },
    { id: 2, text: "Mia Johnson submitted Wall Pass & Receive", time: "1h ago", color: "#4CAF50" },
    { id: 3, text: "Noah Park completed Session #20", time: "2h ago", color: "#2196F3" },
    { id: 4, text: "Carlos Diaz scored 5/10 on Shooting Accuracy", time: "3h ago", color: "#FF9800" },
];

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

export default function CoachHome() {
    const sideBar = useSideBar();

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
                        columnGap: 10,
                        paddingVertical: 16,
                        paddingHorizontal: 24,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.schemes.light.outlineVariant,
                    }}
                >
                    <CardMetric
                        label="To Review"
                        value="8"
                    />
                    <CardMetric
                        label="Students"
                        value="54"
                    />
                    <CardMetric
                        label="Completion"
                        value="78%"
                    />
                </View>

                {/* Recent Submissions */}
                <View style={{ paddingVertical: 16, paddingHorizontal: 24, rowGap: 12 }}>
                    <SectionTitle title="Recent Submissions" />
                    <View style={{ rowGap: 10 }}>
                        {MOCK_SUBMISSIONS.map((submission) => (
                            <Pressable
                                key={submission.id}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 14,
                                    backgroundColor: colors.schemes.light.surfaceContainerLowest,
                                    borderRadius: borderRadius.base,
                                    padding: 12,
                                    borderWidth: 1,
                                    borderColor: colors.schemes.light.outlineVariant,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <ThemedText style={{ fontSize: 15, fontWeight: "600", color: colors.schemes.light.onSurface }}>
                                        {submission.studentName}
                                    </ThemedText>
                                    <ThemedText style={{ fontSize: 12, color: colors.schemes.light.outline, marginTop: 2 }}>
                                        {submission.drillName} · {submission.time}
                                    </ThemedText>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                    <ViewAllButton />
                </View>

                {/* Class Progress */}
                <View style={{ paddingBottom: 16, paddingHorizontal: 24, rowGap: 12 }}>
                    <SectionTitle title="Class Progress" />
                    <View style={{ rowGap: 10 }}>
                        {MOCK_CLASSES.map((cls) => (
                            <Pressable
                                key={cls.id}
                                style={{
                                    backgroundColor: colors.schemes.light.surfaceContainerLowest,
                                    borderRadius: borderRadius.base,
                                    padding: 14,
                                    borderWidth: 1,
                                    borderColor: colors.schemes.light.outlineVariant,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: 8,
                                    }}
                                >
                                    <ThemedText style={{ fontSize: 15, fontWeight: "600", color: colors.schemes.light.onSurface }}>
                                        {cls.name}
                                    </ThemedText>
                                    <ThemedText
                                        style={{
                                            fontSize: 13,
                                            fontWeight: "700",
                                            color: cls.completion >= 70 ? "#4CAF50" : "#FF9800",
                                        }}
                                    >
                                        {cls.completion}%
                                    </ThemedText>
                                </View>
                                <View
                                    style={{
                                        width: "100%",
                                        height: 6,
                                        backgroundColor: "#E0E0E0",
                                        borderRadius: 3,
                                        overflow: "hidden",
                                    }}
                                >
                                    <View
                                        style={{
                                            width: `${cls.completion}%`,
                                            height: "100%",
                                            borderRadius: 3,
                                            backgroundColor: cls.completion >= 70 ? "#4CAF50" : "#FF9800",
                                        }}
                                    />
                                </View>
                                <ThemedText style={{ fontSize: 11, color: colors.schemes.light.outline, marginTop: 6 }}>
                                    Session #{cls.session} · {cls.activeStudents}/{cls.totalStudents} students active
                                </ThemedText>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={{ paddingBottom: 16, paddingHorizontal: 24, rowGap: 12 }}>
                    <SectionTitle title="Quick Actions" />
                    <View style={{ flexDirection: "row", gap: 8 }}>
                        <Pressable
                            onPress={() => router.push("/createDrill")}
                            style={{
                                flex: 1,
                                backgroundColor: colors.schemes.light.surfaceContainerLowest,
                                borderRadius: borderRadius.base,
                                padding: 14,
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: colors.schemes.light.outlineVariant,
                            }}
                        >
                            <View
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: borderRadius.sm,
                                    backgroundColor: "#E8F5E9",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 6,
                                }}
                            >
                                <Zap size={18} color="#4CAF50" />
                            </View>
                            <ThemedText style={{ fontSize: 11, fontWeight: "600", color: colors.schemes.light.onSurface }}>
                                New Drill
                            </ThemedText>
                        </Pressable>

                        <Pressable
                            style={{
                                flex: 1,
                                backgroundColor: colors.schemes.light.surfaceContainerLowest,
                                borderRadius: borderRadius.base,
                                padding: 14,
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: colors.schemes.light.outlineVariant,
                            }}
                        >
                            <View
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: borderRadius.sm,
                                    backgroundColor: "#E3F2FD",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 6,
                                }}
                            >
                                <Calendar size={18} color="#2196F3" />
                            </View>
                            <ThemedText style={{ fontSize: 11, fontWeight: "600", color: colors.schemes.light.onSurface }}>
                                Assign Session
                            </ThemedText>
                        </Pressable>

                        <Pressable
                            onPress={() => router.push("/createClass")}
                            style={{
                                flex: 1,
                                backgroundColor: colors.schemes.light.surfaceContainerLowest,
                                borderRadius: borderRadius.base,
                                padding: 14,
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: colors.schemes.light.outlineVariant,
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
                                    marginBottom: 6,
                                }}
                            >
                                <PlusCircle size={18} color="#FF9800" />
                            </View>
                            <ThemedText style={{ fontSize: 11, fontWeight: "600", color: colors.schemes.light.onSurface }}>
                                Add Class
                            </ThemedText>
                        </Pressable>
                    </View>
                </View>

                {/* Activity Feed */}
                <View style={{ paddingBottom: 24, paddingHorizontal: 24, rowGap: 12 }}>
                    <SectionTitle title="Activity" />
                    <View>
                        {MOCK_ACTIVITY.map((item) => (
                            <View
                                key={item.id}
                                style={{
                                    flexDirection: "row",
                                    gap: 12,
                                    paddingVertical: 10,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#F0F0F0",
                                }}
                            >
                                <View
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: item.color,
                                        marginTop: 5,
                                    }}
                                />
                                <View style={{ flex: 1 }}>
                                    <ThemedText style={{ fontSize: 13, color: colors.schemes.light.onSurface, lineHeight: 18 }}>
                                        {item.text}
                                    </ThemedText>
                                    <ThemedText style={{ fontSize: 11, color: colors.schemes.light.outline, marginTop: 2 }}>
                                        {item.time}
                                    </ThemedText>
                                </View>
                            </View>
                        ))}
                    </View>
                    <ViewAllButton />
                </View>
                        </ScrollView>
                    </Pressable>
                </SafeAreaView>
            </View>
        </>
    );
}
