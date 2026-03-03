import { buttonTheme } from "@/components/ui/button/buttonTheme";
import InlineButton from "@/components/ui/button/InlineButton";
import ThemedText from "@/components/ui/ThemedText";
import { padding } from "@/theme";
import { ArrowRightToLine } from "lucide-react-native";

interface JoinClassButton2Props {
    onPress: () => void;
}

export default function JoinClassButton(props: JoinClassButton2Props) {
    return (
        <InlineButton
            onPress={props.onPress}
            {...buttonTheme.black}
        >
            <ArrowRightToLine
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
                Join Class
            </ThemedText>
        </InlineButton>
    )
}