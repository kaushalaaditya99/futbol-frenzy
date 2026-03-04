import { colors, letterSpacing } from "@/theme";
import { ClipboardPaste } from "lucide-react-native";
import InlineButton from "@/components/ui/button/InlineButton";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import ThemedText from "@/components/ui/ThemedText";

interface ButtonAssignSessionProps {
    onPress: () => void;
}

export default function ButtonAssignSession(props: ButtonAssignSessionProps) {
    return (
        <InlineButton
            onPress={props.onPress}
            borderRadius={8}
            {...buttonTheme.white}
        >
            <ClipboardPaste
                size={14}
                strokeWidth={2.5}
                color={colors.schemes.light.onSurfaceVariant}
            />
            <ThemedText
                style={{
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: letterSpacing.lg,
                    color: colors.schemes.light.onSurfaceVariant
                }}
            >
                Assign
            </ThemedText>
        </InlineButton>
    )
}