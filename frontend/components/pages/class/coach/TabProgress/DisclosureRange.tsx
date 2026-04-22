import { toESTDateString } from "@/utils/dateUtils";
import ThemedText from "@/components/ui/ThemedText";
import DisclosureModal from "./DisclosureModal";
import { BottomScreenProps } from "@/components/ui/BottomScreen";
import Calendar from "@/components/ui/calendar/Calendar";
import { useEffect, useState } from "react";
import { DateData, MarkedDates } from "react-native-calendars/src/types";
import { colors, fontSize, letterSpacing, padding } from "@/theme";
import { View } from "react-native";


interface DisclosureRangeProps extends BottomScreenProps {
    endDate: string;
    startDate: string;
    onChangeEndDate: (date: string) => void;
    onChangeStartDate: (date: string) => void;
}

export default function DisclosureRange(props: DisclosureRangeProps) {
    const [markedDates, setMarkedDates] = useState<MarkedDates>();
    

    useEffect(() => {
        const startDate = new Date(props.startDate);
        const endDate = new Date(props.endDate);
        const markedDates = markPeriod(startDate, endDate);
        setMarkedDates(markedDates as any);
    }, [props.startDate, props.endDate]);


    const getShortDateString = (date: Date) => {
        return toESTDateString(date);
    }

    const markPeriod = (startDate: Date, endDate: Date) => {
        if (startDate > endDate)
            return [];

        const start = new Date(startDate);
        const end = new Date(endDate);

        const markedDates: any = {};
        markedDates[getShortDateString(start)] = {
            startingDay: true, 
            color: colors.coreColors.primary,
            textColor: 'white'
        };

        while (getShortDateString(start) !== getShortDateString(end)) {
            start.setDate(start.getDate() + 1);
            
            const startShortDateString = getShortDateString(start);
            markedDates[startShortDateString] = {
                startingDay: false,
                endingDay: startShortDateString === getShortDateString(end),
                color: colors.coreColors.primary,
                textColor: 'white'
            }
        }

        return markedDates;
    }

    
    const onDayPress = (date: DateData) => {
        const currEndDate = new Date(props.endDate);
        const pressedDate = new Date(date.dateString);

        if (pressedDate < currEndDate) {
            props.onChangeStartDate(date.dateString);
        }
        else {
            props.onChangeEndDate(date.dateString);
        }
    }


    return (
        <DisclosureModal
            title="Select Range"
            onClose={props.onClose}
        >
            <View
                style={{
                    width: "auto",
                    height: "auto",
                    borderTopWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant
                }}
            >
                <View
                    style={{
                        paddingVertical: padding.lg,
                        borderBottomWidth: 1,
                        borderStyle: "dashed",
                        borderColor: colors.schemes.light.outlineVariant
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: fontSize.md,
                            fontWeight: 500,
                            color: colors.schemes.light.onSurfaceVariant,
                            opacity: 0.5,
                            letterSpacing: letterSpacing.lg,
                        }}
                    >
                        Selected {new Date(props.startDate).toLocaleDateString()} to {new Date(props.endDate).toLocaleDateString()}
                    </ThemedText>
                </View>
                <Calendar
                    markedDates={markedDates}
                    markingType={'period'}
                    onDayPress={onDayPress}
                    style={{
                        backgroundColor: "white",
                        padding: 0,
                        paddingHorizontal: 0,
                        margin: 0,
                        marginHorizontal: 0,
                        borderRadius: 0,
                        flexGrow: 1,
                        width: "auto"
                    }}
                    theme={{
                        calendarBackground: "white",
                        backgroundColor: "white",
                        
                    }}  
                />
            </View>
        </DisclosureModal>
    )
}