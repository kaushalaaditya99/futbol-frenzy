import ButtonExit from "@/components/ui/button/ButtonExit";
import ThemedText from "@/components/ui/ThemedText";
import { fontSize, letterSpacing, margin } from "@/theme";
import { ReactNode } from "react"
import { Dimensions, Modal, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderWithCloseSpacious from "./HeaderWithCloseSpacious";

export interface BottomScreenProps {
    title?: string;
    children?: ReactNode;
    onClose?: () => void;
}

export default function BottomScreen(props: BottomScreenProps) {
    return (
        <Modal
            visible={true}
            transparent={true}
            animationType="slide"
            backdropColor={"#00000020"}
        >
            <SafeAreaView
                edges={["top"]}
                style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    backgroundColor: "#00000020"
                }}
            >
                <View
                    style={{
                        width: "100%",
                        height: Dimensions.get("screen").height / 2,
                        minHeight: Dimensions.get("screen").height / 2,
                        maxHeight: Dimensions.get("screen").height / 2,
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
            </SafeAreaView>
        </Modal>
    )
}