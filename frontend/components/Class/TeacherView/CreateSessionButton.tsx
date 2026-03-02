import { colors, padding, shadow } from "@/theme";
import Button, { buttonThemes } from "@/components/Button";
import { Plus } from "lucide-react-native";
import ThemedText from "@/components/ThemedText";

interface CreateSessionButtonProps {
    onPress: () => void;
}

export default function CreateSessionButton(props: CreateSessionButtonProps) {
    return (
        <Button
            onPress={props.onPress}
            tintColor={buttonThemes.white.tintColor}
            tintUpsideDown={true}
            borderColor={buttonThemes.white.borderColor}
            backgroundColor={buttonThemes.white.backgroundColor}
            outerStyle={{
                width: undefined,
                flexShrink: 1,
                borderRadius: 8,
                ...shadow.sm
            }}
            inBetweenStyle={{
                borderRadius: 7,
            }}
            innerStyle={{
                height: 28,
                paddingVertical: padding.sm,
                paddingHorizontal: padding.lg,
                borderRadius: 6,
            }}
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
                    color: colors.schemes.light.onSurfaceVariant
                }}
            >
                Create Session
            </ThemedText>
        </Button>
    )
}