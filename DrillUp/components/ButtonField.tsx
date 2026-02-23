import { Button, Text, Touchable, TouchableHighlight, View } from "react-native";

interface ButtonFieldProps {
    title: string;
    onPress?: () => void;
    style?: {[k: string]: string|number};
    textStyle?: {[k: string]: string|number};
}

export default function ButtonField(props: ButtonFieldProps) {
    return (
        <TouchableHighlight
            onPress={props.onPress}
            style={{
                backgroundColor: "#000",
                height: 44,
                display: "flex",
                alignSelf: "stretch",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#000",
                borderRadius: 8,
                shadowColor: "#000",
                shadowOffset: { 
                    width: 0, 
                    height: 1 
                },
                shadowOpacity: 0,
                shadowRadius: 1, 
                ...props.style,
            }}
        >
            <Text
                style={{
                    color: "#FFF",
                    fontSize: 16,
                    fontWeight: 600,
                    ...props.textStyle
                }}
            >
                {props.title}
            </Text>
        </TouchableHighlight>
    )
}