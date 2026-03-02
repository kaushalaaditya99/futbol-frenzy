import { colors, padding, shadow } from "@/theme";
import Button, { buttonThemes } from "@/components/Button";
import { Plus, Share } from "lucide-react-native";
import ThemedText from "@/components/ThemedText";

interface ShareButtonProps {
    onPress: () => void;
}

export default function ShareButton(props: ShareButtonProps) {
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
                aspectRatio: 1,
                borderRadius: 6,
            }}
        >
            <Share
                size={16}
                strokeWidth={2.5}
                color={colors.schemes.light.onSurfaceVariant}
            />
        </Button>
    )
}