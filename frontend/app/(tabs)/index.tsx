import { ArrowLeftFromLine, ChevronLeft, ChevronRight, Cog, Flame, MoveLeft, MoveRight, X } from "lucide-react-native";
import { Dimensions, ImageBackground, Modal, Pressable, ScrollView, Text, View } from "react-native";
import Animated, { SlideInLeft, SlideOutLeft, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { colors, margin, padding, shadow } from "@/theme";
import { Fragment, useCallback, useEffect, useState } from "react";
import ThemedText from "@/components/ThemedText";
import CardSummary from "@/components/Home/CardSummary";
import NavigateDate from "@/components/Home/NavigateDate";
import Week from "@/components/Home/Week";
import CardSession from "@/components/Home/CardSession";
import ViewAllButton from "@/components/Home/ViewAll";
import ViewAll from "@/components/Home/ViewAll";
import CardResult from "@/components/Home/CardResult";
import { getSessions, Session } from "@/services/sessions";
import { Calendar } from "react-native-calendars";
import { getResults, Result } from "@/services/results";
import ModalCalendar from "@/components/Home/ModalCalendar";
import { useFocusEffect } from "expo-router";
import SideBar from "@/components/SideBar/SideBar";

const TODAY = new Date();
const WEEK_START = new Date();
WEEK_START.setDate(WEEK_START.getDate() - WEEK_START.getDay());

export default function Home() {
    const [date, setDate] = useState(TODAY);
    const [dateStart, setDateStart] = useState(WEEK_START);
    const [dateOffset, setDateOffset] = useState(TODAY.getDay());
    const [results, setResults] = useState<Array<Result>>([]);
    const [sessions, setSessions] = useState<Array<Session>>([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showSideBar, setShowSideBar] = useState(false);

    // Sliding Animation for Side Bar
    const width = useSharedValue(0);
    const sideBarTargetWidth = Dimensions.get('window').width * 0.75; 
    const animatedExpandFromLeft = useAnimatedStyle(() => ({
        minWidth: width.value,
    }));
    
    useEffect(() => {
        // We'd load the user's data in this function
        // as it is called when the component loads.
        // The studentID would likely be defined elsewhere,
        // but I hope I'm getting my point across.
        loadResults();
        loadSessions();
    }, []);

    useEffect(() => {
        const date = new Date(dateStart);
        date.setDate(date.getDate() + dateOffset);
        setDate(date);
    }, [dateStart, dateOffset]);

    useEffect(() => {
        loadSessions();
    }, [date]);

    useEffect(() => {
        width.value = withTiming(showSideBar ? sideBarTargetWidth : 0, {duration: 300});
    }, [showSideBar]);

    useFocusEffect(
        useCallback(() => {
            return () => {
                setShowSideBar(false);
            };
        }, [])
    );

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

    const prevDay = () => {
        const dDateOffset = dateOffset - 1;

        if (dDateOffset < 0) {
            const updatedDateStart = new Date(dateStart);
            updatedDateStart.setDate(updatedDateStart.getDate() - 7);
            setDateStart(updatedDateStart);
            setDateOffset(6);
        }
        else {
            setDateOffset(dDateOffset);
        }
    }

    const nextDay = () => {
        const iDateOffset = dateOffset + 1;

        if (iDateOffset >= 7) {
            const updatedDateStart = new Date(dateStart);
            updatedDateStart.setDate(updatedDateStart.getDate() + 7);
            setDateStart(updatedDateStart);
            setDateOffset(0);
        }
        else {
            setDateOffset(iDateOffset);
        }
    }

    return (
        <View
            style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: colors.palettes.neutral[0]
            }}
        >
            {showCalendar &&
                <ModalCalendar
                    date={date}
                    showCalendar={showCalendar}
                    setShowCalendar={setShowCalendar}
                    setDateStart={setDateStart}
                    setDateOffset={setDateOffset}
                />
            }
            <SideBar
                targetWidth={sideBarTargetWidth}
                animatedExpandFromLeft={animatedExpandFromLeft}
            />
            <SafeAreaView
                edges={["top"]}
                style={{
                    flex: 1,
                    width: Dimensions.get('window').width,
                    minWidth: Dimensions.get('window').width,
                    backgroundColor: colors.palettes.neutral[0],
                    position: "relative"
                }}
            >
                {showSideBar &&
                    <Pressable
                        onPress={() => setShowSideBar(false)}
                        style={{
                            position: "absolute",
                            zIndex: 100,
                            height: Dimensions.get('window').height,
                            minHeight: Dimensions.get('window').height,
                            width: Dimensions.get('window').width,
                            minWidth: Dimensions.get('window').width,
                            backgroundColor: "#000000D0"
                        }}
                    />
                }
                <Pressable
                    onPress={() => setShowSideBar(false)}
                    style={{
                        flex: 1,
                    }}
                >
                    <Header
                        openSideBar={() => setShowSideBar(true)}
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
                            <CardSummary
                                k="Days Streak"
                                v1={
                                    <Flame 
                                        size={14}
                                        fill={"yellow"}
                                        color={"orange"}
                                    />
                                }
                                v2="7"
                            />
                            <CardSummary
                                k="This Week"
                                v2="12"
                            />
                            <CardSummary
                                k="Due Today"
                                v2="3"
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
                                        fontSize: 18,
                                        letterSpacing: -0.25,
                                        color: colors.schemes.light.onBackground,
                                    }}
                                >
                                    Schedule
                                </ThemedText>
                                <NavigateDate
                                    openCalendar={() => setShowCalendar(true)}
                                    dateStart={dateStart}
                                    dateOffset={dateOffset}
                                    prevDay={prevDay}
                                    nextDay={nextDay}
                                />
                            </View>
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    columnGap: 4
                                }}
                            >
                                <Week
                                    dateOffset={dateOffset}
                                    setDateOffset={setDateOffset}
                                />
                            </View>
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    rowGap: 12
                                }}
                            >
                                {sessions.map((session: any, i: number) => (
                                    <Fragment key={i}>
                                        <CardSession
                                            {...session}
                                        />
                                    </Fragment>
                                ))}
                                <ViewAll/>
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
                                        fontSize: 18,
                                        fontWeight: 500,
                                        letterSpacing: -0.1
                                    }}
                                >
                                    Results
                                </ThemedText>
                            </View>
                            <View
                                style={{
                                    rowGap: 12
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
    )
}