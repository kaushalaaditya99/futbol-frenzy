import { borderRadius, colors } from "@/theme";
import { SettingsIcon } from "lucide-react-native";
import { Pressable } from "react-native";

interface ButtonSettingsProps {
    onPress: () => void;
}

export default function ButtonSettings(props: ButtonSettingsProps) {
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
            <SettingsIcon
                size={16}
                strokeWidth={2.5}
                color={colors.schemes.light.onSurfaceVariant}
            />
        </Pressable>
    )
}
