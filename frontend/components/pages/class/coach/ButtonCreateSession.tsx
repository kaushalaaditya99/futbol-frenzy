import { colors, letterSpacing } from "@/theme";
import { Plus } from "lucide-react-native";
import InlineButton from "@/components/ui/button/InlineButton";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import ThemedText from "@/components/ui/ThemedText";

interface ButtonCreateSessionProps {
    onPress: () => void;
}

export default function ButtonCreateSession(props: ButtonCreateSessionProps) {
    return (
        <InlineButton
            onPress={props.onPress}
            borderRadius={8}
            {...buttonTheme.white}
        >
            <Plus
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
                Create
            </ThemedText>
        </InlineButton>
    )
}