import { colors } from "@/theme";
import { useEffect, useState } from "react";
import { DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

const TODAY = new Date();
const WEEK_START = new Date();
WEEK_START.setDate(WEEK_START.getDate() - WEEK_START.getDay());

export default function useNavigateCalendar() {
    const [date, setDate] = useState(TODAY);
    const [dateStart, setDateStart] = useState(WEEK_START);
    const [dateOffset, setDateOffset] = useState(TODAY.getDay());
    const [showCalendarModal, setShowCalendarModal] = useState(false);

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

    const getShortenedISOString = (date: Date) => {
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
        showCalendarModal,
        setShowCalendarModal,
        getShortenedISOString
    }
}