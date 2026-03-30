import { Plus } from "lucide-react-native";
import InlineButton from "@/components/ui/button/InlineButton";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import ThemedText from "@/components/ui/ThemedText";

interface CreateClassButtonProps {
    onPress: () => void;
}

export default function CreateClassButton(props: CreateClassButtonProps) {
    return (
        <InlineButton
            onPress={props.onPress}
            {...buttonTheme.black}
        >
            <Plus
                size={14}
                strokeWidth={2.5}
                color="white"
            />
            <ThemedText
                style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "white"
                }}
            >
                Create Class
            </ThemedText>
        </InlineButton>
    )
}