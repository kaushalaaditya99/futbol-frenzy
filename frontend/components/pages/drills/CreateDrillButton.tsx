import { buttonTheme } from "@/components/ui/button/buttonTheme";
import InlineButton from "@/components/ui/button/InlineButton";
import ThemedText from "@/components/ui/ThemedText";
import { theme } from "@/theme";
import { Plus } from "lucide-react-native";

interface CreateDrillButtonProps {
    onPress: () => void;
}

export default function CreateDrillButton(props: CreateDrillButtonProps) {
    return (
        <InlineButton
            onPress={props.onPress}
            borderRadius={8}
            {...buttonTheme.white}
            outerStyle={{
                height: 36,
                minHeight: 36,
                maxHeight: 36,
            }}
            innerMostStyle={{
                height: '100%',
                paddingVertical: theme.padding.sm - 1,
                paddingHorizontal: theme.padding.lg,
            }}
        >
            <Plus
                size={14}
                strokeWidth={2.5}
                color={theme.colors.schemes.light.onSurfaceVariant}
            />
            <ThemedText
                style={{
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: theme.letterSpacing.lg,
                    color: theme.colors.schemes.light.onSurface
                }}
            >
                Create Drill
            </ThemedText>
        </InlineButton>
    )
}