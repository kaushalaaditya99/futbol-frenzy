import ThemedText from "@/components/ui/ThemedText";
import { borderRadius, colors, fontSize, letterSpacing, padding, shadow } from "@/theme";
import { ChevronRight } from "lucide-react-native";
import { Pressable, View, ViewStyle } from "react-native";

interface DisclosureButtonProps {
    label: string;
    value: string;
    onDisclose?: () => void;
    level?: "middle" | "top" | "bottom";
}

export default function DisclosureButton(props: DisclosureButtonProps) {
    return (
        <Pressable
            onPress={props.onDisclose}
            style={Object.assign({}, 
                {
                    paddingVertical: padding.lg,
                    paddingHorizontal: padding.lg,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    columnGap: padding.lg,
                    borderColor: colors.schemes.light.outlineVariant,
                    borderRadius: borderRadius.base,
                    backgroundColor: "white",
                    ...shadow.sm
                } as any,
                props.level === "top" && {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    borderWidth: 1
                } as ViewStyle,
                props.level === "middle" && {
                    borderRadius: 0,
                    borderWidth: 1,
                    borderTopWidth: 0,
                } as ViewStyle,
                props.level === "bottom" && {
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderWidth: 1,
                    borderTopWidth: 0,
                } as ViewStyle
            )}
        >
            <View>
                <ThemedText
                    style={{
                        fontSize: fontSize.md,
                        fontWeight: 500,
                        letterSpacing: letterSpacing.lg,
                        color: colors.schemes.light.onSurface
                    }}
                >
                    {props.label}
                </ThemedText>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: padding.sm
                }}
            >
                <ThemedText
                    style={{
                        fontSize: fontSize.md,
                        fontWeight: 400,
                        letterSpacing: letterSpacing.lg,
                        color: colors.schemes.light.onSurfaceVariant,
                        opacity: 0.75,
                    }}
                >
                    {props.value}
                </ThemedText>
                <ChevronRight
                    size={16}
                    strokeWidth={2}
                    color={colors.schemes.light.onSurfaceVariant}
                    opacity={0.75}
                />
            </View>
        </Pressable>
    )
}