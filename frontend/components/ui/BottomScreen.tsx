import ButtonExit from "@/components/ui/button/ButtonExit";
import ThemedText from "@/components/ui/ThemedText";
import { fontSize, letterSpacing, margin, padding, spacing } from "@/theme";
import { ReactNode } from "react"
import { Dimensions, Modal, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderWithCloseSpacious from "./HeaderWithCloseSpacious";

export interface BottomScreenProps {
    title?: string;
    children?: ReactNode;
    onClose?: () => void;
    scroll?: boolean;
    fitContent?: boolean;
}

export default function BottomScreen(props: BottomScreenProps) {
    return (
        <Modal
            visible={true}
            transparent={true}
            animationType="none"
            backdropColor={"#00000020"}
        >
            <SafeAreaView
                edges={["top"]}
                style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    backgroundColor: "#000000D0"
                }}
            >
                {props.scroll &&
                    <ScrollView
                        contentContainerStyle={{
                            paddingBottom: spacing.xl
                        }}
                        style={{
                            width: "100%",
                            height: props.fitContent ? undefined : Dimensions.get("screen").height * 0.66,
                            minHeight: props.fitContent ? undefined : Dimensions.get("screen").height * 0.66,
                            maxHeight: props.fitContent ? undefined : Dimensions.get("screen").height * 0.66,
                            padding: margin.sm,
                            backgroundColor: "white"
                        }}
                    >
                        <HeaderWithCloseSpacious
                            header={props.title}
                            onClose={props.onClose}
                        />
                        {props.children}
                    </ScrollView>
                }
                {!props.scroll &&
                    <View
                        style={{
                            width: "100%",
                            height: props.fitContent ? undefined : Dimensions.get("screen").height * 0.66,
                            minHeight: props.fitContent ? undefined : Dimensions.get("screen").height * 0.66,
                            maxHeight: props.fitContent ? undefined : Dimensions.get("screen").height * 0.66,
                            padding: margin.sm,
                            backgroundColor: "white"
                        }}
                    >
                        <HeaderWithCloseSpacious
                            header={props.title}
                            onClose={props.onClose}
                        />
                        {props.children}
                    </View>
                }
            </SafeAreaView>
        </Modal>
    )
}