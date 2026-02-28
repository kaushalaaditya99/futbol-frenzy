import { colors, shadow } from "@/theme";
import { Pressable, View } from "react-native";
import ThemedText from "../ThemedText";

interface WeekProps {
    dateOffset: number;
    setDateOffset: (n: number) => void;
}

export default function Week(props: WeekProps) {
    return (
        <>
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day, i) => (
                <Pressable
                    key={i}
                    onPress={() => props.setDateOffset(i)}
                    style={{
                        flex: 1,
                        paddingVertical: 2,
                        borderWidth: 1,
                        borderColor: i === props.dateOffset ? colors.coreColors.primary : colors.schemes.light.outlineVariant,
                        borderStyle: "solid",
                        borderRadius: 12,
                        backgroundColor: i === props.dateOffset ? colors.coreColors.primary : colors.schemes.light.surfaceContainerLowest,
                        ...shadow.sm
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
        </>
    )
}
