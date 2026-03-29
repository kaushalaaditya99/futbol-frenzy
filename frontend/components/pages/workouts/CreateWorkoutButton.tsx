import { buttonTheme } from "@/components/ui/button/buttonTheme";
import InlineButton from "@/components/ui/button/InlineButton";
import ThemedText from "@/components/ui/ThemedText";
import { theme } from "@/theme";
import { Plus } from "lucide-react-native";

interface CreateWorkoutButtonProps {
    onPress: () => void;
}

export default function CreateWorkoutButton(props: CreateWorkoutButtonProps) {
    return (
        <InlineButton
            onPress={props.onPress}
            borderRadius={8}
            {...buttonTheme.white}
            outerStyle={{
                height: 36
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
                    letterSpacing: theme.letterSpacing.xl,
                    color: theme.colors.schemes.light.onSurface
                }}
            >
                Create Workout
            </ThemedText>
        </InlineButton>
    )
}