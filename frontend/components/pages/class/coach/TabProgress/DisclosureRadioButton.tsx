import ThemedText from "@/components/ui/ThemedText";
import { colors, shadow, theme } from "@/theme";
import { CheckIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

interface DisclosureRadioButtonProps {
    value: string;
    options: [string, string, string?][];
    onChange: (value: string) => void;
    description?: boolean;
}

export default function DisclosureRadioButton(props: DisclosureRadioButtonProps) {
    return (
        <View
            style={{
                width: "auto",
                height: "auto",
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
                        flexShrink: 1,
                        flexDirection: "row",
                        alignItems: !props.description ? "center" : "flex-start",
                        columnGap: theme.spacing.sm,
                        borderBottomWidth: 1 - i,
                        borderColor: colors.schemes.light.outlineVariant,
                    }}
                >
                    <View
                        style={{
                            width: 24,
                            height: 24,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 1000,
                            borderWidth: 1,
                            borderColor: props.value !== option[0] ? colors.schemes.light.outlineVariant : colors.coreColors.primary,
                            backgroundColor: props.value !== option[0] ? "white" : colors.coreColors.primary,
                            
                            ...shadow.sm
                        }}
                    >
                        {props.value === option[0] &&
                            <CheckIcon
                                size={16}
                                strokeWidth={2.5}
                                color="white"
                            />
                        }
                    </View>
                    <View
                        style={{
                            flex: 1
                        }}
                    >
                        <ThemedText
                            style={{
                                width: "100%",
                                flexShrink: 1,
                                fontSize: 16,
                                fontWeight: props.description ? 500 : 400,
                                letterSpacing: theme.letterSpacing.lg
                            }}
                        >
                            {option[1]}
                        </ThemedText>
                        {option[2] &&
                           <ThemedText
                                style={{
                                    width: "100%",
                                    flexShrink: 1,
                                    fontSize: 14,
                                    fontWeight: 400,
                                    color: theme.colors.schemes.light.onSurfaceVariant,
                                    letterSpacing: theme.letterSpacing["2xl"]
                                }}
                            >
                                {option[2]}
                            </ThemedText>
                        }
                    </View>
                </Pressable>
            ))}
        </View>
    )
}