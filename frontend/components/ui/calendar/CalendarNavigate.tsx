import useFunctionalDate from "@/hooks/useFunctionalDate";
import { borderRadius, colors, fontSize, letterSpacing, padding, shadow } from "@/theme";
import { ChevronDown, MoveLeft, MoveRight } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, TextStyle, View, ViewStyle } from "react-native";
import ThemedText from "../ThemedText";

interface CalendarNavigateProps {
    functionalDate: ReturnType<typeof useFunctionalDate>;
    long?: boolean;
    dateLabelLong?: boolean;
    onOpenCalendar?: () => void;
    containerStyle?: ViewStyle;
    leftButtonContainerStyle?: ViewStyle;
    rightButtonContainerStyle?: ViewStyle;
    middleButtonContainerStyle?: ViewStyle;
    middleTextStyle?: TextStyle;
}

export default function CalendarNavigate(props: CalendarNavigateProps) {
    const [dayLabel, setDayLabel] = useState("Fri");
    const [dateLabel, setDateLabel] = useState("Feb 27");

    useEffect(() => {
        const derivedDate = new Date(props.functionalDate.dateStart);
        derivedDate.setDate(derivedDate.getDate() + props.functionalDate.dateOffset);
        
        const day = derivedDate.toLocaleDateString('en-US', {weekday: 'short'});
        setDayLabel(day);

        if (props.dateLabelLong)
            updateDateLabelLong(derivedDate);
        else
            updateDateLabelShort(derivedDate);
    }, [props.functionalDate.dateStart, props.functionalDate.dateOffset]);


    const updateDateLabelShort = (date: Date) => {
        const dayNumber = date.getDate();
        const month = date.toLocaleDateString('en-US', {month: 'short'});
        const year = date.getFullYear();

        if ((new Date()).getFullYear() != year) {
            const dateLabel = `${month} ${dayNumber} ${year}`;
            setDateLabel(dateLabel);
        }
        else {
            const dateLabel = `${month} ${dayNumber}`;
            setDateLabel(dateLabel);
        }
    }


    const updateDateLabelLong = (date: Date) => {
        setDateLabel(date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }));
    }


    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                borderWidth: 1,
                borderRadius: borderRadius.base,
                borderColor: colors.schemes.light.outlineVariant,
                ...shadow.sm,
                ...props.containerStyle
            }}
        >
            <Pressable
                onPress={props.functionalDate.prevDay}
                style={{
                    paddingVertical: padding.md,
                    paddingHorizontal: padding.lg,
                    borderRightWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant,
                    borderTopLeftRadius: borderRadius.base,
                    backgroundColor: colors.schemes.light.surfaceContainerLowest,
                    ...props.leftButtonContainerStyle
                }}
            >
                <MoveLeft
                    color={colors.schemes.light.onSurfaceVariant}
                    size={14}
                    strokeWidth={2.5}
                />
            </Pressable>
            <Pressable
                onPress={props.onOpenCalendar}
                style={{
                    paddingVertical: padding.sm,
                    paddingHorizontal: padding.md,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: padding.sm,
                    backgroundColor: colors.schemes.light.surfaceContainerLowest,
                    ...props.middleButtonContainerStyle
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        columnGap: padding.sm
                    }}
                >
                    <ThemedText
                        style={{
                            fontWeight: 500,
                            fontSize: props.long ? fontSize.md : fontSize.sm,
                            letterSpacing: letterSpacing.lg,
                            color: colors.coreColors.primary,
                            ...props.middleTextStyle
                        }}
                    >
                        {dayLabel}
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontWeight: 500,
                            fontSize: props.long ? fontSize.md : fontSize.sm,
                            letterSpacing: letterSpacing.lg,
                            color: colors.schemes.light.onSurfaceVariant,
                            ...props.middleTextStyle
                        }}
                    >
                        {dateLabel}
                    </ThemedText>
                </View>
                <ChevronDown
                    color={colors.schemes.light.onSurfaceVariant}
                    size={14}
                    strokeWidth={2.5}
                />
            </Pressable>
            <Pressable
                onPress={props.functionalDate.nextDay}
                style={{
                    paddingVertical: padding.md,
                    paddingHorizontal: padding.lg,
                    borderLeftWidth: 1,
                    borderBottomWidth: 0,
                    borderTopRightRadius: borderRadius.base,
                    borderBottomRightRadius: 0,
                    borderColor: colors.schemes.light.outlineVariant,
                    backgroundColor: colors.schemes.light.surfaceContainerLowest,
                    ...props.rightButtonContainerStyle
                }}
            >
                <MoveRight
                    color={colors.schemes.light.onSurfaceVariant}
                    size={14}
                    strokeWidth={2.5}
                />
            </Pressable>
        </View>
    )
}