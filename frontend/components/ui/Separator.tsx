import { theme } from "@/theme";
import { DimensionValue, View } from "react-native";

export default function Separator(props: {width?: DimensionValue;}) {
    return (
        <View 
            style={{
                flex: 1,
                height: 1, 
                maxHeight: 1, 
                width: props.width, 
                backgroundColor: theme.colors.schemes.light.onSurfaceVariant,
                opacity: 0.25
        }}/>
    )
}