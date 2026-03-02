import { colors, padding, shadow } from "@/theme";
import Button, { buttonThemes } from "@/components/Button";
import { BookPlus, ClipboardPlus, Plus } from "lucide-react-native";
import ThemedText from "@/components/ThemedText";

interface CreateSessionFastButtonProps {
    onPress: () => void;
}

export default function CreateSessionFastButton(props: CreateSessionFastButtonProps) {
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
            <BookPlus
                size={16}
                strokeWidth={2.5}
                color={colors.schemes.light.onSurfaceVariant}
            />
        </Button>
    )
}