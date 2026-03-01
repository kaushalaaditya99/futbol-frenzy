import { Modal, Pressable, TextInput, View } from "react-native";
import ThemedText from "../ThemedText";
import { colors, margin, shadow } from "@/theme";
import { CircleX, X } from "lucide-react-native";
import Button from "../Button";
import { useEffect, useState } from "react";
import TextInputField from "../TextInputField";
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider, Panel2, Panel3, Panel4, Panel5 } from 'reanimated-color-picker';

interface ModalCreateClassProps {
    imageBackgroundColor: string;
    setImageBackgroundColor: (imageBackgroundColor: string) => void;
    imageEmoji: string;
    setImageEmoji: (imageEmoji: string) => void;
    className: string;
    setClassName: (className: string) => void;
    setShowCreateClass: (showJoinClass: boolean) => void;
    onCreate: () => Promise<boolean>;
}

export default function ModalCreateClass(props: ModalCreateClassProps) {
    const [failed, setFailed] = useState(false);

    const [textColor, setTextColor] = useState("white");

    useEffect(() => {
        const regexHSL = /hsl\((\d{1,3}), (\d{1,3}%), (\d{1,3}%)\)/;
        if (!props.imageBackgroundColor || !regexHSL.test(props.imageBackgroundColor))
            return;

        const [hue, saturation, lightness] = props.imageBackgroundColor.substring(3, -1).split(", ");
        
        console.log(props.imageBackgroundColor.substring(3, -1).split(", "));
    }, [props.imageBackgroundColor]);

    return (
        <Modal
            visible={true}
            transparent={true}
            style={{
                flex: 1,
            }}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    backgroundColor: "#000000DA"
                }}
            >
                <View
                    style={{
                        marginHorizontal: margin.sm,
                        backgroundColor: "black",
                        borderRadius: 12
                    }}
                >
                    <View
                        style={{
                            paddingVertical: 20,
                            paddingHorizontal: 16,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottomWidth: 1,
                            borderColor: "black",
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            backgroundColor: "black"
                        }}
                    >
                        <View>
                            <ThemedText
                                style={{
                                    fontSize: 18,
                                    fontWeight: 500,
                                    letterSpacing: -0.25,
                                    color: colors.schemes.light.onPrimary
                                }}
                            >
                                Create a Class
                            </ThemedText>
                        </View>
                        <Pressable
                            style={{
                                width: 20,
                                height: 20,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 100,
                                backgroundColor: "#FFFFFF20"
                            }}
                            onPress={() => props.setShowCreateClass(false)}
                        >
                            <X
                                size={12}
                                strokeWidth={3}
                                color={"white"}
                            />
                        </Pressable>
                    </View>
                    <View
                        style={{
                            paddingVertical: 16,
                            backgroundColor: colors.schemes.light.surfaceContainerLowest,
                            borderBottomLeftRadius: 12,
                            borderBottomRightRadius: 12,
                        }}
                    >
                        <View
                            style={{
                                marginHorizontal: 24
                            }}
                        >
                            <TextInputField
                                label="Name of Class"
                                value={props.className}
                                onChangeText={props.setClassName}
                            />
                        </View>
                        <View
                            style={{
                                marginHorizontal: 24
                            }}   
                        >
                            <ColorPicker 
                                style={{ 
                                    width: "100%",
                                    borderWidth: 1,
                                    borderStyle: "dashed",
                                    borderColor: colors.schemes.light.outlineVariant,
                                    borderRadius: 12,
                                    ...shadow.sm
                                }} 
                                value='red' 
                                onChangeJS={(color) => {
                                    // 'worklet';
                                    console.log(color);
                                    console.log(color["hex"]);
                                    props.setImageBackgroundColor(color["hsl"]);
                                }}
                            >
                                <Panel4
                                    style={{
                                        borderRadius: 12
                                    }}
                                />
                            </ColorPicker>
                            {/* <TextInput
                                value={props.imageBackgroundColor}
                                onChangeText={(text) => props.setImageBackgroundColor(text)}
                                style={{
                                    paddingVertical: 12,
                                    paddingHorizontal: 12,
                                    borderWidth: 1,
                                    borderColor: colors.schemes.light.outlineVariant,
                                    borderRadius: 12,
                                    backgroundColor: colors.schemes.light.surfaceContainerHighest,
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                            /> */}
                        </View>
                        <View
                            style={{
                                marginHorizontal: 24
                            }}
                        >
                            <ThemedText
                                style={{
                                    marginBottom: 2,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    letterSpacing: 0.1,
                                    color: colors.schemes.light.onSurfaceVariant
                                }}
                            >
                                Abbreviation
                            </ThemedText>
                            <TextInput
                                value={props.imageEmoji}
                                maxLength={4}
                                onChangeText={(text) => props.setImageEmoji(text)}
                                style={{
                                    // aspectRatio: 1,
                                    width: "100%",
                                    height: 72, 
                                    borderWidth: 1,
                                    borderColor: props.imageBackgroundColor,
                                    borderRadius: 12,
                                    backgroundColor: props.imageBackgroundColor,
                                    fontSize: 48,
                                    fontWeight: 600,
                                    textAlign: "center"
                                }}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                marginHorizontal: 24,
                            }}
                        >
                            <Button
                                style1={{
                                    ...shadow.sm
                                }}
                            >
                                <ThemedText
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 500,
                                        letterSpacing: -0.25,
                                        color: "white"
                                    }}
                                >
                                    Create Class
                                </ThemedText>
                            </Button>
                        </View>
                        <View
                            style={{
                                marginHorizontal: 24,
                                marginVertical: 6,
                                marginBottom: 24,
                                paddingVertical: 8,
                                paddingHorizontal: 12,
                                flexDirection: "row",
                                alignItems: "flex-start",
                                columnGap: 6,
                                borderWidth: 1,
                                borderColor: colors.schemes.light.error,
                                borderStyle: "dashed",
                                borderRadius: 8,
                                backgroundColor: colors.schemes.light.errorContainer,
                                opacity: failed ? 1 : 0
                            }}
                        >
                            <CircleX
                                size={14}
                                color={colors.schemes.light.onErrorContainer}
                                style={{
                                    position: "relative",
                                    top: 1.5
                                }}
                            />
                            <View
                                style={{
                                    flexShrink: 1,
                                }}
                            >
                                <ThemedText
                                    style={{
                                        flexShrink: 1,
                                        fontSize: 12,
                                        fontWeight: 400,
                                        letterSpacing: 0.25,
                                        color: colors.schemes.light.onErrorContainer
                                    }}
                                >
                                    A class with this code was not found. Please try again.
                                </ThemedText>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}