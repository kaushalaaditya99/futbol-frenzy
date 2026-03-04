import ThemedText from "@/components/ui/ThemedText";
import { theme } from "@/theme";
import { View } from "react-native";

interface TagProps {
    label: string|number;
}

export default function Tag(props: TagProps) {
    return (
        <View
            style={{
                padding: theme.padding.xs,
                paddingHorizontal: theme.padding.sm,
                borderRadius: theme.borderRadius.sm,
                backgroundColor: theme.colors.schemes.light.surfaceContainer
            }}
        >
            <ThemedText
                style={{
                    fontSize: theme.fontSize.sm,
                    letterSpacing: theme.letterSpacing.lg
                }}
            >
                {props.label}
            </ThemedText>
        </View>
    )
}