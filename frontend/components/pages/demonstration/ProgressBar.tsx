import { Drill } from "@/services/sessions";
import { Pressable, View } from "react-native";
import { colors, fontSize, padding } from "@/theme";
import ThemedText from "@/components/ui/ThemedText";

interface ProgressBarProps {
    drills: Array<Drill>;
    drillIndex: number;
    submittedDrills: Array<number>;
    setDrillIndex: (drillIndex: number) => void;
}

export default function ProgressBar(props: ProgressBarProps) {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row"
            }}    
        >
            {props.drills.map((drill, i) => (
                <Pressable
                    key={i}
                    onPress={() => props.setDrillIndex(i)}
                    style={{
                        flex: 1,
                        paddingVertical: padding.sm,
                        paddingHorizontal: padding.md,
                        backgroundColor: i === props.drillIndex ? colors.coreColors.primary : props.submittedDrills.findIndex(n => i === n) !== -1 ? "#3AB82C" : colors.palettes.neutral[0]
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: fontSize.base,
                            fontWeight: 500,
                            color: colors.schemes.light.onPrimary,
                            textAlign: "center",
                        }}
                    >
                        {i + 1}
                    </ThemedText>
                </Pressable>
            ))}
        </View>
    )
}