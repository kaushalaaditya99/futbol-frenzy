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
import useFunctionalDate from "@/hooks/useFunctionalDate";
import NavigateDate from "@/components/Home/NavigateDate";
import { ArrowUpDown, CalendarIcon, Search, TextAlignJustify, TreePalm } from "lucide-react-native";
import InlineRadioButton from "@/components/InlineRadioButton";
import Calendar from "@/components/Calendar";
import Week from "@/components/Home/Week";
import { MarkedDates } from "react-native-calendars/src/types";
import FunctionalDateLarge from "@/components/Home/FunctionalDate";
import Tabs from "./Tabs";
import SessionsTab from "./SessionsTab";
import OverviewTab from "./OverviewTab";

export default function ClassTeacherView() {
    const [teacherID, setTeacherID] = useState(0);
    
    const [tab, setTab] = useState("Sessions");
    const tabs = ["Overview", "Sessions", "Students", "Progress"];
    
    const functionalDate = useFunctionalDate();
    const [multiDotMarkedDates, setMultiDotMarkedDates] = useState<MarkedDates>({});

    const [sessions, setSessions] = useState<Array<Session>>([]);
    const [sessionsViewType, setSessionsViewType] = useState<"Calendar"|"List">("Calendar");
    const [sessionsToday, setSessionsToday] = useState<Array<Session>>([]);
    const [sessionsOnDate, setSessionsOnDate] =  useState<Array<Session>>([]);
    const [sessionsOnDateLabel, setSessionsOnDateLabel] = useState("");


    useEffect(() => {
        loadSessions(teacherID);
    }, []);


    useEffect(() => {
        loadTodaysSessions(sessions);
    }, [sessions]);


    useEffect(() => {
        markSessionsOnCalendar(sessions);
    }, [sessions, functionalDate.date]);


    useEffect(() => {
        getSessionsOnDate(functionalDate.date, sessions);
    }, [sessions, functionalDate.date]);


    useEffect(() => {
        updateResultLabel(functionalDate.date);
    }, [functionalDate.date]);


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
            const sameDayAsToday = session.date.getDate() === todayDate && session.date.getMonth() === todayMonth &&  session.date.getFullYear() === todayFullYear;
            if (sameDayAsToday) {
                todaysSessions.push(session);
            }
        }
        
        setSessionsToday(todaysSessions);
    }


    const markSessionsOnCalendar = (sessions: Array<Session>) => {
        const markedDates = functionalDate.getMarkedDates();
        for (const session of sessions) {
            const shortISOString = functionalDate.getShortISOString(session.date);
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


    const getSessionsOnDate = (date: Date, sessions: Array<Session>) => {
        const dateShortISOString = functionalDate.getShortISOString(date);
        const sessionsOnDate: Array<Session> = [];

        for (const session of sessions)
            if (functionalDate.getShortISOString(session.date) === dateShortISOString)
                sessionsOnDate.push(session);

        setSessionsOnDate(sessionsOnDate);
    }


    const updateResultLabel = (date: Date) => {
        if (functionalDate.isToday(date)) {
            setSessionsOnDateLabel("Today's Sessions");
        }
        else if (functionalDate.isYesterday(date)) {
            setSessionsOnDateLabel("Yesterday's Sessions");
        }
        else if (functionalDate.isTomorrow(date)) {
            setSessionsOnDateLabel("Tomorrow's Sessions");
        }
        else {
            const dateLabel = functionalDate.date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
            setSessionsOnDateLabel(`Sessions on ${dateLabel}`);
        }
    }


    return (
        <ScrollView>
            <Tabs
                tab={tab}
                tabs={tabs}
                setTab={setTab}
            />
            {tab === "Overview" &&
                <OverviewTab
                    sessionsToday={sessionsToday}
                />
            }
            {tab === "Sessions" &&
                <SessionsTab
                    sessionsViewType={sessionsViewType}
                    setSessionsViewType={setSessionsViewType}
                    sessionsOnDate={sessionsOnDate}
                    sessionsOnDateLabel={sessionsOnDateLabel}
                    functionalDate={functionalDate}
                    multiDotMarkedDates={multiDotMarkedDates}
                />
            }
        </ScrollView>
    )
}