import { borderRadius, colors } from "@/theme";
import { Share } from "lucide-react-native";
import { Pressable } from "react-native";

interface ButtonShareProps {
    onPress: () => void;
}

export default function ButtonShare(props: ButtonShareProps) {
    return (
        <Pressable
            onPress={props.onPress}
            style={{
                width: 36,
                height: 36,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: borderRadius.base,
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                backgroundColor: colors.schemes.light.background,
            }}
        >
            <Share
                size={16}
                strokeWidth={2.5}
                color={colors.schemes.light.onSurfaceVariant}
            />
        </Pressable>
    )
}
