import ThemedText from "@/components/ui/ThemedText";
import { colors, theme } from "@/theme";
import { CheckIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

interface DisclosureRadioButtonProps {
    value: string;
    options: [string, string][];
    onChange: (value: string) => void; 
}

export default function DisclosureRadioButton(props: DisclosureRadioButtonProps) {
    return (
        <View
            style={{
                width: "auto",
                height: "auto",
                paddingHorizontal: theme.padding.lg,
                backgroundColor: "white",
                borderRadius: theme.borderRadius.lg,
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
            }}
        >
            {props.options.map((option, i) => (
                <Pressable
                    key={i}
                    onPress={() => props.onChange(option[0])}
                    style={{
                        paddingVertical: theme.padding["2xl"],
                        paddingHorizontal: theme.padding.xl,
                        flexDirection: "row",
                        alignItems: "center",
                        columnGap: theme.spacing.sm,
                        borderBottomWidth: 1 - i,
                        borderColor: colors.schemes.light.outlineVariant
                    }}
                >
                    <View
                        style={{
                            width: 24,
                            height: 24,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 1000,
                            backgroundColor: props.value !== option[0] ? colors.schemes.light.surfaceContainer : "transparent"
                        }}
                    >
                        {props.value === option[0] &&
                            <CheckIcon
                                size={24}
                                strokeWidth={2.5}
                                color={theme.colors.coreColors.primary}
                            />
                        }
                    </View>
                    <ThemedText
                        style={{
                            fontSize: 16,
                            fontWeight: props.value === option[0] ? 500 : 400,
                            letterSpacing: theme.letterSpacing.lg
                        }}
                    >
                        {option[1]}
                    </ThemedText>
                </Pressable>
            ))}
        </View>
    )
}