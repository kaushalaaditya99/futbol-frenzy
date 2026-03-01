import { colors } from "@/theme";
import { Text, TextInput, View } from "react-native";
import ThemedText from "./ThemedText";

export interface TextInputFieldProps {
    label?: string;
    value?: string;
    placeholder?: string;
    onChangeText?: (text: string) => void;
    style?: {[k: string]: string|number};
}

export default function TextInputField(props: TextInputFieldProps) {
    return (
        <View
            style={{
                display: "flex",
                alignSelf: "stretch",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                ...props.style
            }}
        >
            <View>
                <ThemedText
                    style={{
                        marginBottom: 2,
                        fontSize: 14,
                        fontWeight: 500,
                        letterSpacing: 0.1,
                        color: colors.schemes.light.onSurfaceVariant
                    }}
                >
                    {props.label}
                </ThemedText>
                <TextInput
                    style={{
                        fontSize: 14,
                        fontFamily: "Inter_400Regular",
                        backgroundColor: "white",
                        width: "100%",
                        minWidth: "100%",
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: colors.schemes.light.outlineVariant,
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
        </View>
    )
}