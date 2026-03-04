import { ReactNode } from "react"
import { StyleSheet, StyleProp, View, ViewStyle } from "react-native";

interface InputWrapperProps {
    children: ReactNode;
    wrapperStyle?: StyleProp<ViewStyle>;
}

export default function InputWrapper(props: InputWrapperProps) {
    const flatWrapperStyle = StyleSheet.flatten(props.wrapperStyle);

    return (
        <View
            style={{
                display: "flex",
                rowGap: 4,
                ...flatWrapperStyle
            }}
        >
            {props.children}
        </View>
    )
}