import { Flame } from "lucide-react-native";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontSize, letterSpacing, padding } from "@/theme";
import { Fragment, useEffect, useState } from "react";
import CardMetric from "@/components/pages/CardMetric";
import RowCardSession from "@/components/pages/home/RowCardSession";
import ViewAllButton from "@/components/pages/home/ViewAllButton";
import CardResult from "@/components/pages/home/RowCardResult";
import { getSessions, Session } from "@/services/sessions";
import { getResults, Result } from "@/services/results";
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
import { router } from "expo-router";

export default function Home() {
    const [results, setResults] = useState<Array<Result>>([]);
    const [sessions, setSessions] = useState<Array<Session>>([]);
    
    const sideBar = useSideBar();
    const functionalDate = useFunctionalDate();

    const { role } = useAuth();

    useEffect(() => {
        // We'd load the user's data in this function
        // as it is called when the component loads.
        // The studentID would likely be defined elsewhere,
        // but I hope I'm getting my point across.
        router.push("/workout");
        // router.push("/ui");
        loadResults();
        loadSessions();
    }, []);


    useEffect(() => {
        loadSessions();
    }, [functionalDate.date]);


    const loadResults = async () => {
        const studentID = 0;
        const results = getResults(studentID);
        setResults(results);
    }


    const loadSessions = async () => {
        const studentID = 0;
        const sessions = await getSessions(studentID);
        setSessions(sessions);
    }

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
                                    columnGap: 24,
                                    paddingVertical: 24,
                                    paddingHorizontal: 24,
                                    borderBottomWidth: 1,
                                    borderBottomColor: colors.schemes.light.outlineVariant,
                                    borderStyle: "solid"
                                }}
                            >
                                <CardMetric
                                    label="Days Streak"
                                    value="7"
                                    valueIcon={
                                        <Flame 
                                            size={14}
                                            fill={"yellow"}
                                            color={"orange"}
                                        />
                                    }
                                />
                                <CardMetric
                                    label="This Week"
                                    value="12"
                                />
                                <CardMetric
                                    label="Due Today"
                                    value="3"
                                />
                            </View>
                            <View
                                style={{
                                    paddingVertical: 24,
                                    paddingHorizontal: 24,
                                    rowGap: 12
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
                                    {sessions.map((session: any, i: number) => (
                                        <Fragment key={i}>
                                            <RowCardSession
                                                {...session}
                                            />
                                        </Fragment>
                                    ))}
                                    <ViewAllButton/>
                                </View>
                            </View>
                            <View
                                style={{
                                    paddingBottom: 24,
                                    paddingHorizontal: 24,
                                    rowGap: 12
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
                                                {...result}
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