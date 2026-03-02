import { ReactNode } from "react"
import { StyleSheet, StyleProp, View, ViewStyle } from "react-native";

interface InputWrapperProps {
    children: ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
}

export default function InputWrapper(props: InputWrapperProps) {
    const flatContainerStyle = StyleSheet.flatten(props.containerStyle);

    return (
        <View
            style={{
                display: "flex",
                rowGap: 2,
                ...flatContainerStyle
            }}
        >
            {props.children}
        </View>
    )
}