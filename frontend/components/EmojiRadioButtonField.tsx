import { Text, View } from "react-native";

export interface EmojiRadioButtonFieldProps {
    value?: boolean;
    emoji?: string;
    label?: string;
    description?: string;
}

export default function EmojiRadioButtonField(props: EmojiRadioButtonFieldProps) {
    return (
        <View
            style={{
                display: "flex",
                alignSelf: "flex-start",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "black",
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 12,
                backgroundColor:  "#FFF"
            }}
        >
            <View
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 16,
                    height: 16,
                    borderRadius: 100,
                    backgroundColor: "rwhited",
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "black"
                }}
            >
                <View
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: 100,
                        backgroundColor: props.value ? "#000" : "#FFF"
                    }}
                >

                </View>
            </View>
            <Text
                style={{
                    fontSize: 48,
                    textAlign: "center",
                    marginBottom: 8
                }}
            >
                {props.emoji}
            </Text>
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: 600,
                    textAlign: "center",
                    color: "#000"
                }}
            >
                {props.label}
            </Text>
            <Text
                style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "gray",
                    textAlign: "center"
                }}
            >
                {props.description}
            </Text>
        </View>
    )
}