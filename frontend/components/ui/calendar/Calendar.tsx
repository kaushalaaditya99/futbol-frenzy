import { borderRadius, colors } from "@/theme";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { ViewStyle } from "react-native";
import { DateData, Calendar as ReactNativeCalendar } from "react-native-calendars";
import { MarkedDates, MarkingTypes, Theme } from "react-native-calendars/src/types";

export interface CalendarProps {
    onDayPress?: (day: DateData) => void;
    markedDates?: MarkedDates;
    markingType?: MarkingTypes;
    theme?: Theme,
    style?: ViewStyle;
}

export default function Calendar(props: CalendarProps) {
    return (
        <ReactNativeCalendar
            onDayPress={props.onDayPress}
            markedDates={props.markedDates}
            markingType={props.markingType}
            style={{
                borderRadius: borderRadius.base,
                ...props.style
            }}
            theme={{
                textDayFontFamily: 'Arimo-Regular',
                textMonthFontFamily: 'Arimo-Medium',
                textDayHeaderFontFamily: 'Arimo-Medium',
                todayTextColor: colors.coreColors.primary,
                calendarBackground: colors.schemes.light.surface,
                ...props.theme
            }}
            renderArrow={(direction) => (
                <>
                    {direction === "left" &&
                        <ArrowLeft
                            size={18}
                            strokeWidth={2}
                        />
                    }
                    {direction === "right" &&
                        <ArrowRight
                            size={18}
                            strokeWidth={2}
                        />
                    }
                </>
            )}
        />
    )
}