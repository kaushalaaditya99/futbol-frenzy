import { borderRadius, colors, fontSize, letterSpacing, padding, shadow } from "@/theme";
import { ChevronDown, MoveLeft, MoveRight } from "lucide-react-native";
import { Pressable, View } from "react-native";
import ThemedText from "../ThemedText";
import { useEffect, useState } from "react";

interface NavigateDateProps {
    openCalendar: () => void; 
    dateStart: Date;
    dateOffset: number;
    prevDay: () => void;
    nextDay: () => void;
}

export default function NavigateDate(props: NavigateDateProps) {
    const [dayLabel, setDayLabel] = useState("Fri");
    const [dateLabel, setDateLabel] = useState("Feb 27");

    useEffect(() => {
        const derivedDate = new Date(props.dateStart);
        derivedDate.setDate(derivedDate.getDate() + props.dateOffset);
        
        // Day Label
        const day = derivedDate.toLocaleDateString('en-US', {weekday: 'short'});
        setDayLabel(day);

        // Date Label
        const dayNumber = derivedDate.getDate();
        const month = derivedDate.toLocaleDateString('en-US', {month: 'short'});
        const year = derivedDate.getFullYear();

        // Year, Month, and Day
        if ((new Date()).getFullYear() != year) {
            const dateLabel = `${month} ${dayNumber} ${year}`;
            setDateLabel(dateLabel);
        }
        // Month and Day
        else {
            const dateLabel = `${month} ${dayNumber}`;
            setDateLabel(dateLabel);
        }
    }, [props.dateStart, props.dateOffset]);

    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                borderStyle: "solid",
                borderRadius: borderRadius.base,
                ...shadow.sm
            }}
        >
            <Pressable
                onPress={props.prevDay}
                style={{
                    paddingVertical: padding.md,
                    paddingHorizontal: padding.lg,
                    borderRightWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant,
                    borderTopLeftRadius: borderRadius.base,
                    borderBottomLeftRadius: borderRadius.base,
                    backgroundColor: colors.schemes.light.surfaceContainerLowest,
                }}
            >
                <View>
                    <MoveLeft
                        color={colors.schemes.light.onSurfaceVariant}
                        size={14}
                        strokeWidth={2.5}
                    />
                </View>
            </Pressable>
            <Pressable
                onPress={() => props.openCalendar()}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: padding.sm,
                    paddingVertical: padding.sm,
                    paddingHorizontal: padding.md,
                    backgroundColor: colors.schemes.light.surfaceContainerLowest,
                }}
            >
                <ThemedText
                    style={{
                        fontWeight: 500,
                        fontSize: 12,
                        letterSpacing: 0.1,
                        color: colors.coreColors.primary
                    }}
                >
                    {dayLabel}
                </ThemedText>
                <ThemedText
                    style={{
                        fontWeight: 500,
                        fontSize: fontSize.sm,
                        letterSpacing: letterSpacing.lg,
                        color: colors.schemes.light.onSurfaceVariant
                    }}
                >
                    {dateLabel}
                </ThemedText>
                <ChevronDown
                    color={colors.schemes.light.onSurfaceVariant}
                    size={14}
                    strokeWidth={2.5}
                />
            </Pressable>
            <Pressable
                onPress={props.nextDay}
                style={{
                    paddingVertical: padding.md,
                    paddingHorizontal: padding.lg,
                    borderLeftWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant,
                    borderTopRightRadius: borderRadius.base,
                    borderBottomRightRadius: borderRadius.base,
                    backgroundColor: colors.schemes.light.surfaceContainerLowest,
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