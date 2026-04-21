import { Pressable, View } from "react-native";
import { colors, fontSize, padding } from "@/theme";
import ThemedText from "@/components/ui/ThemedText";
import { CheckIcon, CircleCheck } from "lucide-react-native";
import { Drill } from "@/services/drills";

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
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        columnGap: 4,
                        paddingVertical: padding.sm,
                        paddingHorizontal: Math.max(padding.md, 24),
                        backgroundColor: i === props.drillIndex ? colors.coreColors.primary : colors.palettes.neutral[0],
                        // borderTopWidth: 1,
                        // borderColor: props.submittedDrills.findIndex(n => i === n) !== -1 ? "#3AB82C" : colors.schemes.light.outlineVariant
                    }}
                >
                    <View
                        style={{
                            position: 'relative',
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
                        {(props.submittedDrills.findIndex(n => i === n) !== -1) &&
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 1,
                                    right: -20
                                }}
                            >
                                <CircleCheck
                                    size={16}
                                    color='#ffffff'
                                />
                            </View>
                        }
                    </View>
                </Pressable>
            ))}
        </View>
    )
}