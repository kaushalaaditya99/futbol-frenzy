import { Text, TextInput, View } from "react-native";

export interface TextInputFieldProps {
    label?: string;
    value?: string;
    placeholder?: string;
    onChangeText?: (text: string) => void;
}

export default function TextInputField(props: TextInputFieldProps) {
    return (
        <View>
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: 400
                }}
            >
                {props.label}
            </Text>
            <TextInput
                style={{
                    backgroundColor: "white",
                    width: "100%",
                    minWidth: "100%",
                    minHeight: 44,
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "#cacaca",
                    borderRadius: 8,
                    shadowColor: "#000",
                    shadowOffset: { 
                        width: 0, 
                        height: 1 
                    },
                    shadowOpacity: 0,
                    shadowRadius: 1, 
                }}
                value={props.value}
                onChangeText={props.onChangeText}
                placeholder={props.placeholder}
            />
        </View>
    )
}