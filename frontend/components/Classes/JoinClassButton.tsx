import { padding } from "@/theme";
import Button, { buttonThemes } from "../Button";
import { ArrowRightToLine } from "lucide-react-native";
import ThemedText from "../ThemedText";

interface JoinClassButton2Props {
    onPress: () => void;
}

export default function JoinClassButton(props: JoinClassButton2Props) {
    return (
        <Button
            onPress={props.onPress}
            borderColor={buttonThemes.black.borderColor}
            tintColor={buttonThemes.black.tintColor}
            backgroundColor={buttonThemes.black.backgroundColor}
            outerStyle={{
                width: "auto",
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
        </Button>
    )
}