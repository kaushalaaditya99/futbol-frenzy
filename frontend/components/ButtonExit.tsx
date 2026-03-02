import { colors } from "@/theme";
import { X } from "lucide-react-native";
import { Pressable } from "react-native";

interface ButtonExitProps {
    onPress: () => void;
}

export default function ButtonExit(props: ButtonExitProps) {
    return (
        <Pressable
            style={{
                width: 20,
                height: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 100,
                backgroundColor: colors.schemes.light.surfaceContainerHighest
            }}
            onPress={props.onPress}
        >
            <X
                size={12}
                strokeWidth={3}
                color={colors.schemes.light.onSurface}
            />
         </Pressable>
    )
}