import { theme } from "@/theme";
import { View } from "react-native";
import Separator from "./Separator";
import ThemedText from "./ThemedText";

export default function SeparatorText(props: {text: string}) {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                columnGap: theme.padding.lg,
            }}
        >
            <Separator/>
            <ThemedText
                style={{
                    flexShrink: 1,
                    fontSize: 12,
                    fontWeight: 600,
                    color: theme.colors.schemes.light.onSurfaceVariant,
                    textAlign: "center",
                }}
            >
                {props.text}
            </ThemedText>
            <Separator/>
        </View>
    )
}