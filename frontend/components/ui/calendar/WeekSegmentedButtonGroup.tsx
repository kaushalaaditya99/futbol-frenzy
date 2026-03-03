import { borderRadius, colors, fontSize, letterSpacing, padding, shadow } from "@/theme";
import { Pressable, View, ViewStyle } from "react-native";
import ThemedText from "../ThemedText";
import { abbreviatedDays } from "./abbreviatedDays";

interface WeekSegmentedButtonGroupProps {
    dateOffset: number;
    setDateOffset: (n: number) => void;
    buttonStyle?: (day: string, i: number) => ViewStyle;
}

export default function WeekSegmentedButtonGroup(props: WeekSegmentedButtonGroupProps) {
    return (
        <View
            style={{
                flexDirection: "row",
                ...shadow.sm
            }}
        >
            {abbreviatedDays.map((day, i) => (
                <Pressable
                    key={i}
                    onPress={() => props.setDateOffset(i)}
                    style={{
                        flex: 1,
                        paddingVertical: padding.md,
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderRightWidth: i === 6 ? 1 : 0,
                        borderLeftWidth: i - 1 !== props.dateOffset ? 1 : 0,
                        borderColor: i === props.dateOffset ? colors.coreColors.primary : colors.schemes.light.outlineVariant,
                        borderTopLeftRadius: i === 0 ? borderRadius.base : 0,
                        borderBottomLeftRadius: i === 0 ? borderRadius.base : 0,
                        borderTopRightRadius: i === 6 ? borderRadius.base : 0,
                        borderBottomRightRadius: i === 6 ? borderRadius.base : 0,
                        backgroundColor: i === props.dateOffset ? colors.coreColors.primary : colors.schemes.light.surfaceContainerLowest,
                        ...Object.assign({}, props.buttonStyle && props.buttonStyle(day, i))
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: fontSize.xs,
                            fontWeight: 700,
                            textAlign: "center",
                            letterSpacing: letterSpacing.lg,
                            color: i === props.dateOffset ? colors.schemes.light.onPrimary : colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        {day}
                    </ThemedText>
                </Pressable>
            ))}
        </View>
    )
}