import { borderRadius, colors, fontSize, letterSpacing, padding, shadow } from "@/theme";
import { Pressable } from "react-native";
import ThemedText from "../ThemedText";
import { abbreviatedDays } from "./abbreviatedDays";
import { View } from "lucide-react-native";

interface WeekButtonGroupProps {
    dateOffset: number;
    setDateOffset: (n: number) => void;
}

export default function WeekButtonGroup(props: WeekButtonGroupProps) {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                columnGap: padding.sm
            }}
        >
            {abbreviatedDays.map((day, i) => (
                <Pressable
                    key={i}
                    onPress={() => props.setDateOffset(i)}
                    style={{
                        flex: 1,
                        paddingVertical: 2,
                        borderWidth: 1,
                        borderColor: i === props.dateOffset ? colors.coreColors.primary : colors.schemes.light.outlineVariant,
                        borderRadius: borderRadius.base,
                        backgroundColor: i === props.dateOffset ? colors.coreColors.primary : colors.schemes.light.surfaceContainerLowest,
                        ...shadow.sm
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
