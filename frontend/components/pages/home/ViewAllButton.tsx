import { colors, padding, shadow } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, View } from "react-native";
import { MoveRight } from "lucide-react-native";
import Button from "@/components/ui/button/Button";
import ThemedText from "@/components/ui/ThemedText";
import { buttonTheme } from "@/components/ui/button/buttonTheme";

interface ViewAllButtonProps {
    onPress?: () => void;
}

export default function ViewAllButton(props: ViewAllButtonProps) {
    return (
        <Button
            onPress={props.onPress}
            {...buttonTheme.blue}
        >
            <ThemedText
                style={{
                    flex: 1,
                    fontSize: 14,
                    fontWeight: 500,
                    textAlign: "right",
                    color: colors.schemes.light.onPrimary,
                }}
            >
                View All
            </ThemedText>
            <MoveRight
                size={16}
                strokeWidth={2.5}
                color={colors.schemes.light.onPrimary}
            />
        </Button>
    )
}