import { borderRadius, colors, fontSize, letterSpacing, padding, shadow } from "@/theme";
import { ChevronDown, MoveLeft, MoveRight } from "lucide-react-native";
import { Pressable, View } from "react-native";
import ThemedText from "../ThemedText";
import { useEffect, useState } from "react";

interface FunctionalDateLargeProps {
    openCalendar: () => void; 
    dateStart: Date;
    dateOffset: number;
    prevDay: () => void;
    nextDay: () => void;
    setDateOffset: (n: number) => void;
}

export default function FunctionalDateLarge(props: FunctionalDateLargeProps) {
    const [dayLabel, setDayLabel] = useState("Fri");
    const [dateLabel, setDateLabel] = useState("Feb 27");

    useEffect(() => {
        const derivedDate = new Date(props.dateStart);
        derivedDate.setDate(derivedDate.getDate() + props.dateOffset);
        
        // Day Label
        const day = derivedDate.toLocaleDateString('en-US', {weekday: 'short'});
        setDayLabel(day);

        // Date Label
        const date = derivedDate.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        setDateLabel(date);
    }, [props.dateStart, props.dateOffset]);

    return (
        <View>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    borderWidth: 1,
                    borderBottomWidth: 0,
                    borderColor: colors.schemes.light.outlineVariant,
                    borderStyle: "solid",
                    borderRadius: borderRadius.base,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
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
                        // borderBottomLeftRadius: borderRadius.base,
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
                        flex: 1,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: padding.sm,
                        paddingVertical: padding.sm,
                        paddingHorizontal: padding.md,
                        backgroundColor: colors.schemes.light.surfaceContainerLowest,
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
                                fontSize: fontSize.md,
                                letterSpacing: 0.1,
                                color: colors.coreColors.primary
                            }}
                        >
                            {dayLabel}
                        </ThemedText>
                        <ThemedText
                            style={{
                                fontWeight: 500,
                                fontSize: fontSize.md,
                                letterSpacing: letterSpacing.lg,
                                color: colors.schemes.light.onSurfaceVariant
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
                    onPress={props.nextDay}
                    style={{
                        paddingVertical: padding.md,
                        paddingHorizontal: padding.lg,
                        borderLeftWidth: 1,
                        borderBottomWidth: 0,
                        borderColor: colors.schemes.light.outlineVariant,
                        borderTopRightRadius: borderRadius.base,
                        borderBottomRightRadius: 0,
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
            <View
                style={{
                    flexDirection: "row",
                    ...shadow.sm
                }}
            >
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day, i) => (
                    <Pressable
                        key={i}
                        onPress={() => props.setDateOffset(i)}
                        style={{
                            flex: 1,
                            paddingVertical: padding.md,
                            borderLeftWidth: i - 1 !== props.dateOffset ? 1 : 0,
                            borderRightWidth: i === 6 ? 1 : 0,
                            borderBottomWidth: 1,
                            borderTopWidth: 1,
                            borderColor: i === props.dateOffset ? colors.coreColors.primary : colors.schemes.light.outlineVariant,
                            borderStyle: "solid",
                            borderBottomLeftRadius: i === 0 ? borderRadius.base : 0,
                            borderBottomRightRadius: i === 6 ? 12 : 0,
                            backgroundColor: i === props.dateOffset ? colors.coreColors.primary : colors.schemes.light.surfaceContainerLowest,
                        }}
                    >
                        <ThemedText
                            style={{
                                letterSpacing: 0.1,
                                fontSize: 10,
                                fontWeight: 700,
                                textAlign: "center",
                                color: i === props.dateOffset ? colors.schemes.light.onPrimary : colors.schemes.light.onSurfaceVariant
                            }}
                        >
                            {day}
                        </ThemedText>
                    </Pressable>
                ))}
            </View>
        </View>
    )
}