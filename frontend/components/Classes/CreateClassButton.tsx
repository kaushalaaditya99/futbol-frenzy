import { padding } from "@/theme";
import Button, { buttonThemes } from "../Button";
import { Plus } from "lucide-react-native";
import ThemedText from "../ThemedText";

interface CreateClassButtonProps {
    onPress: () => void;
}

export default function CreateClassButton(props: CreateClassButtonProps) {
    return (
        <Button
            onPress={props.onPress}
            borderColor={buttonThemes.black.borderColor}
            tintColor={buttonThemes.black.tintColor}
            backgroundColor={buttonThemes.black.backgroundColor}
            outerStyle={{
                width: undefined,
                flexShrink: 1,
                borderRadius: 8,
            }}
            inBetweenStyle={{
                borderRadius: 8,
            }}
            innerStyle={{
                paddingVertical: padding.sm,
                paddingHorizontal: padding.lg,
                borderRadius: 6,
            }}
        >
            <Plus
                size={14}
                strokeWidth={2.5}
                color="white"
            />
            <ThemedText
                style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "white"
                }}
            >
                Create Class
            </ThemedText>
        </Button>
    )
}