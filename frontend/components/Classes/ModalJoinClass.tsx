// Class Code
// Enter
import { Modal, Pressable, TextInput, TextInputChangeEvent, View } from "react-native";
import ThemedText from "../ThemedText";
import Button from "../Button";
import { useEffect, useState } from "react";
import { Ban, CircleAlert, CircleX, Frown, OctagonAlert, TriangleAlert, X } from "lucide-react-native";
import { colors, margin, shadow } from "@/theme";

interface ModalJoinClassProps {
    classCode: string;
    setClassCode: (classCode: string) => void;
    setShowJoinClass: (showJoinClass: boolean) => void;
    onJoin: () => Promise<boolean>;
}

export default function ModalJoinClass(props: ModalJoinClassProps) {
    const [failed, setFailed] = useState(false);


    useEffect(() => {
        setFailed(false);
    }, [props.classCode]);

    
    const joinClass = async () => {
        const joined = await props.onJoin();
        setFailed(!joined);
    }


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
                        backgroundColor: colors.schemes.light.surface,
                        borderRadius: 20
                    }}
                >
                    <View
                        style={{
                            paddingVertical: 12,
                            paddingHorizontal: 12,
                            flexDirection: "row",
                            justifyContent: "flex-end"
                        }}
                    >
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
                            onPress={() => props.setShowJoinClass(false)}
                        >
                            <X
                                size={12}
                                strokeWidth={3}
                                color={colors.schemes.light.onSurfaceVariant}
                            />
                        </Pressable>
                    </View>
                    <View
                        style={{
                            paddingTop: 12,
                            paddingBottom: 12,
                            paddingHorizontal: 25,
                        }}
                    >
                        <ThemedText
                            style={{
                                marginBottom: 2,
                                fontSize: 12,
                                fontWeight: 500,
                                letterSpacing: 0.2,
                                color: colors.schemes.light.onSurfaceVariant,
                            }}
                        >
                            JOIN CLASS
                        </ThemedText>
                        <ThemedText
                            style={{
                                fontSize: 18,
                                fontWeight: 500,
                                letterSpacing: -0.25,
                                color: colors.schemes.light.onSurfaceVariant
                            }}
                        >
                            Enter Class Code
                        </ThemedText>
                    </View>
                    <TextInput
                        value={props.classCode}
                        onChangeText={(text) => props.setClassCode(text)}
                        keyboardType="number-pad"
                        style={{
                            marginHorizontal: 24,
                            marginBottom: 12,
                            paddingVertical: 12,
                            paddingHorizontal: 12,
                            borderWidth: 1,
                            borderColor: colors.schemes.light.outlineVariant,
                            borderRadius: 12,
                            backgroundColor: colors.schemes.light.surfaceContainerHighest,
                            fontSize: 24,
                            fontWeight: 600,
                        }}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            marginHorizontal: 24,
                        }}
                    >
                        <Button
                            onPress={joinClass}
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
                                Join Class
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
        </Modal>
    )
}