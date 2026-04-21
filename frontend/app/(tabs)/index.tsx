import { Flame } from "lucide-react-native";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontSize, letterSpacing, margin, padding } from "@/theme";
import { Fragment, useEffect, useState } from "react";
import CardMetric from "@/components/pages/CardMetric";
import RowCardSession from "@/components/pages/home/RowCardSession";
import ViewAllButton from "@/components/pages/home/ViewAllButton";
import CardResult from "@/components/pages/home/RowCardResult";
import { Session } from "@/services/sessions";
import { StatusBar } from "expo-status-bar";
import SideBar from "@/components/ui/user/sideBar/SideBar";
import CalendarModal from "@/components/ui/calendar/CalendarModal";
import useSideBar from "@/components/ui/user/sideBar/useSideBar";
import Header from "@/components/ui/user/Header";
import useFunctionalDate from "@/hooks/useFunctionalDate";
import SideBarDim from "@/components/ui/user/sideBar/SideBarDim";
import ThemedText from "@/components/ui/ThemedText";
import CalendarNavigate from "@/components/ui/calendar/CalendarNavigate";
import WeekButtonGroup from "@/components/ui/calendar/WeekButtonGroup";
import CoachHome from "@/components/pages/home/CoachHome";
import { useAuth } from "@/contexts/AuthContext";
import { getStudentStats, getStudentSchedule, getStudentResults, StudentStats, ScheduleItem, StudentResult } from "@/services/studentHome";

export default function Home() {
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [results, setResults] = useState<StudentResult[]>([]);
    const [stats, setStats] = useState<StudentStats>({ daysStreak: 0, thisWeek: 0, dueToday: 0 });

    const sideBar = useSideBar();
    const functionalDate = useFunctionalDate();

    const { role, token } = useAuth();

    useEffect(() => {
        if (!token) return;
        getStudentStats(token)
            .then(setStats)
            .catch((err) => console.log("Failed to load student stats:", err));
        getStudentResults(token)
            .then(setResults)
            .catch((err) => console.log("Failed to load student results:", err));
    }, [token]);

    useEffect(() => {
        if (!token) return;
        const dateStr = functionalDate.date.toISOString().split('T')[0];
        getStudentSchedule(token, dateStr)
            .then(setSchedule)
            .catch((err) => console.log("Failed to load schedule:", err));
    }, [token, functionalDate.date]);

    // Map ScheduleItem to Session props for RowCardSession
    const sessions: Session[] = schedule.map((item) => ({
        id: item.id,
        date: item.dueDate ? new Date(item.dueDate) : new Date(),
        name: item.name,
        type: item.type,
        durationInMins: 0,
        class: item.className,
        drills: [],
        isNew: false,
        isDue: !item.submitted,
        imageBackgroundColor: item.imageBackgroundColor || "#1C1C1C",
        imageTextColor: item.imageTextColor,
        imageText: item.imageText || "",
        uploadedBy: "",
        bookmarked: false,
        accessControl: "private",
        coach: {} as any,
    }));

    if (role === "Coach") return <CoachHome />;

    return (
        <>
            <StatusBar
                style="dark"
            />
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    backgroundColor: colors.palettes.neutral[0]
                }}
            >
                {functionalDate.showCalendar &&
                    <CalendarModal
                        onClosePress={() => functionalDate.setShowCalendar(false)}
                        onDayPress={functionalDate.onDayPress}
                        markedDates={functionalDate.getMarkedDates()}
                    />
                }
                <SideBar
                    targetWidth={sideBar.sideBarTargetWidth}
                    animatedExpandFromLeft={sideBar.animatedExpandFromLeft}
                />
                <SafeAreaView
                    edges={["top"]}
                    style={{
                        flex: 1,
                        width: Dimensions.get('window').width,
                        minWidth: Dimensions.get('window').width,
                        backgroundColor: colors.schemes.light.background,
                        position: "relative"
                    }}
                >
                    {sideBar.showSideBar &&
                        <SideBarDim
                            setShowSideBar={sideBar.setShowSideBar}
                        />
                    }
                    <Pressable
                        style={{
                            flex: 1,
                        }}
                    >
                        <Header
                            openSideBar={() => sideBar.setShowSideBar(true)}
                        />
                        <ScrollView
                            style={{
                                flex: 1,
                                backgroundColor: colors.schemes.light.background
                            }}
                        >
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    columnGap: margin.sm,
                                    paddingVertical: margin.sm,
                                    paddingHorizontal: margin.sm,
                                    borderBottomWidth: 1,
                                    borderBottomColor: colors.schemes.light.outlineVariant,
                                    borderStyle: "solid"
                                }}
                            >
                                <CardMetric
                                    label="Days Streak"
                                    value={String(stats.daysStreak)}
                                    valueIcon={
                                        <Flame
                                            size={14}
                                            fill={"yellow"}
                                            color={"orange"}
                                        />
                                    }
                                />
                                <CardMetric
                                    label="Submitted"
                                    value={String(stats.thisWeek)}
                                />
                                <CardMetric
                                    label="Due Today"
                                    value={String(stats.dueToday)}
                                />
                            </View>
                            <View
                                style={{
                                    paddingVertical: margin.sm,
                                    paddingHorizontal: margin.sm,
                                    rowGap: padding.lg
                                }}
                            >
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            fontWeight: 500,
                                            fontSize: fontSize.lg,
                                            letterSpacing: letterSpacing.xs,
                                            color: colors.schemes.light.onBackground,
                                        }}
                                    >
                                        Schedule
                                    </ThemedText>
                                    <CalendarNavigate
                                        functionalDate={functionalDate}
                                    />
                                </View>
                                <WeekButtonGroup
                                    dateOffset={functionalDate.dateOffset}
                                    setDateOffset={functionalDate.setDateOffset}
                                />
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        rowGap: padding.lg
                                    }}
                                >
                                    {sessions.length === 0 && (
                                        <ThemedText
                                            style={{
                                                textAlign: "center",
                                                color: colors.schemes.light.onSurfaceVariant,
                                                fontSize: fontSize.md,
                                                paddingVertical: padding.xl,
                                            }}
                                        >
                                            No assignments due on this day
                                        </ThemedText>
                                    )}
                                    {sessions.map((session: any, i: number) => (
                                        <Fragment key={i}>
                                            <RowCardSession
                                                {...session}
                                                showTag={true}
                                            />
                                        </Fragment>
                                    ))}
                                </View>
                            </View>
                            <View
                                style={{
                                    paddingBottom: margin.sm,
                                    paddingHorizontal: margin.sm,
                                    rowGap: padding.lg
                                }}
                            >
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            fontWeight: 500,
                                            fontSize: fontSize.lg,
                                            letterSpacing: letterSpacing.xs
                                        }}
                                    >
                                        Results
                                    </ThemedText>
                                </View>
                                <View
                                    style={{
                                        rowGap: padding.lg
                                    }}
                                >
                                    {results.map((result, i) => (
                                        <Fragment key={i}>
                                            <CardResult
                                                name={result.name}
                                                date={result.date}
                                                type={result.type}
                                                score={result.score}
                                                imageBackgroundColor={result.imageBackgroundColor}
                                                imageColor={result.imageTextColor}
                                            />
                                        </Fragment>
                                    ))}
                                    <ViewAllButton/>
                                </View>
                            </View>
                        </ScrollView>
                    </Pressable>
                </SafeAreaView>
            </View>
        </>
    )
}
