import { colors, shadow } from "@/theme";
import { CheckIcon } from "lucide-react-native";
import { View } from "react-native";

interface InputCheckboxProps {
    checked: boolean;
}

export default function InputCheckbox(props: InputCheckboxProps) {
    const length = 16;

    return (
        <>
            {props.checked &&
                <View
                    style={{
                        width: length,
                        height: length,
                        maxWidth: length,
                        maxHeight: length,
                        // aspectRatio: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: colors.coreColors.primary,
                        backgroundColor: colors.coreColors.primary,
                        ...shadow.sm
                    }}
                >
                    <CheckIcon
                        size={14}
                        strokeWidth={2.5}
                        color="white"
                    />
                </View>
            }
            {!props.checked &&
                <View
                    style={{
                        width: length,
                        height: length,
                        maxWidth: length,
                        maxHeight: length,
                        // aspectRatio: 1,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant,
                        backgroundColor: "white",
                        ...shadow.sm
                    }}
                >
                </View>   
            }
        </>
    )                            
}