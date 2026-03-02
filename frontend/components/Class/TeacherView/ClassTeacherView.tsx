import { borderRadius, colors, fontSize, letterSpacing, margin, padding, shadow } from "@/theme";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import CreateSessionButton from "./CreateSessionButton";
import ShareButton from "./ShareButton";
import SettingsButton from "./SettingsButton";
import CardSummary from "@/components/Home/CardSummary";
import ThemedText from "@/components/ThemedText";
import { Fragment, useEffect, useState } from "react";
import { getSessions, Session } from "@/services/sessions";
import ViewAllButton from "@/components/Home/ViewAll";
import CardSession from "@/components/Home/CardSession";
import CreateSessionFastButton from "./CreateSessionFastButton";
import useNavigateCalendar from "@/hooks/useNavigateCalendar";
import NavigateDate from "@/components/Home/NavigateDate";
import { CalendarIcon, TextAlignJustify } from "lucide-react-native";
import InlineRadioButton from "@/components/InlineRadioButton";
import Calendar from "@/components/Calendar";
import Week from "@/components/Home/Week";
import { MarkedDates } from "react-native-calendars/src/types";
import TextInputField from "@/components/TextInputField";

export default function ClassTeacherView() {
    const [teacherID, setTeacherID] = useState(0);
    const [tab, setTab] = useState("Sessions");
    const [tabs, setTabs] = useState(["Overview", "Sessions", "Students", "Progress"]);
    const [sessions, setSessions] = useState<Array<Session>>([]);
    const [todaysSession, setTodaysSessions] = useState<Array<Session>>([]);
    
    const navigateCalendar = useNavigateCalendar();
    const [multiDotMarkedDates, setMultiDotMarkedDates] = useState<MarkedDates>({});

    const [sessionView, setSessionView] = useState<"Calendar"|"List">("Calendar")

    useEffect(() => {
        loadSessions(teacherID);
    }, []);

    useEffect(() => {
        loadTodaysSessions(sessions);
    }, [sessions]);

    useEffect(() => {
        loadMultiDotMarking(sessions);
    }, [sessions, navigateCalendar.date]);

    const loadSessions = async (teacherID: number) => {
        const sessions = await getSessions(teacherID);
        setSessions(sessions);
    }

    const loadTodaysSessions = (sessions: Array<Session>) => {
        const todaysSessions: Array<Session> = [];
        const today = new Date();
        const todayDate = today.getDate();
        const todayMonth = today.getMonth();
        const todayFullYear = today.getFullYear();

        for (const session of sessions) {
            const sameDayAsToday = session.date.getDate() === todayDate && session.date.getMonth() === todayMonth &&  session.date.getFullYear() === todayFullYear
            if (sameDayAsToday) {
                todaysSessions.push(session);
            }
        }

        setTodaysSessions(todaysSession);
    }

    const loadMultiDotMarking = (sessions: Array<Session>) => {
        const markedDates = navigateCalendar.getMarkedDates();

        for (const session of sessions) {
            const shortISOString = navigateCalendar.getShortenedISOString(session.date);
            
            if (!markedDates[shortISOString])
                markedDates[shortISOString] = {};
            
            if (!markedDates[shortISOString].dots)
                markedDates[shortISOString].dots = [];

            markedDates[shortISOString].dots.push({
                color: colors.coreColors.primary, 
                selectedDotColor: "white"
            });
        }

        setMultiDotMarkedDates(markedDates);
    }

    return (
        <ScrollView>
            <View
                style={{
                    flexDirection: "row",
                }}
            >
                {tabs.map((tab_, i) => (
                    <Pressable
                        key={i}
                        onPress={() => setTab(tab_)}
                        style={{
                            paddingVertical: padding.lg,
                            paddingHorizontal: padding.lg,
                            flex: 1,
                            borderTopWidth: 1,
                            borderBottomWidth: 1,
                            borderLeftWidth: (i === 0 || tabs[i - 1] === tab) ? 0 : 1,
                            borderColor: tab_ === tab ? colors.coreColors.primary : colors.schemes.light.outlineVariant,
                            backgroundColor: (tab_ === tab) ? colors.coreColors.primary : colors.schemes.light.surfaceContainerHigh
                        }}
                    >
                        <ThemedText
                            style={{
                                fontSize: fontSize.xs,
                                fontWeight: 600,
                                letterSpacing: letterSpacing.lg,
                                textAlign: "center",
                                color: tab_ === tab ? "white" : colors.schemes.light.onSurfaceVariant
                            }}
                        >
                            {tab_.toUpperCase()}
                        </ThemedText>
                    </Pressable>
                ))}
            </View>
            {tab === "Sessions" &&
                <View
                    style={{
                        backgroundColor: colors.schemes.light.background
                    }}
                >
                    <View
                        style={{
                            paddingVertical: margin["3xs"],
                            paddingHorizontal: margin["3xs"],
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            columnGap: margin["3xs"],
                            borderBottomWidth: 1,
                            borderColor: colors.schemes.light.outlineVariant
                        }}
                    >
                        <CreateSessionButton
                            onPress={() => 1}
                        />
                        <ShareButton
                            onPress={() => 1}
                        />
                        <SettingsButton
                            onPress={() => 1}
                        />
                    </View>
                    <View
                        style={{
                            paddingVertical: margin.sm,
                            paddingHorizontal: margin.sm,
                            rowGap: padding.lg,
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
                                Sessions
                            </ThemedText>
                            <TextInput
                                style={{
                                    height: 36,
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: colors.schemes.light.outlineVariant,
                                    borderRadius: borderRadius.base,
                                    backgroundColor: "white"
                                }}
                            />
                            <InlineRadioButton
                                selectedValue={sessionView}
                                onChange={(value: string) => setSessionView(value as any)}
                                options={[
                                    ["Calendar",
                                        <CalendarIcon
                                            size={16}
                                            color={sessionView === "Calendar" ? "black" : colors.schemes.light.onSurfaceVariant}
                                        />
                                    ],
                                    ["List",
                                        <TextAlignJustify
                                            size={16}
                                            color={sessionView === "List" ? "black" : colors.schemes.light.onSurfaceVariant}
                                        />
                                    ]
                                ]}
                                containerStyle={{
                                    height: 36
                                }}
                                optionStyle={{
                                    paddingVertical: padding.sm,
                                    paddingHorizontal: padding.md,
                                }}
                                selectedOptionStyle={{
                                    borderRadius: 6
                                }}
                            />
                        </View>
                        {sessionView === "List" &&
                            <View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "flex-end"
                                    }}
                                >
                                    <NavigateDate
                                        openCalendar={() => navigateCalendar.setShowCalendarModal(true)}
                                        dateStart={navigateCalendar.dateStart}
                                        dateOffset={navigateCalendar.dateOffset}
                                        prevDay={navigateCalendar.prevDay}
                                        nextDay={navigateCalendar.nextDay}
                                    />
                                </View>
                                <Week
                                    dateOffset={navigateCalendar.dateOffset}
                                    setDateOffset={navigateCalendar.setDateOffset}
                                />
                            </View>
                        }
                        {sessionView === "Calendar" &&
                            <View
                                style={{
                                    ...shadow.sm
                                }}
                            >
                                <Calendar
                                    onDayPress={navigateCalendar.onDayPress}
                                    markingType={"multi-dot"}
                                    markedDates={multiDotMarkedDates}
                                    style={{
                                        overflow: "hidden",
                                        backgroundColor: "white",
                                        borderWidth: 1,
                                        borderColor: colors.schemes.light.outlineVariant,
                                        borderRadius: borderRadius.base
                                    }}
                                    theme={{
                                        calendarBackground: "white",
                                        backgroundColor: "white",
                                    }}
                                />
                            </View>
                        }
                    </View>
                </View>
            }
            {tab === "Overview" &&
                <View
                    style={{
                        backgroundColor: colors.schemes.light.background
                    }}
                >
                    <View
                        style={{
                            paddingVertical: margin["3xs"],
                            paddingHorizontal: margin["3xs"],
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            columnGap: margin["3xs"],
                            borderBottomWidth: 1,
                            borderColor: colors.schemes.light.outlineVariant
                        }}
                    >
                        <CreateSessionFastButton
                            onPress={() => 1}
                        />
                        <ShareButton
                            onPress={() => 1}
                        />
                        <SettingsButton
                            onPress={() => 1}
                        />
                    </View>
                    <View
                        style={{
                            paddingVertical: margin.sm,
                            paddingHorizontal: margin.sm,
                            flexDirection: "row",
                            columnGap: padding.lg,
                            borderBottomWidth: 1,
                            borderColor: colors.schemes.light.outlineVariant
                        }}
                    >
                        <CardSummary
                            k={"Number\nStudents"}
                            v2="10"
                        />
                        <CardSummary
                            k={"Sessions\nToday"}
                            v2="5"
                        />
                        <CardSummary
                            k={"Sessions\nUngraded"}
                            v2="5"
                        />
                    </View>
                    <View
                        style={{
                            paddingVertical: margin.sm,
                            paddingHorizontal: margin.sm,
                            rowGap: padding.lg,
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
                            Today's Scheduled Sessions
                        </ThemedText>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: 12
                            }}
                        >
                            {todaysSession.map((session: any, i: number) => (
                                <Fragment key={i}>
                                    <CardSession
                                        {...session}
                                        showTag={false}
                                    />
                                </Fragment>
                            ))}
                            <ViewAllButton/>
                        </View>
                    </View>
                </View>
            }
        </ScrollView>
    )
}