import { colors } from "@/theme";
import { SettingsIcon } from "lucide-react-native";
import IconButton from "@/components/ui/button/IconButton";
import { buttonTheme } from "@/components/ui/button/buttonTheme";

interface ButtonSettingsProps {
    onPress: () => void;
}

export default function ButtonSettings(props: ButtonSettingsProps) {
    return (
        <IconButton
            onPress={props.onPress}
            {...buttonTheme.white}
        >
            <SettingsIcon
                size={16}
                strokeWidth={2.5}
                color={colors.schemes.light.onSurfaceVariant}
            />
        </IconButton>
    )
}