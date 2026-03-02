import { colors } from "@/theme";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { ViewStyle } from "react-native";
import { DateData, Calendar as ReactNativeCalendar } from "react-native-calendars";
import { MarkedDates, MarkingTypes, Theme } from "react-native-calendars/src/types";

interface CalendarProps {
    onDayPress?: (day: DateData) => void;
    markedDates?: MarkedDates;
    markingType?: MarkingTypes;
    theme?: Theme,
    style?: ViewStyle;
}

export default function Calendar(props: CalendarProps) {
    return (
        <ReactNativeCalendar
            markingType={props.markingType}
            style={{
                borderRadius: 8,
                ...props.style
            }}
            theme={{
                calendarBackground: colors.schemes.light.surface,
                textDayFontFamily: 'Arimo-Regular',
                textMonthFontFamily: 'Arimo-Medium',
                textDayHeaderFontFamily: 'Arimo-Medium',
                todayTextColor: colors.coreColors.primary,
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
                    {direction !== "left" &&
                        <ArrowRight
                            size={18}
                            strokeWidth={2}
                        />
                    }
                </>
            )}
            onDayPress={props.onDayPress}
            markedDates={props.markedDates}
        />
    )
}