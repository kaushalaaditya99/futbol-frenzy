import { Session } from "@/services/sessions";
import { colors } from "@/theme";
import { useEffect, useState } from "react";
import { DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

export default function useFunctionalDate() {
    const today = new Date();
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const [date, setDate] = useState(today);
    const [dateStart, setDateStart] = useState(startOfWeek);
    const [dateOffset, setDateOffset] = useState(today.getDay());
    
    const [showCalendar, setShowCalendar] = useState(false);


    useEffect(() => {
        const date = new Date(dateStart);
        date.setDate(date.getDate() + dateOffset);
        setDate(date);
    }, [dateStart, dateOffset]);


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


    const onDayPress = (day: DateData) => {
        const pressedDateString = `${day.dateString}T00:00:00`;
        const pressedDate = new Date(pressedDateString);
        
        // Finding the Date Offset
        // When we add this to the date,
        // we get the pressed date. The
        // reason why I'm doing this is
        // because of the Week component.
        const dateOffset = pressedDate.getDay();
        setDateOffset(dateOffset);

        // Finding the Base Date
        const baseDate = new Date(pressedDateString);
        baseDate.setDate(baseDate.getDate() - baseDate.getDay());
        setDateStart(baseDate);
    }


    const getShortISOString = (date: Date) => {
        return date.toISOString().split('T')[0];
    }


    const getMarkedDates = (): MarkedDates => {
        return ({
            [date.toISOString().split('T')[0]]: {
                selected: true, 
                disableTouchEvent: true, 
                selectedColor: colors.coreColors.primary
            }
        })
    }


    const markSessionsOnCalendar = (markedDates: MarkedDates, sessions: Array<Session>) => {
        const markedDatesAndSessions: MarkedDates = {}

        for (const session of sessions) {
            const shortISOString = getShortISOString(session.date);
            
            if (!markedDatesAndSessions[shortISOString])
                markedDatesAndSessions[shortISOString] = {};

            if (!markedDatesAndSessions[shortISOString].dots)
                markedDatesAndSessions[shortISOString].dots = [];

            markedDatesAndSessions[shortISOString].dots.push({
                color: colors.coreColors.primary, 
                selectedDotColor: "white"
            });
        }
        
        return markedDatesAndSessions;
    }
    
    
    const isToday = (date: Date) => {
        return getShortISOString(today) === getShortISOString(date);
    }


    const isYesterday = (date: Date) => {
        return getShortISOString(yesterday) === getShortISOString(date);
    }


    const isTomorrow = (date: Date) => {
        return getShortISOString(tomorrow) === getShortISOString(date);
    }


    return {
        date,
        setDate,
        dateStart,
        setDateStart,
        dateOffset,
        setDateOffset,
        prevDay,
        nextDay,
        onDayPress,
        getMarkedDates,
        showCalendar,
        setShowCalendar,
        getShortISOString,
        today,
        tomorrow,
        yesterday,
        isToday,
        isTomorrow,
        isYesterday,
        markSessionsOnCalendar
    }
}