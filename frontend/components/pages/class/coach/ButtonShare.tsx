import { colors } from "@/theme";
import IconButton from "@/components/ui/button/IconButton";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import { Share } from "lucide-react-native";

interface ButtonShareProps {
    onPress: () => void;
}

export default function ButtonShare(props: ButtonShareProps) {
    return (
        <IconButton
            onPress={props.onPress}
            {...buttonTheme.white}
        >
            <Share
                size={16}
                strokeWidth={2.5}
                color={colors.schemes.light.onSurfaceVariant}
            />
        </IconButton>
    )
}